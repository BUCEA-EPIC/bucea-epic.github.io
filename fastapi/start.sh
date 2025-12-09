#!/bin/bash
# 激活虛擬環境並運行 uvicorn

cd /home/fanyuo/fastapi
source venv/bin/activate
# 指向 app 包中的 main 模塊
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4