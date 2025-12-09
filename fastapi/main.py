import os
import shutil
import smtplib
import logging
import sys
import json
import re
import uuid
from email.mime.text import MIMEText
from datetime import datetime, timedelta
from typing import Optional, List
from urllib.parse import quote  # 🟢 [新增] 用于处理中文文件名编码

from fastapi import FastAPI, Form, File, UploadFile, HTTPException, Header, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse  # 🟢 [新增] 用于发送文件流
from pydantic import BaseModel, EmailStr

# 引入 Boolean, text, inspect 用于数据库迁移
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Boolean, text, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship, joinedload

# ==========================================
# 配置与日志
# ==========================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("FastAPI")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
DB_PATH = os.path.join(BASE_DIR, "submissions.db")

# 🟢 [调试] 打印当前文件保存的绝对路径
logger.info(f"📂 文件存储目录(UPLOAD_DIR): {UPLOAD_DIR}")

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
try:
    os.chmod(UPLOAD_DIR, 0o777)
except:
    pass

app = FastAPI(title="Submission & Admin API", root_path="/api")
# 🟢 [保留] 核心：保留原有的静态文件挂载
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")

# --- SMTP 配置 ---
SMTP_HOST = "smtp.163.com"
SMTP_PORT = 465
SMTP_USER = "fanyuovan@163.com"
SMTP_PASS = "KGpni32fvyjwR9Hj"
TO_EMAIL = "fanyuovan@outlook.com"

# --- 数据库配置 ---
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ==========================================
# 数据库模型
# ==========================================

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    name = Column(String)
    cls = Column(String)
    student_id = Column(String)
    submission = relationship("Submission", back_populates="students")


class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    track_name = Column(String, index=True)
    target_email = Column(String)
    filename = Column(String)
    original_filename = Column(String)
    file_url = Column(String)
    submission_time = Column(DateTime, default=datetime.now)

    # 新增字段：评分、标星、是否已评、备注
    score = Column(Integer, default=0)
    is_starred = Column(Boolean, default=False)
    is_graded = Column(Boolean, default=False)
    remark = Column(String, default="")

    students = relationship("Student", back_populates="submission", cascade="all, delete-orphan")


# 初始化数据库 & 自动迁移
try:
    Base.metadata.create_all(bind=engine)

    def migrate_db():
        inspector = inspect(engine)
        if not inspector.has_table("submissions"):
            return

        columns = [c['name'] for c in inspector.get_columns('submissions')]

        with engine.connect() as conn:
            if 'score' not in columns:
                conn.execute(text("ALTER TABLE submissions ADD COLUMN score INTEGER DEFAULT 0"))
            if 'is_starred' not in columns:
                conn.execute(text("ALTER TABLE submissions ADD COLUMN is_starred BOOLEAN DEFAULT 0"))
            if 'is_graded' not in columns:
                conn.execute(text("ALTER TABLE submissions ADD COLUMN is_graded BOOLEAN DEFAULT 0"))
            if 'remark' not in columns:
                conn.execute(text("ALTER TABLE submissions ADD COLUMN remark TEXT DEFAULT ''"))
            conn.commit()

    migrate_db()

    if os.path.exists(DB_PATH):
        os.chmod(DB_PATH, 0o666)
except Exception as e:
    logger.warning(f"数据库初始化权限警告: {e}")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- 日志中间件 ---
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"👉 请求: {request.method} {request.url.path}")
    response = await call_next(request)
    return response


# ==========================================
# 安全配置
# ==========================================
ADMIN_KEY = "314317"
ACCESS_TOKENS = {}
TOKEN_EXPIRE_MINUTES = 60


def verify_admin(x_admin_token: Optional[str] = Header(None)):
    if not x_admin_token:
        raise HTTPException(status_code=403, detail="未提供认证 Token")
    if x_admin_token == ADMIN_KEY:
        return True
    if x_admin_token not in ACCESS_TOKENS:
        raise HTTPException(status_code=403, detail="无效的 Token，请重新登录")
    expire_time = ACCESS_TOKENS[x_admin_token]
    if datetime.now() > expire_time:
        del ACCESS_TOKENS[x_admin_token]
        raise HTTPException(status_code=403, detail="会话已过期，请重新登录")
    return True


# ==========================================
# 路由部分
# ==========================================

