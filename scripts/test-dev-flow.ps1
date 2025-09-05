# Test script to validate dev proxy, CORS and auth flow through Vite proxy
# Run this while `pnpm dev` is running in the repo root.

$base = 'http://localhost:5173'

Write-Host "Checking /api/health via Vite proxy..."
try {
    $health = Invoke-RestMethod -Uri "$base/api/health" -Method Get -ErrorAction Stop
    Write-Host "Health OK:" ($health | ConvertTo-Json -Depth 3)
} catch {
    Write-Error "Health check failed: $_"
    exit 1
}

# Perform role-based login and persist cookies in $session
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
Write-Host "Posting login (role=Provider) to /api/auth/login..."
try {
    $login = Invoke-RestMethod -Uri "$base/api/auth/login" -Method Post `
        -Body (ConvertTo-Json @{ role = 'Provider' }) `
        -ContentType 'application/json' -WebSession $session -ErrorAction Stop
    Write-Host "Login response:" ($login | ConvertTo-Json -Depth 3)
} catch {
    Write-Error "Login failed: $_"
    exit 1
}

# Call an authenticated endpoint with the session cookies
Write-Host "Calling authenticated endpoint /api/data/provider/analytics..."
try {
    $resp = Invoke-RestMethod -Uri "$base/api/data/provider/analytics" -Method Get -WebSession $session -ErrorAction Stop
    Write-Host "Authenticated call response:" ($resp | ConvertTo-Json -Depth 5)
} catch {
    Write-Error "Authenticated call failed: $_"
    exit 1
}

Write-Host "Dev flow test completed successfully."
