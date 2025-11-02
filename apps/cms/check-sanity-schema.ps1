# check-sanity-schema_v2.ps1
# 只抓 defineType({ name: 'X' ... }) 的「最外層 name」，不抓欄位 name

Write-Host "🔍 Scanning Sanity schema types (top-level 'name')..." -ForegroundColor Cyan
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

# 掃描兩個常見目錄
$schemaFiles = Get-ChildItem -Recurse -Path ".\schemaTypes", ".\schemas" -Include *.ts -ErrorAction SilentlyContinue

# 更嚴謹的 regex：defineType( { <空白> name : '...' ）
$rx = [regex]"defineType\s*\(\s*\{\s*name\s*:\s*['""](?<type>[^'""]+)['""]"

$map = @{}      # typeName -> [files]
foreach ($f in $schemaFiles) {
  $txt = Get-Content $f.FullName -Raw
  $m = $rx.Matches($txt)
  foreach ($mm in $m) {
    $t = $mm.Groups['type'].Value
    if (-not $map.ContainsKey($t)) { $map[$t] = @() }
    $map[$t] += $f.FullName
  }
}

# 輸出
$dups = @()
$singles = @()

foreach ($k in ($map.Keys | Sort-Object)) {
  $files = $map[$k] | Sort-Object -Unique
  if ($files.Count -gt 1) {
    $dups += [PSCustomObject]@{ TypeName = $k; Files = ($files -join "; ") }
  } else {
    $singles += [PSCustomObject]@{ TypeName = $k; File = $files[0] }
  }
}

Write-Host "`n🧩 Unique type names:" -ForegroundColor Yellow
$singles | Sort-Object TypeName | ForEach-Object {
  Write-Host ("   {0} -> {1}" -f $_.TypeName, $_.File)
}

if ($dups.Count -gt 0) {
  Write-Host "`n🚨 Duplicated type names (REAL problems):" -ForegroundColor Red
  $dups | ForEach-Object {
    Write-Host ("⚠️  {0} -> {1}" -f $_.TypeName, $_.Files) -ForegroundColor Red
  }
} else {
  Write-Host "`n✅ No duplicated type names detected." -ForegroundColor Green
}

# 檢查 sanity.config.ts 是否多重來源
$sanityConfig = Join-Path $root "sanity.config.ts"
if (Test-Path $sanityConfig) {
  Write-Host "`n🧠 Checking sanity.config.ts sources..." -ForegroundColor Yellow
  $cc = Get-Content $sanityConfig -Raw
  $imports = [regex]::Matches($cc, "import\s+\{?\s*schemaTypes")
  if ($imports.Count -gt 1) {
    Write-Host "⚠️  Multiple schemaTypes imports detected in sanity.config.ts" -ForegroundColor Red
  } elseif ($cc -match "from\s+['""]\./schemas") {
    Write-Host "⚠️  sanity.config.ts references ./schemas (might double-register)" -ForegroundColor Red
  } else {
    Write-Host "✅ sanity.config.ts only uses ./schemaTypes — OK." -ForegroundColor Green
  }
}

Write-Host "`n🎯 Done."
