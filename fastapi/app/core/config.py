import os
import logging
import sys

# 基础路径配置
# 假设当前文件在 app/core/，回退两级到 fastapi/ 目录
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
DB_PATH = os.path.join(BASE_DIR, "submissions.db")

# 确保上传目录存在
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
try:
    os.chmod(UPLOAD_DIR, 0o777)
except:
    pass

# 日志配置
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("FastAPI")

# 安全配置
ADMIN_KEY = "314317"
TOKEN_EXPIRE_MINUTES = 60

# 邮件配置
SMTP_HOST = "smtp.163.com"
SMTP_PORT = 465
SMTP_USER = "fanyuovan@163.com"
SMTP_PASS = "KGpni32fvyjwR9Hj"
TO_EMAIL = "fanyuovan@outlook.com"