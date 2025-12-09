@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: ================= 配置区域 =================

:: 1. 本地路径定义
:: 获取当前脚本所在目录
set SCRIPT_DIR=%~dp0

:: 定义项目根目录 (scripts 的上一级)
set PROJECT_ROOT=%SCRIPT_DIR%..

:: 定义本地 FastAPI 相关目录
set LOCAL_UPLOADS_DIR=%PROJECT_ROOT%\fastapi\uploads
set LOCAL_DB_PATH=%PROJECT_ROOT%\fastapi\submissions.db

:: 2. 服务器配置
set REMOTE_USER=fanyuo
set REMOTE_HOST=59.110.39.142
set SSH_PORT=22

:: 服务器端 FastAPI 的部署根目录 (根据你的 start.sh 确认为此路径)
set REMOTE_BASE_DIR=/home/fanyuo/fastapi
set REMOTE_UPLOADS_DIR=%REMOTE_BASE_DIR%/uploads
set REMOTE_DB_PATH=%REMOTE_BASE_DIR%/submissions.db
set REMOTE_DB_BACKUP_PATH=%REMOTE_BASE_DIR%/submissions.db.bak

:: 3. SSH 密钥路径 (假设在 scripts/.ssh/id_rsa)
set SSH_KEY=%SCRIPT_DIR%.ssh\id_rsa

:: 4. 工具路径
:: 如果你的环境不同，请修改此处指向正确的 scp.exe 和 ssh.exe
set SCP_PATH=C:\Files\Git\usr\bin\scp.exe
set SSH_PATH=C:\Files\Git\usr\bin\ssh.exe

:: ================================================

echo.
echo ==============================================
echo      开始同步服务器数据到本地 (Data Sync)
echo ==============================================
echo.

:: 检查 SSH Key 是否存在
if not exist "%SSH_KEY%" (
    echo [Error] 找不到 SSH 密钥: %SSH_KEY%
    pause
    exit /b 1
)

:: ------------------------------------------------
:: 步骤 1: 同步 Uploads 目录
:: ------------------------------------------------
echo [Step 1/3] 正在下载服务器上传文件 (uploads)...
echo 远程目录: %REMOTE_UPLOADS_DIR%
echo 本地目录: %LOCAL_UPLOADS_DIR%

if not exist "%LOCAL_UPLOADS_DIR%" mkdir "%LOCAL_UPLOADS_DIR%"

:: 使用 -r 递归复制，注意路径结尾
"%SCP_PATH%" -i "%SSH_KEY%" -P %SSH_PORT% -r %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_UPLOADS_DIR%/* "%LOCAL_UPLOADS_DIR%"

if %ERRORLEVEL% neq 0 (
    echo [Error] 文件同步失败！请检查网络或路径。
    pause
    exit /b 1
) else (
    echo [Success] 文件同步完成。
)

:: ------------------------------------------------
:: 步骤 2: 服务器端数据库安全备份 (使用 sqlite3 .backup)
:: ------------------------------------------------
echo.
echo [Step 2/3] 正在执行数据库热备份 (sqlite3 .backup)...

:: 核心修改：使用 sqlite3 的 .backup 命令代替 cp，确保运行中数据的一致性
:: 注意：这需要服务器上已安装 sqlite3 (sudo apt install sqlite3)
"%SSH_PATH%" -i "%SSH_KEY%" -p %SSH_PORT% %REMOTE_USER%@%REMOTE_HOST% "sqlite3 %REMOTE_DB_PATH% \".backup '%REMOTE_DB_BACKUP_PATH%'\""

if %ERRORLEVEL% neq 0 (
    echo [Error] 远程备份失败！
    echo 可能原因: 
    echo 1. 服务器未安装 sqlite3 工具。
    echo 2. 数据库文件路径错误。
    pause
    exit /b 1
) else (
    echo [Success] 远程安全备份已创建: %REMOTE_DB_BACKUP_PATH%
)

:: ------------------------------------------------
:: 步骤 3: 下载并还原数据库
:: ------------------------------------------------
echo.
echo [Step 3/3] 正在下载并还原数据库到本地...

"%SCP_PATH%" -i "%SSH_KEY%" -P %SSH_PORT% %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_DB_BACKUP_PATH% "%LOCAL_DB_PATH%"

if %ERRORLEVEL% neq 0 (
    echo [Error] 数据库下载失败！
    pause
    exit /b 1
) else (
    echo [Success] 数据库已还原至: %LOCAL_DB_PATH%
)

echo.
echo ==============================================
echo      所有同步任务执行完毕！
echo ==============================================
pause