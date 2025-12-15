import os
import json
import io
from datetime import datetime
import openpyxl
from openpyxl.styles import Font, Alignment

from fastapi import APIRouter, Form, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.config import UPLOAD_DIR, ADMIN_KEY, logger
from app.core.security import create_access_token, verify_admin
from app.models.tables import Submission, Student

router = APIRouter(prefix="/admin")

# --- 工具函數：生成 Excel 文件流 ---
def _generate_excel_response(db: Session):
    # 查詢數據
    submissions = db.query(Submission).options(
        joinedload(Submission.students)
    ).order_by(Submission.submission_time.desc()).all()

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "比赛提交记录"

    # 表头 (已移除联系邮箱，防止报错)
    headers = [
        "ID", "赛道", "成员信息 (姓名-班级-学号)", 
        "提交时间", "原始文件名", "评分", "备注", "是否收藏", "是否已评"
    ]
    ws.append(headers)

    # 樣式設置
    header_font = Font(bold=True)
    for cell in ws[1]:
        cell.font = header_font
        cell.alignment = Alignment(horizontal='center', vertical='center')

    for sub in submissions:
        # 拼接学生信息
        students_info = "\n".join([
            f"{s.name} - {s.cls} - {s.student_id}" 
            for s in sub.students
        ])
        
        submit_time_str = sub.submission_time.strftime("%Y-%m-%d %H:%M:%S") if sub.submission_time else ""

        # 注意：这里移除了 sub.target_email，修复了 AttributeError
        row = [
            sub.id,
            sub.track_name,
            students_info,
            submit_time_str,
            sub.original_filename,
            sub.score,
            sub.remark,
            "是" if sub.is_starred else "否",
            "是" if sub.is_graded else "否"
        ]
        ws.append(row)

    # 調整列寬
    ws.column_dimensions['B'].width = 20
    ws.column_dimensions['C'].width = 40
    ws.column_dimensions['D'].width = 20
    ws.column_dimensions['E'].width = 30
    ws.column_dimensions['G'].width = 30

    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(wrap_text=True, vertical='center')

    # 寫入內存
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)

    # 生成文件名
    filename = f"submissions_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"

    # 返回流式響應，強制下載
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# --- 🟢 公開直接下載接口 (无验证) ---
@router.get("/public_download_excel")
async def public_download_excel(db: Session = Depends(get_db)):
    """
    直接访问此 URL 即可触发浏览器下载。
    無需密鑰，無需 HTML 跳轉。
    """
    logger.info("有人访问了公开 Excel 下载接口")
    return _generate_excel_response(db)


# ==========================================
# 原有管理接口 (保持不變)
# ==========================================

@router.post("/login")
async def admin_login(key: str = Form(...), db: Session = Depends(get_db)):
    if key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="密钥错误")
    return {"status": "success", "token": create_access_token(db)}

@router.get("/submissions", dependencies=[Depends(verify_admin)])
async def get_submissions(db: Session = Depends(get_db)):
    return db.query(Submission).options(
        joinedload(Submission.students)
    ).order_by(Submission.submission_time.desc()).all()

# 后台管理用的带权限导出接口
@router.get("/export_excel", dependencies=[Depends(verify_admin)])
async def export_excel(db: Session = Depends(get_db)):
    return _generate_excel_response(db)

@router.delete("/submission", dependencies=[Depends(verify_admin)])
async def delete_submission(id: int, db: Session = Depends(get_db)):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if sub:
        if sub.filename:
            try:
                os.remove(os.path.join(UPLOAD_DIR, sub.filename))
            except: pass
        db.delete(sub)
        db.commit()
    return {"status": "success"}

@router.post("/update_submission", dependencies=[Depends(verify_admin)])
async def update_submission(id: int = Form(...), track_name: str = Form(...), student_infos: str = Form(...), target_email: str = Form(...), db: Session = Depends(get_db)):
    # 注意：update 接口可能仍接收 target_email 参数，但如果数据库没字段，赋值会报错
    # 建议暂时保留参数接收，但不赋值给 sub.target_email，或者确保数据库已迁移
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub: raise HTTPException(status_code=404)
    
    sub.track_name = track_name
    # sub.target_email = target_email  <-- 暂时注释掉这行以防止报错，直到数据库字段修复
    
    db.query(Student).filter(Student.submission_id == id).delete()
    
    try:
        new_students = json.loads(student_infos)
        for s in new_students:
            db.add(Student(submission_id=id, name=s.get('name'), cls=s.get('cls') or s.get('className'), student_id=s.get('id') or s.get('studentId')))
    except: raise HTTPException(status_code=422)
    
    db.commit()
    return {"status": "success"}

@router.post("/toggle_star", dependencies=[Depends(verify_admin)])
async def toggle_star(id: int = Form(...), is_starred: bool = Form(...), db: Session = Depends(get_db)):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if sub:
        sub.is_starred = is_starred
        db.commit()
    return {"status": "success"}

@router.post("/update_score", dependencies=[Depends(verify_admin)])
async def update_score(id: int = Form(...), score: int = Form(...), db: Session = Depends(get_db)):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if sub:
        sub.score = score
        sub.is_graded = True
        db.commit()
    return {"status": "success"}

@router.post("/toggle_graded", dependencies=[Depends(verify_admin)])
async def toggle_graded(id: int = Form(...), is_graded: bool = Form(...), db: Session = Depends(get_db)):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if sub:
        sub.is_graded = is_graded
        db.commit()
    return {"status": "success"}

@router.post("/update_remark", dependencies=[Depends(verify_admin)])
async def update_remark(id: int = Form(...), remark: str = Form(...), db: Session = Depends(get_db)):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if sub:
        sub.remark = remark
        db.commit()
    return {"status": "success"}