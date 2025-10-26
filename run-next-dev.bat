@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem === 設定你的專案路徑與 Web 子專案路徑 ===
set "REPO=C:\Users\ta893\twconnect2"
set "WEB=%REPO%\apps\web"
set "LOG=%USERPROFILE%\tw-next-dev.log"

echo.>> "%LOG%"
echo [%date% %time%] ===== Boot start: Next.js dev =====>> "%LOG%"

rem --- 檢查 pnpm，沒有就裝 ---
where pnpm >nul 2>&1
if errorlevel 1 (
  echo [%date% %time%] pnpm not found, installing...>> "%LOG%"
  call npm i -g pnpm >> "%LOG%" 2>&1
)

rem --- 基本存在性檢查 ---
if not exist "%WEB%\package.json" (
  echo [%date% %time%] ERROR: %WEB%\package.json not found.>> "%LOG%"
  echo 找不到 %WEB%\package.json，請確認路徑是否正確。
  exit /b 1
)

rem --- 先到 monorepo 根目錄 ---
pushd "%REPO%"

rem --- 若還沒安裝依賴，幫你裝一次 ---
if not exist "%REPO%\node_modules" (
  echo [%date% %time%] Running pnpm install at repo root...>> "%LOG%"
  call pnpm install >> "%LOG%" 2>&1
)

rem --- 釋放 3000 埠（避免上一輪殘留）---
for /f "tokens=5" %%P in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
  echo [%date% %time%] Killing PID %%P on port 3000...>> "%LOG%"
  taskkill /F /PID %%P >> "%LOG%" 2>&1
)

rem --- 進入 web 子專案並啟動開發伺服器 ---
pushd "%WEB%"
set "NEXT_TELEMETRY_DISABLED=1"

rem 以新最小化視窗啟動，視窗會留下方便看 log 與錯誤
start "TWConnect Next Dev" /MIN cmd /k pnpm dev

popd
popd

echo [%date% %time%] Dev started.>> "%LOG%"
exit /b 0
