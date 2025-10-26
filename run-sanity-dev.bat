@echo off
title TW Connect CMS Studio
chcp 65001 >nul
echo ==========================================
echo     Starting Sanity Studio for TW Connect
echo ==========================================
echo.

REM === 專案目錄 ===
set "PROJ_DIR=C:\Users\ta893\twconnect2\apps\cms"
set "PORT=3333"

REM === 切換到 Sanity 專案目錄 ===
if not exist "%PROJ_DIR%" (
  echo [Error] Project folder not found: %PROJ_DIR%
  pause
  exit /b 1
)
cd /d "%PROJ_DIR%"

REM === 檢查 Node.js 是否可用 ===
node -v >nul 2>&1
if errorlevel 1 (
  echo [Error] Node.js not found. Please install Node.js 18+ first.
  pause
  exit /b
)

REM === 檢查 3333 埠是否被占用 ===
netstat -ano | findstr ":3333 " | findstr LISTENING >nul
if not errorlevel 1 (
  echo [Error] Port 3333 is already in use.
  echo.
  echo Choose an action:
  echo [R] Retry after closing the process using 3333
  echo [E] Exit this script
  choice /c RE /m "Your choice:"
  if errorlevel 2 (
    echo Exiting...
    exit /b
  )
  echo.
  echo Retrying...
  timeout /t 3 /nobreak >nul
  goto :RETRY
)

:RETRY
REM === 啟動 Sanity Studio ===
echo Launching Sanity Studio at http://localhost:%PORT%/studio ...
echo (Press Ctrl + C in the new window to stop the server)
start "Sanity Dev Server" cmd /k "cd /d %PROJ_DIR% && npx sanity dev --host 127.0.0.1 --port %PORT%"

REM === 等候伺服器啟動 ===
timeout /t 8 /nobreak >nul

REM === 自動開啟瀏覽器 ===
start "" "http://localhost:%PORT%/studio/desk"

echo.
echo Sanity Studio is now running on port %PORT%.
echo You can close this window or press any key to exit.
pause >nul
exit /b