# 1. 作品提交
@app.post("/submit")
async def submit_work(
        track_name: str = Form(...),
        target_email: str = Form(...),
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

    def clean_str(s):
        if not s: return ""
        return re.sub(r'[\\/:*?"<>| \s]', '', str(s))

    member_parts = []
    for s_data in student_list_data:
        c_cls = clean_str(s_data.get('className', ''))
        c_name = clean_str(s_data.get('name', ''))
        c_id = clean_str(s_data.get('studentId', ''))
        member_parts.append(f"{c_cls}{c_name}{c_id}")

    full_members_str = "".join(member_parts)
    if not full_members_str:
        full_members_str = "UnknownUser"

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_ext = os.path.splitext(work_file.filename)[1]
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
        target_email=target_email,
        filename=save_filename,
        original_filename=work_file.filename,
        file_url=f"/static/{save_filename}"
    )
    db.add(new_submission)
    db.flush()

    for s_data in student_list_data:
        new_student = Student(
            submission_id=new_submission.id,
            name=s_data.get('name'),
            cls=s_data.get('className'),
            student_id=s_data.get('studentId')
        )
        db.add(new_student)

    db.commit()
    logger.info(f"✅ 提交成功: {save_filename}")
    return {"status": "success", "message": "提交成功"}


# 2. 管理员登录
@app.post("/admin/login")
async def admin_login(key: str = Form(...)):
    if key != ADMIN_KEY:
        logger.warning(f"⚠️ 登录失败，密钥错误")
        raise HTTPException(status_code=401, detail="密钥错误")

    token = str(uuid.uuid4())
    expire_time = datetime.now() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    ACCESS_TOKENS[token] = expire_time
    logger.info(f"🔑 管理员登录，Token: {token}")
    return {"status": "success", "token": token}


# 3. 获取列表
@app.get("/admin/submissions")
async def get_submissions(
        authorized: bool = Depends(verify_admin),
        db: Session = Depends(get_db)
):
    submissions = db.query(Submission).options(joinedload(Submission.students)).order_by(
        Submission.submission_time.desc()).all()
    return submissions


# 4. 删除记录
@app.delete("/admin/submission")
async def delete_submission(
        id: int,
        authorized: bool = Depends(verify_admin),
        db: Session = Depends(get_db)
):
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


# 5. 更新文本信息
@app.post("/admin/update_submission")
async def update_submission(
        id: int = Form(...),
        track_name: str = Form(...),
        student_infos: str = Form(...),
        target_email: str = Form(...),
        authorized: bool = Depends(verify_admin),
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


# ==========================================
# 评分、状态、备注相关接口
# ==========================================

# 6. 切换标星状态
@app.post("/admin/toggle_star")
async def toggle_star(
        id: int = Form(...),
        is_starred: bool = Form(...),
        authorized: bool = Depends(verify_admin),
        db: Session = Depends(get_db)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="未找到")

    sub.is_starred = is_starred
    db.commit()
    return {"status": "success"}


# 7. 更新评分
@app.post("/admin/update_score")
async def update_score(
        id: int = Form(...),
        score: int = Form(...),
        authorized: bool = Depends(verify_admin),
        db: Session = Depends(get_db)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="未找到")

    sub.score = score
    sub.is_graded = True
    db.commit()
    return {"status": "success"}


# 8. 单独切换是否已评状态
@app.post("/admin/toggle_graded")
async def toggle_graded(
        id: int = Form(...),
        is_graded: bool = Form(...),
        authorized: bool = Depends(verify_admin),
        db: Session = Depends(get_db)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="未找到")

    sub.is_graded = is_graded
    db.commit()
    return {"status": "success"}


# 9. 更新备注
@app.post("/admin/update_remark")
async def update_remark(
        id: int = Form(...),
        remark: str = Form(...),
        authorized: bool = Depends(verify_admin),
        db: Session = Depends(get_db)
):
    sub = db.query(Submission).filter(Submission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="未找到")

    sub.remark = remark
    db.commit()
    return {"status": "success"}

# ---------------------------------------------------------
# 🟢 [新增] 10. 安全下载接口 (解决中文乱码问题)
# ---------------------------------------------------------
@app.get("/download/{submission_id}")
async def download_file(
    submission_id: int,
    db: Session = Depends(get_db)
):
    # 1. 查数据库
    sub = db.query(Submission).filter(Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="记录不存在")

    # 2. 拼路径
    file_path = os.path.join(UPLOAD_DIR, sub.filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="服务器上找不到该文件")

    # 3. 编码文件名，防止浏览器乱码
    filename_encoded = quote(sub.filename)

    # 4. 返回流
    return FileResponse(
        path=file_path,
        filename=sub.filename,
        media_type='application/octet-stream',
        headers={
            "Content-Disposition": f"attachment; filename*=utf-8''{filename_encoded}"
        }
    )


# 11. 联系我们
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str


@app.post("/contact")
async def contact(form: ContactForm):
    try:
        msg = MIMEText(f"姓名: {form.name}\n邮箱: {form.email}\n\n{form.message}", 'plain', 'utf-8')
        msg["Subject"] = f"网站留言: {form.name}"
        msg["From"] = SMTP_USER
        msg["To"] = TO_EMAIL
        msg["Reply-To"] = form.email

        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        return {"message": "发送成功"}
    except Exception as e:
        logger.error(f"邮件失败: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    try:
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    except:
        uvicorn.run(app, host="0.0.0.0", port=8000)