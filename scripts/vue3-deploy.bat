@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: ================= Configuration =================

:: 1. Path Definitions
:: Get current script directory
set SCRIPT_DIR=%~dp0

:: Define Project Root (One level up from scripts)
set PROJECT_ROOT=%SCRIPT_DIR%..

:: [IMPORTANT] Your frontend folder name (vue-client or frontend)
set FRONTEND_DIR_NAME=vue3

:: Combine to get absolute frontend path
set FRONTEND_DIR=%PROJECT_ROOT%\%FRONTEND_DIR_NAME%

:: Define dist path
set LOCAL_DIST_DIR=%FRONTEND_DIR%\dist

:: 2. Server Configuration
set REMOTE_USER=fanyuo
set REMOTE_HOST=59.110.39.142
set REMOTE_DIR=/var/www/epic314
set SSH_PORT=22

:: 3. SSH Key Path (Located in scripts/.ssh/id_rsa)
set SSH_KEY=%SCRIPT_DIR%.ssh\id_rsa

:: 4. Tools Path
set SCP_PATH=C:\Files\Git\usr\bin\scp.exe
:: ================================================

echo ========================================
echo Starting Deployment...
echo Script Location: %SCRIPT_DIR%
echo Frontend Location: %FRONTEND_DIR%
echo SSH Key Location: %SSH_KEY%
echo ========================================

:: 1. Build Vue project
echo [Step 1] Building Vue project...

:: Switch to frontend directory
pushd "%FRONTEND_DIR%"
if %ERRORLEVEL% neq 0 (
    echo Error: Could not find frontend directory at:
    echo %FRONTEND_DIR%
    echo Please check the FRONTEND_DIR_NAME variable in the script.
    pause
    exit /b 1
)

call npm run build
if %ERRORLEVEL% neq 0 (
    echo Build failed!
    popd
    pause
    exit /b 1
)
:: Return to script directory
popd

:: 2. Upload dist folder to remote server
echo [Step 2] Uploading 'dist' folder to remote server...

if not exist "%SSH_KEY%" (
    echo Error: SSH Key not found at:
    echo %SSH_KEY%
    pause
    exit /b 1
)

:: Convert backslashes to slashes for compatibility
set LOCAL_DIST_DIR_UNIX=%LOCAL_DIST_DIR:\=/%

"%SCP_PATH%" -i "%SSH_KEY%" -P %SSH_PORT% -r "%LOCAL_DIST_DIR_UNIX%" %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_DIR%

if %ERRORLEVEL% neq 0 (
    echo Upload failed! Please check your SSH connection and permissions.
    pause
    exit /b 1
)

echo ========================================
echo Deployment completed successfully!
echo ========================================
pause