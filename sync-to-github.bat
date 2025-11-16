@echo off
chcp 65001 >nul
title TWConnect2 - GitHub Auto Sync
setlocal EnableDelayedExpansion

REM ======================================================
REM  TWConnect2 - GitHub Auto Sync (Enhanced v3)
REM  Author: Ben Huang
REM  Description: Auto add / commit / push + open Vercel + GitHub
REM ======================================================

echo.
echo ======================================================
echo     TWConnect2 Git Sync Tool  (Enhanced v3)
echo ======================================================
echo.

REM ------------------------------------------------------
REM Go to project folder
REM ------------------------------------------------------
echo [STEP 1] Checking project folder...
cd /d "C:\Users\ta893\twconnect2"
if errorlevel 1 goto NoProject
echo   ✔ Project folder OK
echo.

REM ------------------------------------------------------
REM Check .git exists
REM ------------------------------------------------------
echo [STEP 2] Checking Git repository...
if not exist ".git" goto NoGit
echo   ✔ .git exists
echo.

REM ------------------------------------------------------
REM Detect current branch
REM ------------------------------------------------------
echo [STEP 3] Detecting current branch...
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set "BRANCH=%%b"

if "%BRANCH%"=="" goto NoBranch
echo   ✔ Current branch detected: !BRANCH!
echo.

REM ------------------------------------------------------
REM Warn for main branch
REM ------------------------------------------------------
if /I "%BRANCH%"=="main" goto WarnMain

REM ------------------------------------------------------
REM Ask commit message
REM ------------------------------------------------------
:AskMessage
echo [STEP 4] Preparing commit
set /p msg=Enter commit message (Enter for default): 
if "%msg%"=="" set "msg=update from local !BRANCH!"
echo   ✔ Commit message ready: "%msg%"
echo.

REM ------------------------------------------------------
REM Commit changes
REM ------------------------------------------------------
echo [STEP 5] Running git add / commit...
git add .
git commit -m "%msg%"

if errorlevel 1 (
    echo   ! No changes detected. Continuing to push...
) else (
    echo   ✔ Commit created
)
echo.

REM ------------------------------------------------------
REM Push branch
REM ------------------------------------------------------
echo [STEP 6] Pushing branch "!BRANCH!" to GitHub...
git push origin !BRANCH!
if errorlevel 1 goto PushError
echo   ✔ Push successful
echo.

REM ------------------------------------------------------
REM Done
REM ------------------------------------------------------
echo ======================================================
echo   ✔ SYNC COMPLETE — Branch pushed: !BRANCH!
echo   Opening Vercel + GitHub...
echo ======================================================
echo.

start https://vercel.com/twconnects-ea2981af/~/deployments
start https://github.com/twconnects/twconnect2
pause
goto End


REM ======================================================
REM                    ERROR HANDLERS
REM ======================================================

:NoProject
echo.
echo ❌ ERROR: Project folder not found.
echo Path: C:\Users\ta893\twconnect2
echo.
pause
goto End

:NoGit
echo.
echo ❌ ERROR: .git folder not found.
echo This folder is not a Git repository.
echo.
pause
goto End

:NoBranch
echo.
echo ❌ ERROR: Failed to detect current Git branch.
echo Check Git installation or PATH setting.
echo.
pause
goto End

:WarnMain
echo.
echo ⚠ WARNING: You are on MAIN (production) branch.
echo This branch deploys to the LIVE WEBSITE.
echo.
set /p CONFIRM=Type YES to push to main, anything else to cancel: 
if /I not "%CONFIRM%"=="YES" goto CancelMain
goto AskMessage

:CancelMain
echo.
echo Cancelled. Switch to dev branch and re-run this tool.
echo Suggested command: git switch dev
echo.
pause
goto End

:PushError
echo.
echo ❌ ERROR: Push failed. Check your network or Git login.
echo.
pause
goto End

:End
exit /b
