param(
  [string]$OutputDirectory = "dist",
  [string]$PackageName
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifestPath = Join-Path $scriptRoot "manifest.json"

if (-not (Test-Path $manifestPath)) {
  throw "manifest.json was not found in $scriptRoot"
}

$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
$safeName = if ($PackageName) {
  $PackageName
} else {
  "$($manifest.name)-$($manifest.version)"
}

$safeName = ($safeName -replace '[<>:"/\\|?*]', "-").Trim()
$outputRoot = if ([System.IO.Path]::IsPathRooted($OutputDirectory)) {
  $OutputDirectory
} else {
  Join-Path $scriptRoot $OutputDirectory
}

$zipPath = Join-Path $outputRoot "$safeName.zip"
$stagingPath = Join-Path ([System.IO.Path]::GetTempPath()) ("tabs-package-" + [System.Guid]::NewGuid().ToString("N"))

$excludeNames = @(
  ".git",
  ".gitattributes",
  ".gitignore",
  ".github",
  ".editorconfig",
  ".vscode",
  "AGENTS.md",
  "docs",
  "dist",
  "package.json",
  "package.ps1",
  "README.md",
  "security",
  "tab_collector_exact_match_bundle.zip",
  "tests"
)

New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null
New-Item -ItemType Directory -Path $stagingPath -Force | Out-Null

try {
  $items = Get-ChildItem -LiteralPath $scriptRoot -Force | Where-Object {
    $excludeNames -notcontains $_.Name
  }

  foreach ($item in $items) {
    Copy-Item -LiteralPath $item.FullName -Destination $stagingPath -Recurse -Force
  }

  if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
  }

  Compress-Archive -Path (Join-Path $stagingPath "*") -DestinationPath $zipPath -CompressionLevel Optimal
  Write-Output "Created package: $zipPath"
} finally {
  if (Test-Path $stagingPath) {
    Remove-Item -LiteralPath $stagingPath -Recurse -Force
  }
}
