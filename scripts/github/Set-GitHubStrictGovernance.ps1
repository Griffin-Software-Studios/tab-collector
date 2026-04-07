<#
Purpose: Apply strict GitHub repository governance controls for the Tab Collector repository.
Usage:   pwsh -File scripts/github/Set-GitHubStrictGovernance.ps1 -Repo "OWNER/REPO"
         pwsh -File scripts/github/Set-GitHubStrictGovernance.ps1 -Repo "OWNER/REPO" -BypassUsers @("username")

Single-contributor provision: pass -BypassUsers with the repo owner login so
the owner can merge their own pull requests when CI passes and all review
threads are resolved. This satisfies the single-contributor gate requirement
without removing review or status-check enforcement for any other actor.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Repo,

    [string[]]$RequiredStatusChecks = @("Node tests", "Markdown lint"),

    # Logins allowed to bypass pull-request review requirements.
    # Use for single-contributor repos where the owner must merge their own PRs.
    [string[]]$BypassUsers = @()
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

Write-Host "Applying repository merge settings baseline for $Repo..."
Invoke-Gh -Arguments @(
    "api",
    "-X", "PATCH",
    "repos/$Repo",
    "-f", "allow_merge_commit=true",
    "-f", "allow_squash_merge=true",
    "-f", "allow_rebase_merge=false",
    "-f", "delete_branch_on_merge=true",
    "-f", "has_issues=true",
    "-f", "has_wiki=false",
    "-f", "auto_init=false"
) | Out-Null

$protectionPayload = @{
    required_status_checks           = @{
        strict   = $true
        contexts = $RequiredStatusChecks
    }
    enforce_admins                   = $true
    required_pull_request_reviews    = @{
        dismiss_stale_reviews           = $true
        require_code_owner_reviews      = $true
        required_approving_review_count = 1
        bypass_pull_request_allowances  = @{
            users = $BypassUsers
            teams = @()
            apps  = @()
        }
    }
    restrictions                     = $null
    required_linear_history          = $false
    allow_force_pushes               = $false
    allow_deletions                  = $false
    block_creations                  = $false
    required_conversation_resolution = $true
    lock_branch                      = $false
    allow_fork_syncing               = $false
}

$tempFile = [System.IO.Path]::GetTempFileName()
try {
    $protectionPayload | ConvertTo-Json -Depth 10 | Set-Content -Path $tempFile -Encoding utf8

    Write-Host "Applying strict branch protection on main for $Repo..."
    Invoke-Gh -Arguments @(
        "api",
        "-X", "PUT",
        "repos/$Repo/branches/main/protection",
        "--input", $tempFile
    ) | Out-Null
}
finally {
    Remove-Item $tempFile -ErrorAction SilentlyContinue
}

Write-Host "Strict governance baseline applied for $Repo."
Write-Host "Verifying effective protection..."
Invoke-Gh -Arguments @("api", "repos/$Repo/branches/main/protection")
