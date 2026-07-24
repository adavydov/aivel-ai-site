$ErrorActionPreference = "Stop"

$node = "C:\Program Files\nodejs\node.exe"
$work = Split-Path -Parent $PSScriptRoot
$standalone = Join-Path $work ".next\standalone"
$server = Join-Path $standalone "server.js"
$standalonePublic = Join-Path $standalone "public"
$standaloneStatic = Join-Path $standalone ".next\static"
$sourcePublic = Join-Path $work "public"
$sourceStatic = Join-Path $work ".next\static"
$stdout = Join-Path $work "local-server.out.log"
$stderr = Join-Path $work "local-server.err.log"

if (-not (Test-Path -LiteralPath $standalonePublic)) {
  New-Item -ItemType Junction -Path $standalonePublic -Target $sourcePublic | Out-Null
}
if (-not (Test-Path -LiteralPath $standaloneStatic)) {
  New-Item -ItemType Junction -Path $standaloneStatic -Target $sourceStatic | Out-Null
}

$previousLocation = Get-Location
Set-Location -LiteralPath $work
$previousHostname = $env:HOSTNAME
$previousPort = $env:PORT
$env:HOSTNAME = "127.0.0.1"
$env:PORT = "4370"
$process = Start-Process `
  -FilePath $node `
  -ArgumentList ('"' + $server + '"') `
  -WindowStyle Hidden `
  -RedirectStandardOutput $stdout `
  -RedirectStandardError $stderr `
  -PassThru
$env:HOSTNAME = $previousHostname
$env:PORT = $previousPort
Set-Location -LiteralPath $previousLocation

[pscustomobject]@{
  ProcessId = $process.Id
  Url = "http://127.0.0.1:4370/"
  OutputLog = $stdout
  ErrorLog = $stderr
}
