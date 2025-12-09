import os
import json
from fastapi import APIRouter, Form, HTTPException, Depends
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.config import UPLOAD_DIR, ADMIN_KEY, logger
from app.core.security import create_access_token, verify_admin
from app.models.tables import Submission, Student

router = APIRouter(prefix="/admin")

# 1. 登录
@router.post("/login")
async def admin_login(key: str = Form(...)):
    if key != ADMIN_KEY:
        logger.warning(f"⚠️ 登录失败，密钥错误")
        raise HTTPException(status_code=401, detail="密钥错误")
    
    token = create_access_token()
    logger.info(f"🔑 管理员登录，Token: {token}")
    return {"status": "success", "token": token}

# 2. 获取列表
@router.get("/submissions", dependencies=[Depends(verify_admin)])
async def get_submissions(db: Session = Depends(get_db)):
    submissions = db.query(Submission).options(
        joinedload(Submission.students)
    ).order_by(Submission.submission_time.desc()).all()
    return submissions

# 3. 删除记录
@router.delete("/submission", dependencies=[Depends(verify_admin)])
async def delete_submission(id: int, db: Session = Depends(get_db)):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="未找到")

    if sub.filename:
        try:
            os.remove(os.path.join(UPLOAD_DIR, sub.filename))
        except:
            pass

    db.delete(sub)
    db.commit()
    return {"status": "success"}

# 4. 更新文本信息
@router.post("/update_submission", dependencies=[Depends(verify_admin)])
async def update_submission(
    id: int = Form(...),
    track_name: str = Form(...),
    student_infos: str = Form(...),
    target_email: str = Form(...),
    db: Session = Depends(get_db)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="未找到")

    sub.track_name = track_name
    sub.target_email = target_email

    db.query(Student).filter(Student.submission_id == id).delete()

    try:
        new_students_data = json.loads(student_infos)
        for s in new_students_data:
            db.add(Student(
                submission_id=id,
                name=s.get('name'),
                cls=s.get('cls') or s.get('className'),
                student_id=s.get('id') or s.get('studentId')
            ))
    except Exception as e:
        logger.error(f"更新解析失败: {e}")
        raise HTTPException(status_code=422, detail="数据格式错误")

    db.commit()
    return {"status": "success"}

# 5. 评分相关接口
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