@echo off
chcp 65001 >nul
title TWConnect2 - GitHub Auto Sync
setlocal EnableDelayedExpansion

REM ======================================================
REM  TWConnect2 - GitHub Auto Sync
REM  Author: Ben Huang
REM  Description: Auto add / commit / push and open Vercel deployments
REM ======================================================

REM Go to project folder
cd /d "C:\Users\ta893\twconnect2"
if errorlevel 1 goto NoProject

REM Check .git exists
if not exist ".git" goto NoGit

echo.
echo ===========================
echo   TWConnect2 Git Sync Tool
echo ===========================
echo.

REM Get current branch (stable way)
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set "BRANCH=%%b"

if "%BRANCH%"=="" goto NoBranch

echo Current branch: !BRANCH!
echo.

REM ---- Safety: warn if on main branch ----
if /I "%BRANCH%"=="main" goto WarnMain

REM ---- Ask commit message and continue ----
:AskMessage
set /p msg=Commit message (press Enter to use default): 
if "%msg%"=="" set "msg=update from local !BRANCH!"

echo.
echo ===========================
echo Committing changes...
echo ===========================

git add .
git commit -m "%msg%"

if errorlevel 1 (
    echo.
    echo [INFO] No changes to commit. Will still try to push current branch.
    echo.
)

echo.
echo ===========================
echo Pushing to GitHub (branch: !BRANCH!)...
echo ===========================

git push origin !BRANCH!
if errorlevel 1 goto PushError

echo.
echo Sync successful! Pushed to GitHub (branch: !BRANCH!).
echo ===========================
start https://vercel.com/twconnects-ea2981af/~/deployments
echo.
pause
goto End

REM ===========================
REM         Error labels
REM ===========================
:NoProject
echo [ERROR] Project folder not found: C:\Users\ta893\twconnect2
echo Check the path in this .bat file.
echo.
pause
goto End

:NoGit
echo [ERROR] .git folder not found. Is this a git repository?
echo.
pause
goto End

:NoBranch
echo [ERROR] Failed to detect current branch. Check git installation / PATH.
echo.
pause
goto End

:WarnMain
echo WARNING: You are on the main branch (production).
echo This branch is usually for production deploy only.
echo.
set /p CONFIRM=Type YES to push to main, or anything else to cancel: 
if /I not "%CONFIRM%"=="YES" goto CancelMain
goto AskMessage

:CancelMain
echo.
echo Operation cancelled. Please switch to dev branch and run this tool again.
echo Suggested command: git switch dev
echo.
pause
goto End

:PushError
echo.
echo [ERROR] Push failed. Please check network or authentication.
echo.
pause
goto End

:End
exit /b
