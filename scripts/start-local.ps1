$ErrorActionPreference = "Stop"

$node = "C:\Program Files\nodejs\node.exe"
$next = Join-Path $env:USERPROFILE "Documents\Aivel LTI\node_modules\next\dist\bin\next"
$work = Split-Path -Parent $PSScriptRoot
$stdout = Join-Path $work "local-server.out.log"
$stderr = Join-Path $work "local-server.err.log"
$arguments = @(
  ('"' + $next + '"'),
  "dev",
  "--webpack",
  "--hostname",
  "127.0.0.1",
  "-p",
  "4370"
)

$previousLocation = Get-Location
Set-Location -LiteralPath $work
$process = Start-Process `
  -FilePath $node `
  -ArgumentList $arguments `
  -WindowStyle Hidden `
  -RedirectStandardOutput $stdout `
  -RedirectStandardError $stderr `
  -PassThru
Set-Location -LiteralPath $previousLocation

[pscustomobject]@{
  ProcessId = $process.Id
  Url = "http://127.0.0.1:4370/"
  OutputLog = $stdout
  ErrorLog = $stderr
}
