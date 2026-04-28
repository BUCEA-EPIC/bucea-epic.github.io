import os
import logging
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def _load_env_file(path: str) -> None:
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as env_file:
        for raw_line in env_file:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_env_file(os.path.join(BASE_DIR, ".env"))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("FastAPI")


def _env(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def _env_int(name: str, default: int) -> int:
    value = _env(name)
    if not value:
        return default
    try:
        return int(value)
    except ValueError:
        logger.warning("%s 配置无效，使用默认值 %s", name, default)
        return default


def _env_path(name: str, default: str) -> str:
    value = _env(name)
    if not value:
        return default
    return value if os.path.isabs(value) else os.path.join(BASE_DIR, value)


def _env_list(name: str, default: str):
    raw = _env(name, default)
    return [item.strip() for item in raw.split(",") if item.strip()]

# 基础路径配置
UPLOAD_DIR = _env_path("UPLOAD_DIR", os.path.join(BASE_DIR, "uploads"))
DB_PATH = _env_path("DB_PATH", os.path.join(BASE_DIR, "submissions.db"))

os.makedirs(UPLOAD_DIR, exist_ok=True)
try:
    os.chmod(UPLOAD_DIR, 0o755)
except OSError as exc:
    logger.warning("上传目录权限设置失败: %s", exc)

# 安全配置
ADMIN_KEY = _env("ADMIN_KEY")
TOKEN_EXPIRE_MINUTES = _env_int("TOKEN_EXPIRE_MINUTES", 60 * 24)
CORS_ALLOW_ORIGINS = _env_list(
    "CORS_ALLOW_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
)
