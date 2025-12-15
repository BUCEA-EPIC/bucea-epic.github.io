from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

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
    # 🟢 已删除 target_email
    filename = Column(String)
    original_filename = Column(String)
    file_url = Column(String)
    submission_time = Column(DateTime, default=datetime.now)

    # 评分与状态
    score = Column(Integer, default=0)
    is_starred = Column(Boolean, default=False)
    is_graded = Column(Boolean, default=False)
    remark = Column(String, default="")

    students = relationship("Student", back_populates="submission", cascade="all, delete-orphan")

class AdminToken(Base):
    __tablename__ = "admin_tokens"
    token = Column(String, primary_key=True, index=True)
    expire_time = Column(DateTime)