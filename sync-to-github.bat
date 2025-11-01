@echo off
chcp 65001 >nul
title TWConnect2 - GitHub Auto Sync
setlocal EnableDelayedExpansion

REM ======================================================
REM  TWConnect2 - GitHub 一鍵同步推送
REM  作者：Ben Huang
REM  說明：自動 add / commit / push 並開啟 GitHub 頁面
REM ======================================================

cd /d "C:\Users\ta893\twconnect2" || (
    echo [錯誤] 找不到專案資料夾 C:\Users\ta893\twconnect2
    pause
    exit /b
)

REM 檢查 .git 是否存在
if not exist ".git" (
    echo [錯誤] 未找到 .git，請先在此資料夾初始化 Git。
    pause
    exit /b
)

echo.
echo ===========================
echo   TWConnect2 Git 同步工具
echo ===========================
echo.

REM 顯示目前分支
for /f "tokens=2 delims=* " %%b in ('git branch ^| findstr /R /C:"\*"') do set BRANCH=%%b
echo 目前分支：!BRANCH!
echo.

REM 讓使用者輸入 commit 訊息
set /p msg=請輸入 commit 訊息（直接 Enter 使用預設訊息）：

if "%msg%"=="" set msg=update from local dev

echo.
echo ===========================
echo 正在提交變更...
echo ===========================

git add .
git commit -m "%msg%"

if errorlevel 1 (
    echo.
    echo [提示] 沒有可提交的變更。
    echo.
)

echo.
echo ===========================
echo 正在推送到 GitHub...
echo ===========================

git push

if errorlevel 1 (
    echo.
    echo [錯誤] 推送失敗，請確認網路或登入狀態。
    pause
    exit /b
)

echo.
echo ✅ 同步成功！已推送至 GitHub。
echo ===========================
start https://vercel.com/twconnects-ea2981af/~/deployments
echo.
pause
exit /b
