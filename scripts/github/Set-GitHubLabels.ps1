<#
Purpose: Apply the canonical GSS issue-label baseline to a GitHub repository.
Usage:   pwsh -File scripts/github/Set-GitHubLabels.ps1 -Repo "OWNER/REPO"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Repo
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw "GitHub CLI (gh) is required."
}

function Invoke-Gh {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    $output = & gh @Arguments 2>&1
    if ($LASTEXITCODE -ne 0) {
        $rendered = ($output | Out-String).Trim()
        throw "gh $($Arguments -join ' ') failed.`n$rendered"
    }

    return $output
}

Write-Host "Validating repository access for $Repo..."
Invoke-Gh -Arguments @("repo", "view", $Repo, "--json", "nameWithOwner") | Out-Null

$labels = @(
    @{ name = "bug"; color = "d73a4a"; description = "Something isn't working" },
    @{ name = "documentation"; color = "0075ca"; description = "Improvements or additions to documentation" },
    @{ name = "duplicate"; color = "cfd3d7"; description = "This issue or pull request already exists" },
    @{ name = "enhancement"; color = "a2eeef"; description = "New feature or request" },
    @{ name = "chore"; color = "6f42c1"; description = "Maintenance and housekeeping changes" },
    @{ name = "refactor"; color = "5319e7"; description = "Code or structure changes without behavior change" },
    @{ name = "maintenance"; color = "fbca04"; description = "Operational upkeep, dependencies, and tooling" },
    @{ name = "good first issue"; color = "7057ff"; description = "Good for newcomers" },
    @{ name = "help wanted"; color = "008672"; description = "Extra attention is needed" },
    @{ name = "invalid"; color = "e4e669"; description = "This doesn't seem right" },
    @{ name = "question"; color = "d876e3"; description = "Further information is requested" },
    @{ name = "wontfix"; color = "ffffff"; description = "This will not be worked on" }
)

foreach ($label in $labels) {
    try {
        Invoke-Gh -Arguments @(
            "label",
            "create",
            $label.name,
            "--color", $label.color,
            "--description", $label.description,
            "--repo", $Repo
        ) | Out-Null
        Write-Host "Created label: $($label.name)"
    }
    catch {
        $message = $_.Exception.Message
        if (
            $message -match "already exists" -or
            $message -match "name already exists" -or
            $message -match "HTTP 422"
        ) {
            Invoke-Gh -Arguments @(
                "label",
                "edit",
                $label.name,
                "--color", $label.color,
                "--description", $label.description,
                "--repo", $Repo
            ) | Out-Null
            Write-Host "Updated label: $($label.name)"
        }
        else {
            throw
        }
    }
}

Write-Host "Label baseline applied for $Repo"
