@echo off
setlocal enabledelayedexpansion

REM 避免亂碼
chcp 65001 >nul

set NODE_VER=22.20.0
set PNPM_VER=10.18.3

REM 產出時間戳（簡易）
for /f "tokens=1-3 delims=/: " %%a in ("%date% %time%") do set TS=%%a%%b%%c

set LOGDIR=logs
if not exist "%LOGDIR%" mkdir "%LOGDIR%"

echo ▶ Prepare env
call nvm use %NODE_VER% >nul 2>&1
call corepack enable >nul 2>&1
call corepack prepare pnpm@%PNPM_VER% --activate >nul 2>&1

set LOGS=

if exist apps\web\tsconfig.json (
  echo ▶ web tsc
  pushd apps\web
  call pnpm exec tsc -p tsconfig.json --pretty false --noEmit > "..\..\%LOGDIR%\%TS%-web-tsc.log" 2>&1
  popd
  set LOGS=%LOGS% "%LOGDIR%\%TS%-web-tsc.log"
)

if exist apps\cms\tsconfig.json (
  echo ▶ cms tsc
  pushd apps\cms
  call pnpm exec tsc -p tsconfig.json --pretty false --noEmit > "..\..\%LOGDIR%\%TS%-cms-tsc.log" 2>&1
  popd
  set LOGS=%LOGS% "%LOGDIR%\%TS%-cms-tsc.log"
)

if exist apps\web\package.json (
  echo ▶ web eslint
  pushd apps\web
  call pnpm exec eslint "src/**/*.{ts,tsx,js,jsx}" -f unix > "..\..\%LOGDIR%\%TS%-web-eslint.log" 2>&1
  popd
  set LOGS=%LOGS% "%LOGDIR%\%TS%-web-eslint.log"

  echo ▶ web next build
  pushd apps\web
  call pnpm build > "..\..\%LOGDIR%\%TS%-web-next-build.log" 2>&1
  popd
  set LOGS=%LOGS% "%LOGDIR%\%TS%-web-next-build.log"
)

REM 合併所有 log
set ALL=%LOGDIR%\%TS%-all.log
type %LOGS% > "%ALL%"

REM 摘要與上下文輸出檔（注意：這裡不要在變數裡帶引號）
set SUMMARY=%LOGDIR%\%TS%-errors_summary.txt
set CONTEXT=%LOGDIR%\%TS%-errors_with_context.txt

REM 呼叫 PowerShell，並在 PowerShell 內對路徑加上引號
powershell -NoProfile -Command ^
  "$pats=@('error TS\d+\:','^\S+:\d+:\d+: error','^\s*Error\b','Module build failed','Build failed','TypeError','ReferenceError','NextJSBuildError','TurbopackError','SanityError','ValidationError');" ^
  "$rx=[string]::Join('|',$pats);" ^
  "$sum = '%SUMMARY%'; $ctx = '%CONTEXT%'; $all = '%ALL%';" ^
  "Select-String -Path $all -Pattern $rx -SimpleMatch:$false | %%{ $_.Line.Trim() } | ?{ $_ -ne '' } | Sort-Object -Unique | Set-Content -LiteralPath $sum;" ^
  "Select-String -Path $all -Pattern $rx -Context 2,2 -SimpleMatch:$false | %%{ '-----'; $_.Filename; 'Line ' + $_.LineNumber; $_.Context.PreContext; $_.Line; $_.Context.PostContext } | Set-Content -LiteralPath $ctx;"

echo.
echo ✅ 完成！請把以下兩個檔案貼給我：
echo 1) %SUMMARY%
echo 2) %CONTEXT%

endlocal
