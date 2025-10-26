@echo off
REM ======================================================
REM  TWConnect2 - GitHub 一鍵同步推送
REM  作者：Ben Huang
REM  說明：此批次檔會自動 add / commit / push
REM ======================================================

cd /d "C:\Users\ta893\twconnect2"

REM 檢查是否為 Git 專案
if not exist ".git" (
    echo [錯誤] 找不到 .git 目錄，請確認你在專案根目錄。
    pause
    exit /b
)

REM 顯示目前分支
echo.
git branch
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
    echo [提示] 可能沒有變更可提交。
    echo.
)

echo.
echo ===========================
echo 正在推送到 GitHub...
echo ===========================

git push

if errorlevel 1 (
    echo.
    echo [錯誤] 推送失敗！請確認網路或登入狀態。
    pause
    exit /b
)

echo.
echo ✅ 同步成功！
echo ===========================
pause

start https://github.com/ta89365/twconnect2

