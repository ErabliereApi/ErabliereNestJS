git pull origin main

$content = Get-Content package.json

$isHead = $false
$isOther = $false

$headDependencies = New-Object System.Collections.ArrayList
$otherDependencies = New-Object System.Collections.ArrayList

foreach ($line in $content) {
    # Write-Host "Processing line" $line

    if ($line -eq '<<<<<<< HEAD') {
        $isHead = $true
    }
    elseif ($line -eq '=======') {
        $isHead = $false
        $isOther = $true
    }
    elseif ($line.StartsWith('>>>>>>>')) {
        $isOther = $false
    }
    elseif ($isHead) {
        Write-Host "adding $line to head"
        $headDependencies.Add($line);
    }
    elseif ($isOther) {
        Write-Host "adding $line to other"
        $otherDependencies.Add($line);
    }
}

Write-Host "Head dependencies " $headDependencies
Write-Host "Other dependencies" $otherDependencies

$newPackageJson = New-Object System.Text.StringBuilder

foreach ($line in $content) {
    # Write-Host "Processing line" $line

    if ($line -eq '<<<<<<< HEAD') {
        $isHead = $true
    }
    elseif ($line -eq '=======') {
        $isHead = $false
        $isOther = $true
    }
    elseif ($line.StartsWith('>>>>>>>')) {
        $isOther = $false
    }
    elseif ($isHead) {
        $packageName = $line.Split(':')[0].Trim().Replace('"', "")

        Write-Host "extracted package" $packageName

        $matchingString = $otherDependencies | Where-Object { $_ -like "*$packageName*" }

        Write-Host "matching string", $matchingString

        $stringSet = $line, $matchingString

        $stringSetOrder = $stringSet | Sort-Object

        Write-Host "string set order" $stringSetOrder

        $newPackageJson.AppendLine($stringSetOrder[1]);
    }
    elseif ($isOther) {
        Write-Host "Nothing to do"
    }
    else {
        $newPackageJson.AppendLine($line)
    }
}

Set-Content "package.json" $newPackageJson.ToString()

.\update-npm-install.ps1