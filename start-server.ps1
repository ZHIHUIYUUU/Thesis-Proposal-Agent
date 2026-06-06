param(
  [int]$Port = 5173
)

Set-Location $PSScriptRoot
Write-Host "Graduate Proposal Workbench"
Write-Host "URL: http://127.0.0.1:$Port"
Write-Host "Press Ctrl+C to stop."
npm run dev -- --port $Port --host 127.0.0.1
