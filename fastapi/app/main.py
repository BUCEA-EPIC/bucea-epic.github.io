from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import CORS_ALLOW_ORIGINS, logger
from app.core.database import init_db
from app.routers import public, admin

# 初始化数据库
init_db()

app = FastAPI(title="Submission & Admin API", root_path="/api")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOW_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 日志中间件
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"👉 请求: {request.method} {request.url.path}")
    response = await call_next(request)
    return response

# 注册路由
app.include_router(public.router)
app.include_router(admin.router)

if __name__ == "__main__":
    import uvicorn
    # 本地开发调试用
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
