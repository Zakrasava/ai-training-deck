# Скриншоты всех слайдов без Playwright, через установленный Chrome.
# Запуск из папки lesson-2:  powershell -ExecutionPolicy Bypass -File tools\shots.ps1
# 1600×900 — каждый шаг каждого слайда; 1280×720 и 844×390 — последний шаг. Результат: deck\shots\
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$deck = ((Resolve-Path "$PSScriptRoot\..\deck\index.html").Path) -replace '\\', '/'
$out = "$PSScriptRoot\..\deck\shots"
New-Item -ItemType Directory -Force -Path $out | Out-Null
# слайд → число шагов (data-steps); при изменении слайдов поправить здесь
$steps = @{1=1;2=1;3=2;4=1;5=5;6=4;7=2;8=1;9=2;10=7;11=7;12=8;13=2;14=0;15=0;16=2;17=3;18=3;19=2;20=3;21=3;22=1;23=1;24=0}
function Shot($w, $h, $n, $s, $file) {
  & $chrome --headless=new --hide-scrollbars --window-size=$w,$h --virtual-time-budget=4000 --screenshot="$file" "file:///$deck`?static#$n.$s" 2>$null | Out-Null
}
foreach ($n in 1..24) {
  $nn = "{0:D2}" -f $n
  foreach ($s in 0..$steps[$n]) { Shot 1600 900 $n $s "$out\$nn-$s.png" }
  $last = $steps[$n]
  Shot 1280 720 $n $last "$out\$nn-$last-1280.png"
  Shot 844 390 $n $last "$out\$nn-$last-844.png"
}
Write-Host "готово: $out"
