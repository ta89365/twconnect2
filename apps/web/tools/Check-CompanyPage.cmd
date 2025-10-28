@echo off
setlocal ENABLEDELAYEDEXPANSION
set "FILE=apps\web\src\app\company\page.tsx"

if not exist "%FILE%" (
  echo [ERROR] File not found: %FILE%
  exit /b 1
)

set /a count=0

echo.
echo ===== Checking %FILE% =====
echo.

REM === 1) 找錯的 ClassName 或 class ===
for /f "usebackq tokens=1,* delims=:" %%A in (`findstr /nri "ClassName *= class *=" "%FILE%"`) do (
  set /a count+=1
  echo [%%A] Use "className", not "ClassName" or "class"
  echo      %%B
)

REM === 2) 直接使用 company.companyInfo.xxx ===
for /f "usebackq tokens=1,* delims=:" %%A in (`findstr /nri "company.companyInfo." "%FILE%"`) do (
  echo %%B | findstr /i "?.companyInfo" >nul
  if errorlevel 1 (
    set /a count+=1
    echo [%%A] Prefer "ci?.xxx" instead of "company.companyInfo.xxx"
    echo      %%B
  )
)

REM === 3) bg-white/7 等不合法 Tailwind ===
for /f "usebackq tokens=1,* delims=:" %%A in (`findstr /nri "bg-white/7 bg-slate/7 bg-black/7" "%FILE%"`) do (
  set /a count+=1
  echo [%%A] Invalid Tailwind opacity ("/7"). Use /10, /20, etc.
  echo      %%B
)

REM === 4) 自閉合 iframe 標籤 ===
for /f "usebackq tokens=1,* delims=:" %%A in (`findstr /nri "<iframe" "%FILE%"`) do (
  echo %%B | findstr "/>" >nul
  if not errorlevel 1 (
    set /a count+=1
    echo [%%A] Consider closing <iframe> with </iframe> instead of self-closing
    echo      %%B
  )
)

REM === 5) mapEmbedUrl(company?.companyInfo?) ===
for /f "usebackq tokens=1,* delims=:" %%A in (`findstr /nri "mapEmbedUrl(company" "%FILE%"`) do (
  set /a count+=1
  echo [%%A] Use "mapEmbedUrl(ci?.xxx || fallback)" for consistency
  echo      %%B
)

echo.
if %count%==0 (
  echo ✅ No obvious issues detected in %FILE%
) else (
  echo ⚠ Found %count% potential issues.
)
echo.
echo Tip: You can also run:
echo   npx -y typescript@latest tsc -p apps\web\tsconfig.json --noEmit
echo to check for precise TS type errors.
echo.
endlocal
