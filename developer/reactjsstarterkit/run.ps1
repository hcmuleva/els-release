# React Starter Kit - PowerShell Script
# Interactive menu for navigating through iterations

function Show-Header {
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "  JavaScript + React Starter Kit (PowerShell)" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Test-NodeInstalled {
    try {
        $nodeVersion = node --version
        $npmVersion = npm --version
        Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
        Write-Host "npm version: $npmVersion" -ForegroundColor Green
        Write-Host ""
        return $true
    }
    catch {
        Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
        Write-Host "📥 Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
        Write-Host ""
        return $false
    }
}

function Show-Menu {
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "  Choose an action:" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  JavaScript Basics:" -ForegroundColor Yellow
    Write-Host "  [0] Test Environment (Run hello-world.js)"
    Write-Host "  [1] JavaScript Basics"
    Write-Host "  [2] Control Structures"
    Write-Host "  [3] Functions and DOM"
    Write-Host "  [4] ES6 Features"
    Write-Host ""
    Write-Host "  React Applications:" -ForegroundColor Yellow
    Write-Host "  [5] Setup React App (Iteration 5)"
    Write-Host "  [6] React Components (Iteration 6)"
    Write-Host "  [7] Props & State (Iteration 7)"
    Write-Host "  [8] Events & Lists (Iteration 8)"
    Write-Host "  [9] Fetch API (Iteration 9)"
    Write-Host "  [10] Mini Project (Iteration 10)"
    Write-Host ""
    Write-Host "  Other:" -ForegroundColor Yellow
    Write-Host "  [help] Show getting started guide"
    Write-Host "  [exit] Exit"
    Write-Host ""
}

function Run-JSFile {
    param($file)
    if (Test-Path $file) {
        Write-Host ""
        Write-Host "▶️  Running: $file" -ForegroundColor Green
        Write-Host "================================================" -ForegroundColor Cyan
        node $file
        Write-Host "================================================" -ForegroundColor Cyan
        Write-Host ""
    }
    else {
        Write-Host "❌ File not found: $file" -ForegroundColor Red
    }
}

# Main script
Clear-Host
Show-Header

if (-not (Test-NodeInstalled)) {
    Read-Host "Press Enter to exit"
    exit
}

while ($true) {
    Show-Menu
    $choice = Read-Host "Enter your choice"
    
    switch ($choice) {
        "0" {
            Run-JSFile "00-environment-setup\hello-world.js"
        }
        "1" {
            Write-Host ""
            Write-Host "📂 Iteration 1: JavaScript Basics" -ForegroundColor Magenta
            Write-Host ""
            Run-JSFile "01-js-basics\variables.js"
            Run-JSFile "01-js-basics\operators.js"
        }
        "2" {
            Write-Host ""
            Write-Host "📂 Iteration 2: Control Structures" -ForegroundColor Magenta
            Write-Host ""
            Run-JSFile "02-control-structures\if-else.js"
        }
        "3" {
            Write-Host ""
            Write-Host "📂 Iteration 3: Functions and DOM" -ForegroundColor Magenta
            Write-Host ""
            Run-JSFile "03-functions-and-dom\functions.js"
            Write-Host "💡 To see DOM examples, open 03-functions-and-dom\index.html in a browser" -ForegroundColor Yellow
        }
        "4" {
            Write-Host ""
            Write-Host "📂 Iteration 4: ES6 Features" -ForegroundColor Magenta
            Write-Host ""
            Run-JSFile "04-es6-features\arrow-functions.js"
        }
        "5" {
            Write-Host ""
            Write-Host "📂 Iteration 5: React Setup" -ForegroundColor Magenta
            Write-Host ""
            Write-Host "To create a React app:" -ForegroundColor Yellow
            Write-Host "  cd 05-react-setup"
            Write-Host "  npm create vite@latest my-first-react-app -- --template react"
            Write-Host "  cd my-first-react-app"
            Write-Host "  npm install"
            Write-Host "  npm run dev"
            Write-Host ""
        }
        "help" {
            Clear-Host
            if (Test-Path "GETTING_STARTED.md") {
                Get-Content "GETTING_STARTED.md"
            }
            else {
                Write-Host "📖 Getting Started Guide not found." -ForegroundColor Red
            }
            Write-Host ""
        }
        "exit" {
            Write-Host ""
            Write-Host "👋 Happy coding! Keep learning!" -ForegroundColor Green
            Write-Host ""
            exit
        }
        default {
            Write-Host ""
            Write-Host "❌ Invalid choice. Please try again." -ForegroundColor Red
            Write-Host ""
        }
    }
    
    Read-Host "Press Enter to continue"
    Clear-Host
    Show-Header
}
