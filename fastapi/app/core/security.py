import uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, Header
from app.core.config import ADMIN_KEY, TOKEN_EXPIRE_MINUTES

# 简单的内存 Token 存储
ACCESS_TOKENS = {}

def verify_admin(x_admin_token: Optional[str] = Header(None)):
    if not x_admin_token:
        raise HTTPException(status_code=403, detail="未提供认证 Token")
    
    # 允许使用原始密钥直接访问（用于调试或备用）
    if x_admin_token == ADMIN_KEY:
        return True
        
    if x_admin_token not in ACCESS_TOKENS:
        raise HTTPException(status_code=403, detail="无效的 Token，请重新登录")
        
    expire_time = ACCESS_TOKENS[x_admin_token]
    if datetime.now() > expire_time:
        del ACCESS_TOKENS[x_admin_token]
        raise HTTPException(status_code=403, detail="会话已过期，请重新登录")
    return True

def create_access_token():
    token = str(uuid.uuid4())
    expire_time = datetime.now() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    ACCESS_TOKENS[token] = expire_time
    return token