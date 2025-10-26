@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

title TW Connect - Multi Dev Launcher
echo ==========================================
echo     Launching Web and CMS (fixed ports)
echo ==========================================
echo.

REM ====== 專案路徑 ======
set "REPO=C:\Users\ta893\twconnect2"
set "CMS_PATH=%REPO%\apps\cms"
set "WEB_PATH=%REPO%\apps\web"

REM ====== 基本檢查 ======
if not exist "%CMS_PATH%\sanity.config.ts" (
  echo [Error] %CMS_PATH%\sanity.config.ts not found.
  pause
  exit /b 1
)
if not exist "%WEB_PATH%\package.json" (
  echo [Error] %WEB_PATH%\package.json not found.
  pause
  exit /b 1
)

REM ====== 檢查 Node ======
node -v >nul 2>&1
if errorlevel 1 (
  echo [Error] Node.js not found. Please install Node.js 18+ first.
  pause
  exit /b 1
)

REM ====== 檢查 pnpm，決定指令 ======
where pnpm >nul 2>&1
if errorlevel 1 (
  set "NEXT_CMD=npm run dev"
  set "SANITY_CMD=npx sanity@latest dev"
) else (
  set "NEXT_CMD=pnpm dev"
  set "SANITY_CMD=pnpm dlx sanity@latest dev"
)

REM ====== 固定 Sanity 埠 3333，若占用則詢問 ======
set "PORT_SANITY=3333"
:CHECK_3333
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /r /c:":%PORT_SANITY% " ^| findstr LISTENING') do (
  set "OCCUPY_PID=%%P"
)
if defined OCCUPY_PID (
  echo [Error] Port %PORT_SANITY% is already in use.
  echo      PID using %PORT_SANITY%: %OCCUPY_PID%
  echo.
  echo [R] Retry after you free the port
  echo [E] Exit
  choice /c RE /m "Your choice:"
  if errorlevel 2 (
    echo Exiting...
    exit /b 1
  )
  set "OCCUPY_PID="
  echo Retrying port check...
  timeout /t 2 /nobreak >nul
  goto :CHECK_3333
)

REM ====== 釋放 Next.js 3000 埠（保持你原本策略）======
set "PORT_NEXT=3000"
for /f "tokens=5" %%P in ('netstat -ano ^| findstr :%PORT_NEXT% ^| findstr LISTENING') do (
  echo Freeing port %PORT_NEXT% by killing PID %%P ...
  taskkill /F /PID %%P >nul 2>&1
)

REM ====== 啟動 Sanity（獨立視窗） ======
echo [1/3] Starting Sanity CMS on http://localhost:%PORT_SANITY%/studio ...
start "Sanity Dev Server" cmd /k "cd /d %CMS_PATH% && %SANITY_CMD% --host 127.0.0.1 --port %PORT_SANITY%"

REM ====== 啟動 Next.js（獨立視窗） ======
echo [2/3] Starting Next.js Web on http://localhost:%PORT_NEXT% ...
start "TWConnect Next Dev" cmd /k "cd /d %WEB_PATH% && set NEXT_TELEMETRY_DISABLED=1 && %NEXT_CMD%"

REM ====== 等待並開啟瀏覽器 ======
echo [3/3] Opening browser windows...
timeout /t 8 /nobreak >nul
start "" "http://localhost:%PORT_SANITY%/studio/desk"
start "" "http://localhost:%PORT_NEXT%"

echo.
echo All services were launched. Close this window any time.
pause >nul
