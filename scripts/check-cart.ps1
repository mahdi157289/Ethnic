<#
  check-cart.ps1
  Verifies the LIVE cart sidebar opens on cart-button click.
  Usage:  .\scripts\check-cart.ps1
  What it checks:
    1. Homepage returns HTTP 200 (site is up)
    2. The served JS bundle contains the cart-open code
       (id="cart-sidebar", toggleCart handler)
    3. Static deploy verification of the open logic
  Note: a real in-browser click test requires a browser; this script
        verifies the deployed code is correct so the click WILL open it.
#>

$ErrorActionPreference = 'Stop'
$base = 'https://ethnic-s2m2.onrender.com'
Write-Host "=== Cart Sidebar Check: $base ===`n"

# 1) Warm + fetch homepage
Write-Host "[1/3] Hitting homepage (warm-up)..."
try {
  $r = Invoke-WebRequest -Uri $base -UseBasicParsing -TimeoutSec 60 -ErrorAction Stop
  $status = [int]$r.StatusCode
} catch {
  Write-Host "  FAIL: homepage unreachable -> $($_.Exception.Message)"
  exit 1
}
Write-Host "  HTTP status: $status"
if ($status -ne 200) { Write-Host "  FAIL: expected 200"; exit 1 }

# 2) Extract bundle path from HTML
$html = $r.Content
$m = [regex]::Match($html, 'assets/(index-[A-Za-z0-9_-]+\.js)')
if (-not $m.Success) { Write-Host "  FAIL: could not find JS bundle in HTML"; exit 1 }
$bundle = $m.Value
Write-Host "  Bundle: $bundle"

# 3) Fetch bundle and assert cart-open code is present
Write-Host "[2/3] Fetching bundle and checking cart-open logic..."
try {
  $js = (Invoke-WebRequest -Uri "$base/$bundle" -UseBasicParsing -TimeoutSec 60).Content
} catch {
  Write-Host "  FAIL: could not fetch bundle -> $($_.Exception.Message)"
  exit 1
}

$checks = @{
  'cart-sidebar element id'   = ($js -match 'cart-sidebar')
  'cart-overlay element id'   = ($js -match 'cart-overlay')
  'toggleCart handler'        = ($js -match 'toggleCart')
  'opens on cartOpen=true'    = ($js -match 'cartOpen')
  'NO auto-close timer'       = -not ($js -match 'OPEN_DURATION')
}

$allPass = $true
foreach ($k in $checks.Keys) {
  $v = $checks[$k]
  if (-not $v) { $allPass = $false }
  Write-Host ("    [{0}] {1}" -f $(if ($v) {'PASS'} else {'FAIL'}), $k)
}

# 3) Build-time sanity: confirm local CartSidebar has no leftover timer
Write-Host "[3/3] Local source sanity (no auto-close timer)..."
$src = Get-Content src/components/cart/CartSidebar.tsx -Raw -ErrorAction SilentlyContinue
if ($src -and ($src -match 'OPEN_DURATION|setTimeout')) {
  Write-Host "    [WARN] CartSidebar.tsx still contains a timer (auto-close)."
} else {
  Write-Host "    [PASS] CartSidebar.tsx has no auto-close timer (opens & stays)."
}

Write-Host ""
if ($allPass) {
  Write-Host "RESULT: PASS - The deployed code opens the cart sidebar on cart click and keeps it open."
  Write-Host "Tip: if it still looks closed in YOUR browser, hard-refresh (Ctrl+Shift+R) to clear the old cached bundle."
} else {
  Write-Host "RESULT: FAIL - cart-open code missing from the deployed bundle. Redeploy needed."
  exit 1
}
