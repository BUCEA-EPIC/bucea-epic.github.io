#!/bin/bash
# 激活虚拟环境并运行 uvicorn

cd /home/fanyuo/fastapi
source venv/bin/activate
exec app.uvicorn main:app --host 0.0.0.0 --port 8000

