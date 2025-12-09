@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: ================= Configuration =================
set LOCAL_DIST_DIR=./dist
set REMOTE_USER=fanyuo
set REMOTE_HOST=59.110.39.142
set REMOTE_DIR=/var/www/epic314
set SSH_PORT=22

:: Git installation directory (for SCP/SSH)
set SCP_PATH=C:\Files\Git\usr\bin\scp.exe
set SSH_PATH=C:\Files\Git\usr\bin\ssh.exe
set SSH_KEY=.ssh\id_rsa
:: ================================================

echo ========================================
echo Starting Vue project deployment...
echo ========================================

:: 1. Build Vue project
echo Step 1: Building Vue project...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Build failed, exiting deployment!
    pause
    exit /b 1
)

:: 2. Upload dist folder to remote server
echo Step 2: Uploading dist folder to remote server...

:: Convert relative backslashes to forward slashes for scp
set LOCAL_DIST_DIR_UNIX=%LOCAL_DIST_DIR:\=/%

"%SCP_PATH%" -i "%SSH_KEY%" -P %SSH_PORT% -r "%LOCAL_DIST_DIR_UNIX%" %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_DIR%
if %ERRORLEVEL% neq 0 (
    echo Upload failed, exiting deployment!
    pause
    exit /b 1
)

echo ========================================
echo Deployment completed successfully
echo ========================================
pause
