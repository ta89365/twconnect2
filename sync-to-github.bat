@echo off
chcp 65001 >nul
title TWConnect2 - GitHub Auto Sync v3
setlocal EnableDelayedExpansion

REM ======================================================
REM  TWConnect2 - GitHub Auto Sync (v3)
REM  Author: Ben Huang
REM  Description: Auto add / commit / push with rich status output
REM ======================================================

echo.
echo ======================================================
echo     TWConnect2 Git Sync Tool  (v3)
echo ======================================================
echo.

REM ------------------------------------------------------
REM Step 1: Go to project folder
REM ------------------------------------------------------
echo [STEP 1] Checking project folder...
cd /d "C:\Users\ta893\twconnect2"
if errorlevel 1 goto NoProject
echo   [OK] Project folder found.
echo.

REM ------------------------------------------------------
REM Step 2: Check .git exists
REM ------------------------------------------------------
echo [STEP 2] Checking Git repository...
if not exist ".git" goto NoGit
echo   [OK] .git folder exists.
echo.

REM ------------------------------------------------------
REM Step 3: Detect current branch
REM ------------------------------------------------------
echo [STEP 3] Detecting current branch...
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set "BRANCH=%%b"

if "%BRANCH%"=="" goto NoBranch
echo   [OK] Current branch: !BRANCH!
echo.

REM ------------------------------------------------------
REM Step 4: Fetch remote info and show status
REM ------------------------------------------------------
echo [STEP 4] Fetching remote info (git fetch --all --prune) ...
git fetch --all --prune
echo   [OK] Remote info fetched.
echo.

echo [STEP 5] Current git status (short):
git status -sb
echo.

REM Count local changes (modified / staged / untracked)
for /f %%c in ('git status --porcelain ^| find /c /v ""') do set "CHANGES=%%c"
if "%CHANGES%"=="0" goto NoLocalChanges

REM If there are changes, go commit as usual
goto AskMessage

REM ------------------------------------------------------
REM Step 5a: No local changes - confirm if still push
REM ------------------------------------------------------
:NoLocalChanges
echo [INFO] Working tree is clean (no local file changes).
set /p CONTINUE=No local changes. Still push this branch to GitHub? (Y/N): 
if /I "%CONTINUE%"=="Y" goto AskMessage
if /I "%CONTINUE%"=="YES" goto AskMessage

echo.
echo Operation cancelled. Nothing was pushed.
echo.
pause
goto End

REM ------------------------------------------------------
REM Step 6: Warn for main branch
REM ------------------------------------------------------
:WarnMain
echo.
echo [WARNING] You are on the MAIN (production) branch.
echo This branch is usually for production deploy only.
echo.
set /p CONFIRM=Type YES to push to main, anything else to cancel: 
if /I not "%CONFIRM%"=="YES" goto CancelMain
goto AskMessage

REM ------------------------------------------------------
REM Step 7: Ask commit message
REM ------------------------------------------------------
:AskMessage
REM If on main, ensure warning is shown first
if /I "%BRANCH%"=="main" goto WarnMainReturn

:AskMessageCore
echo [STEP 6] Preparing commit...
set /p msg=Enter commit message (Enter for default): 
if "%msg%"=="" set "msg=update from local !BRANCH!"
echo   [OK] Commit message: "%msg%"
echo.

REM ------------------------------------------------------
REM Step 8: Commit changes
REM ------------------------------------------------------
echo [STEP 7] Running git add / commit...
git add .
git commit -m "%msg%"

if errorlevel 1 (
    echo   [INFO] No changes were committed (possibly already committed).
    echo   Will still try to push current branch.
) else (
    echo   [OK] Commit created.
)
echo.

REM ------------------------------------------------------
REM Step 9: Push branch
REM ------------------------------------------------------
echo [STEP 8] Pushing branch "!BRANCH!" to GitHub...
git push origin !BRANCH!
if errorlevel 1 goto PushError
echo   [OK] Push successful.
echo.

REM ------------------------------------------------------
REM Step 10: Done
REM ------------------------------------------------------
for /f "delims=" %%h in ('git rev-parse --short HEAD') do set "LASTCOMMIT=%%h"

echo ======================================================
echo   [DONE] Sync complete.
echo   Branch pushed : !BRANCH!
echo   Last commit   : !LASTCOMMIT!
echo   Opening Vercel deployments page...
echo ======================================================
echo.

start https://vercel.com/twconnects-ea2981af/~/deployments
pause
goto End

REM ======================================================
REM                    ERROR HANDLERS
REM ======================================================

:NoProject
echo.
echo [ERROR] Project folder not found.
echo        C:\Users\ta893\twconnect2
echo Check the path in this .bat file.
echo.
pause
goto End

:NoGit
echo.
echo [ERROR] .git folder not found.
echo This folder is not a Git repository.
echo.
pause
goto End

:NoBranch
echo.
echo [ERROR] Failed to detect current Git branch.
echo Check Git installation or PATH setting.
echo.
pause
goto End

:CancelMain
echo.
echo Operation cancelled. Switch to dev branch and re-run this tool.
echo Suggested command: git switch dev
echo.
pause
goto End

:PushError
echo.
echo [ERROR] Push failed. Check your network or Git authentication.
echo.
pause
goto End

:End
exit /b
