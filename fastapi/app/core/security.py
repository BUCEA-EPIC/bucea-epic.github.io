import secrets
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, Header, Depends
from sqlalchemy.orm import Session

from app.core.config import TOKEN_EXPIRE_MINUTES
from app.core.database import get_db
from app.models.tables import AdminToken


def create_access_token(db: Session):
    """
    生成 Token 并存入数据库
    """
    token = secrets.token_urlsafe(32)
    expire_time = datetime.now() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)

    db.query(AdminToken).filter(AdminToken.expire_time < datetime.now()).delete()
    db_token = AdminToken(token=token, expire_time=expire_time)
    db.add(db_token)
    db.commit()

    return token


def verify_admin(
    x_admin_token: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    验证 Token 是否存在于数据库且未过期
    """
    if not x_admin_token:
        raise HTTPException(status_code=403, detail="未提供认证 Token")

    token_record = db.query(AdminToken).filter(AdminToken.token == x_admin_token).first()

    if not token_record:
        raise HTTPException(status_code=403, detail="无效的 Token，请重新登录")

    if datetime.now() > token_record.expire_time:
        db.delete(token_record)
        db.commit()
        raise HTTPException(status_code=403, detail="会话已过期，请重新登录")

    return True
