Add-Type -AssemblyName System.Drawing
$results = @()
$manifest = Get-Content -Raw 'assets/manifest.json' | ConvertFrom-Json
foreach ($asset in $manifest.portraits.Rowan.PSObject.Properties) {
    $file = Get-Item -LiteralPath $asset.Value
    $bitmap = [System.Drawing.Bitmap]::new($file.FullName)
    $clear = 0; $visible = 0; $minX = $bitmap.Width; $maxX = 0; $minY = $bitmap.Height; $maxY = 0
    # Sample alpha, not RGB: black-looking transparent pixels must remain transparent.
    for ($y = 0; $y -lt $bitmap.Height; $y += 4) {
        for ($x = 0; $x -lt $bitmap.Width; $x += 4) {
            $alpha = $bitmap.GetPixel($x, $y).A
            if ($alpha -eq 0) { $clear++ }
            if ($alpha -gt 128) {
                $visible++
                $minX = [Math]::Min($minX, $x); $maxX = [Math]::Max($maxX, $x)
                $minY = [Math]::Min($minY, $y); $maxY = [Math]::Max($maxY, $y)
            }
        }
    }
    if ($bitmap.Width -ne $manifest.spriteCanvas.width -or $bitmap.Height -ne $manifest.spriteCanvas.height -or $clear -lt 5000 -or $visible -lt 5000) { throw "Invalid sprite canvas or alpha: $($file.Name)" }
    $results += [pscustomobject]@{file=$file.Name;width=$bitmap.Width;height=$bitmap.Height;transparentSamples=$clear;visibleSamples=$visible;bounds=@($minX,$minY,$maxX,$maxY)}
    $bitmap.Dispose()
}
$results | ConvertTo-Json -Depth 3 | Set-Content -LiteralPath 'docs/ART-AUDIT.json'
$results | Format-Table file,width,height,transparentSamples,visibleSamples,@{Label='Bounds';Expression={$_.bounds -join ','}}
