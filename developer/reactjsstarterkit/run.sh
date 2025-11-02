#!/bin/bash

# 🚀 React Starter Kit - Quick Setup Script
# This script helps you set up and navigate through the learning iterations

echo "════════════════════════════════════════════════"
echo "  🚀 JavaScript + React Starter Kit"
echo "════════════════════════════════════════════════"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Please install Node.js from https://nodejs.org/"
    echo ""
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "⚠️  Warning: Node.js version 16 or higher is recommended"
    echo "   Your version: $(node -v)"
    echo ""
fi

echo "✅ Node.js is installed: $(node -v)"
echo "✅ npm is installed: $(npm -v)"
echo ""

# Function to show menu
show_menu() {
    echo "════════════════════════════════════════════════"
    echo "  Choose an action:"
    echo "════════════════════════════════════════════════"
    echo ""
    echo "  JavaScript Basics:"
    echo "  [0] Test Environment (Run hello-world.js)"
    echo "  [1] JavaScript Basics"
    echo "  [2] Control Structures"
    echo "  [3] Functions and DOM"
    echo "  [4] ES6 Features"
    echo ""
    echo "  React Applications:"
    echo "  [5] Setup React App (Iteration 5)"
    echo "  [6] React Components (Iteration 6)"
    echo "  [7] Props & State (Iteration 7)"
    echo "  [8] Events & Lists (Iteration 8)"
    echo "  [9] Fetch API (Iteration 9)"
    echo "  [10] Mini Project (Iteration 10)"
    echo ""
    echo "  Other:"
    echo "  [help] Show getting started guide"
    echo "  [check] Check all JavaScript examples"
    echo "  [exit] Exit"
    echo ""
    echo -n "Enter your choice: "
}

# Function to run JavaScript file
run_js() {
    local file=$1
    if [ -f "$file" ]; then
        echo ""
        echo "▶️  Running: $file"
        echo "════════════════════════════════════════════════"
        node "$file"
        echo "════════════════════════════════════════════════"
        echo ""
    else
        echo "❌ File not found: $file"
    fi
}

# Function to show help
show_help() {
    if [ -f "GETTING_STARTED.md" ]; then
        cat GETTING_STARTED.md
    else
        echo "📖 Getting Started Guide not found."
        echo "    Please read the README.md files in each iteration folder."
    fi
}

# Function to check all examples
check_all() {
    echo ""
    echo "🔍 Checking all JavaScript iterations..."
    echo ""
    
    # Iteration 0
    if [ -f "00-environment-setup/hello-world.js" ]; then
        echo "✅ Iteration 0: Environment Setup"
        run_js "00-environment-setup/hello-world.js"
    fi
    
    # Iteration 1
    if [ -f "01-js-basics/variables.js" ]; then
        echo "✅ Iteration 1: JavaScript Basics"
        run_js "01-js-basics/variables.js"
    fi
    
    echo "✅ All iterations checked!"
    echo ""
}

# Main loop
while true; do
    show_menu
    read choice
    
    case $choice in
        0)
            run_js "00-environment-setup/hello-world.js"
            ;;
        1)
            echo ""
            echo "📂 Iteration 1: JavaScript Basics"
            echo ""
            run_js "01-js-basics/variables.js"
            run_js "01-js-basics/operators.js"
            ;;
        2)
            echo ""
            echo "📂 Iteration 2: Control Structures"
            echo ""
            run_js "02-control-structures/if-else.js"
            ;;
        3)
            echo ""
            echo "📂 Iteration 3: Functions and DOM"
            echo ""
            run_js "03-functions-and-dom/functions.js"
            echo "💡 To see DOM examples, open 03-functions-and-dom/index.html in a browser"
            ;;
        4)
            echo ""
            echo "📂 Iteration 4: ES6 Features"
            echo ""
            run_js "04-es6-features/arrow-functions.js"
            ;;
        5)
            echo ""
            echo "📂 Iteration 5: React Setup"
            echo ""
            echo "To create a React app:"
            echo "  cd 05-react-setup"
            echo "  npm create vite@latest my-first-react-app -- --template react"
            echo "  cd my-first-react-app"
            echo "  npm install"
            echo "  npm run dev"
            echo ""
            ;;
        help)
            show_help
            ;;
        check)
            check_all
            ;;
        exit)
            echo ""
            echo "👋 Happy coding! Keep learning!"
            echo ""
            exit 0
            ;;
        *)
            echo ""
            echo "❌ Invalid choice. Please try again."
            echo ""
            ;;
    esac
    
    echo "Press Enter to continue..."
    read
    clear
done
