# tools\ScanAndStub-MissingTypeImports.ps1 (v3)
param(
  [string]$WebRoot = "apps\web",
  [string]$SrcRel = "src",
  [switch]$WhatIf
)

$ErrorActionPreference = 'Stop'

$root     = Resolve-Path "."
$webPath  = Join-Path $root $WebRoot
$srcPath  = Join-Path $webPath $SrcRel
$stubsDir = Join-Path $srcPath "types"
$stubFile = Join-Path $stubsDir "ambient-stubs.d.ts"

if (-not (Test-Path $stubsDir)) { New-Item -ItemType Directory -Path $stubsDir | Out-Null }
if (-not (Test-Path $stubFile)) { New-Item -ItemType File -Path $stubFile -Value "// Auto-generated type stubs`r`n" | Out-Null }

# 收集 .ts / .tsx（排除 .d.ts）
$files = Get-ChildItem $srcPath -Recurse -Include *.ts,*.tsx | Where-Object { -not $_.FullName.EndsWith(".d.ts") }

$missing = @()
$aliasPrefix = "@/"

function Resolve-AliasPath([string]$module) {
  if ($module.StartsWith($aliasPrefix)) {
    $rel = $module.Substring($aliasPrefix.Length)
    return Join-Path $srcPath $rel
  }
  return $null
}

# 用 Here-String 避免引號轉義地獄
$pattern = @'
import\s+type\s*\{([^}]+)\}\s*from\s*["'']([^"'']+)["'']\s*;?
'@

foreach ($f in $files) {
  $content = Get-Content $f.FullName -Raw
  $matches = [regex]::Matches($content, $pattern)

  foreach ($m in $matches) {
    $types = $m.Groups[1].Value.Trim() -split '\s*,\s*'
    $mod = $m.Groups[2].Value.Trim()
    $targetPath = Resolve-AliasPath $mod

    if ($targetPath -ne $null) {
      $existsTs      = Test-Path ($targetPath + ".ts")
      $existsTsx     = Test-Path ($targetPath + ".tsx")
      $existsIndexTs = Test-Path (Join-Path $targetPath "index.ts")
      $existsIndexTsx= Test-Path (Join-Path $targetPath "index.tsx")

      if (-not ($existsTs -or $existsTsx -or $existsIndexTs -or $existsIndexTsx)) {
        $missing += [pscustomobject]@{
          Module = $mod
          Types  = $types
          File   = $f.FullName
        }
      }
    }
  }
}

# 依 Module 聚合
$byModule = $missing | Group-Object Module
$toAppend = @()

foreach ($g in $byModule) {
  $mod   = $g.Name
  $types = ($g.Group.Types | Select-Object -Unique)

  $decl = "declare module `"$mod`" {`r`n"
  foreach ($t in $types) {
    $tn = $t.Trim()
    if ($tn -match '^[A-Za-z_]\w*$') {
      $decl += "  export type $tn = any;`r`n"
    } else {
      $decl += "  export const __stub: any;`r`n"
    }
  }
  $decl += "}`r`n`r`n"
  $toAppend += $decl
}

if ($toAppend.Count -gt 0) {
  if ($WhatIf) {
    Write-Host "== 預覽：將新增到 $stubFile 的宣告 ==" -ForegroundColor Cyan
    $toAppend -join "" | Write-Host
  } else {
    Add-Content -Path $stubFile -Value ($toAppend -join "")
    Write-Host "已更新 stub 檔：$stubFile" -ForegroundColor Green
  }
} else {
  Write-Host "沒有偵測到缺失的 type-only 模組，stub 檔不需更新。" -ForegroundColor Yellow
}

Write-Host "完成。建議執行：pnpm -C $WebRoot typecheck  或  pnpm -C $WebRoot build" -ForegroundColor Cyan
