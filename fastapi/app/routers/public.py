import os
import shutil
import json
import re
from datetime import datetime
from urllib.parse import quote

from fastapi import APIRouter, Form, File, UploadFile, HTTPException, Depends
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import UPLOAD_DIR, logger
from app.core.security import verify_admin
from app.models.tables import Submission, Student
from app.utils.email import send_contact_email

router = APIRouter()

# --- Pydantic 模型 ---
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

# 1. 联系我们
@router.post("/contact")
async def contact(form: ContactForm):
    try:
        send_contact_email(form.name, form.email, form.message)
        return {"message": "发送成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. 管理员文件下载
@router.get("/download/{submission_id}", dependencies=[Depends(verify_admin)])
async def download_file(submission_id: int, db: Session = Depends(get_db)):
    sub = db.query(Submission).filter(Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="记录不存在")
    if not sub.filename:
        raise HTTPException(status_code=404, detail="记录未关联文件")

    upload_root = os.path.abspath(UPLOAD_DIR)
    file_path = os.path.abspath(os.path.join(upload_root, sub.filename))
    if not file_path.startswith(upload_root + os.sep):
        raise HTTPException(status_code=400, detail="文件路径无效")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="服务器上找不到该文件")

    filename_encoded = quote(sub.filename)
    return FileResponse(
        path=file_path,
        filename=sub.filename,
        media_type='application/octet-stream',
        headers={"Content-Disposition": f"attachment; filename*=utf-8''{filename_encoded}"}
    )

# 3. 作品提交 (🟢 已移除 target_email)
@router.post("/submit")
async def submit_work(
    track_name: str = Form(...),
    # target_email: str = Form(...),  <-- 已删除
    student_infos: str = Form(...),
    work_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    logger.info(f"📝 提交赛道: {track_name}")
    try:
        student_list_data = json.loads(student_infos)
        if not isinstance(student_list_data, list) or len(student_list_data) == 0:
            raise ValueError("学生列表为空")
    except Exception as e:
        logger.error(f"JSON解析失败: {e}")
        raise HTTPException(status_code=422, detail="学生信息格式错误")

    # 清理文件名逻辑
    def clean_str(s):
        if not s: return ""
        return re.sub(r'[\\/:*?"<>| \s]', '', str(s))

    member_parts = []
    for s_data in student_list_data:
        c_cls = clean_str(s_data.get('className', ''))
        c_name = clean_str(s_data.get('name', ''))
        c_id = clean_str(s_data.get('studentId', ''))
        member_parts.append(f"{c_cls}{c_name}{c_id}")

    full_members_str = "".join(member_parts) or "UnknownUser"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    original_filename = work_file.filename or "submission"
    file_ext = os.path.splitext(original_filename)[1]
    save_filename = f"{full_members_str}_{timestamp}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, save_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(work_file.file, buffer)
        os.chmod(file_path, 0o644)
    except Exception as e:
        logger.error(f"保存文件失败: {e}")
        raise HTTPException(status_code=500, detail="文件保存失败")

    new_submission = Submission(
        track_name=track_name,
        # target_email=target_email, <-- 已删除
        filename=save_filename,
        original_filename=original_filename,
        file_url=None
    )
    db.add(new_submission)
    db.flush()

    for s_data in student_list_data:
        db.add(Student(
            submission_id=new_submission.id,
            name=s_data.get('name'),
            cls=s_data.get('className'),
            student_id=s_data.get('studentId')
        ))

    db.commit()
    logger.info(f"✅ 提交成功: {save_filename}")
    return {"status": "success", "message": "提交成功"}
