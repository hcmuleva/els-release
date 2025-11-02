# 🪟 Windows Setup Guide

## Windows-Specific Instructions for React Starter Kit

This guide covers the differences and changes needed to run this starter kit on Windows.

---

## 🔧 Prerequisites for Windows

### 1. Install Node.js
- Download from: https://nodejs.org/
- Choose the **Windows Installer (.msi)** - LTS version
- During installation:
  - ✅ Check "Automatically install necessary tools"
  - ✅ Add to PATH (should be default)
- Verify installation:
```cmd
node --version
npm --version
```

### 2. Install VS Code
- Download from: https://code.visualstudio.com/
- Windows installer will automatically add to PATH
- Recommended extensions:
  - ESLint
  - Prettier - Code formatter
  - JavaScript (ES6) code snippets

### 3. Terminal Options

#### Option A: PowerShell (Recommended)
- Built into Windows 10/11
- Open: `Windows Key + X` → "Windows PowerShell"

#### Option B: Command Prompt (cmd)
- Open: `Windows Key + R` → type `cmd`

#### Option C: Git Bash (Best for Unix-like commands)
- Install Git for Windows: https://git-scm.com/download/win
- Includes Bash emulation
- Makes the `run.sh` script work!

#### Option D: Windows Terminal (Modern, Recommended)
- Install from Microsoft Store
- Supports PowerShell, CMD, Git Bash in tabs

---

## 📝 Key Differences from macOS/Linux

### File Paths

**macOS/Linux:**
```bash
/Users/Harish.Muleva/project/experiments/m2m/dev-test-ops-pro/basics/reactjsstarterkit
```

**Windows:**
```cmd
C:\Users\Harish\project\experiments\m2m\dev-test-ops-pro\basics\reactjsstarterkit
```

### Path Separators

**macOS/Linux:** Forward slash `/`  
**Windows:** Backslash `\` (but Node.js accepts `/` too!)

### Commands

| Task | macOS/Linux | Windows (CMD/PowerShell) |
|------|-------------|--------------------------|
| List files | `ls` | `dir` |
| List files (PowerShell) | `ls` | `ls` or `Get-ChildItem` |
| Change directory | `cd folder` | `cd folder` |
| Current directory | `pwd` | `cd` or `pwd` (PowerShell) |
| Clear screen | `clear` | `cls` or `clear` (PowerShell) |
| View file | `cat file.md` | `type file.md` or `Get-Content` |
| Run script | `./run.sh` | `bash run.sh` (Git Bash) |

---

## 🚀 Quick Start on Windows

### Using PowerShell or Command Prompt:

```powershell
# Navigate to the starter kit
cd C:\Users\YourName\project\experiments\m2m\dev-test-ops-pro\basics\reactjsstarterkit

# Test Node.js installation
node --version

# Run your first JavaScript program
node 00-environment-setup\hello-world.js

# View README files
type README.md
# or in PowerShell:
Get-Content README.md

# Run other JavaScript files
node 01-js-basics\variables.js
node 02-control-structures\loops.js
```

### Using Git Bash (Unix-like):

```bash
# Navigate to the starter kit
cd /c/Users/YourName/project/experiments/m2m/dev-test-ops-pro/basics/reactjsstarterkit

# Everything works like macOS/Linux
node 00-environment-setup/hello-world.js
cat README.md
./run.sh  # The bash script will work!
```

---

## 🔄 Running the Interactive Script

### Option 1: Git Bash (Easiest)
```bash
# Install Git Bash first, then:
bash run.sh
```

### Option 2: Use the Windows Batch Script
I've created a `run.bat` file for Windows users:
```cmd
run.bat
```

### Option 3: Use PowerShell Script
Use `run.ps1` for PowerShell:
```powershell
.\run.ps1
```

---

## 📂 Opening HTML Files in Browser

### Method 1: File Explorer
1. Navigate to `03-functions-and-dom` folder
2. Double-click `index.html`
3. Opens in default browser

### Method 2: From Terminal
```cmd
# Command Prompt
start 03-functions-and-dom\index.html

# PowerShell
start 03-functions-and-dom\index.html

# Git Bash
start 03-functions-and-dom/index.html
```

### Method 3: VS Code
1. Right-click `index.html` in VS Code
2. Select "Open with Live Server" (if extension installed)
3. Or "Reveal in File Explorer" → double-click

---

## ⚛️ React Development on Windows

### Creating React Apps (Works Identically)

```cmd
# Navigate to iteration folder
cd 05-react-setup

# Create React app with Vite (works same on Windows)
npm create vite@latest my-first-react-app -- --template react

# Navigate into project
cd my-first-react-app

# Install dependencies
npm install

# Start development server
npm run dev
```

**Output will show:**
```
Local:   http://localhost:5173/
```

Open this URL in any browser (Chrome, Edge, Firefox)

---

## 🐛 Common Windows Issues & Solutions

### Issue 1: "node: command not found"
**Solution:**
- Node.js not installed or not in PATH
- Reinstall Node.js with default options
- Restart terminal after installation

### Issue 2: "Cannot run scripts" (PowerShell)
**Error:**
```
run.ps1 cannot be loaded because running scripts is disabled
```

**Solution:**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 3: Path with spaces
**Problem:**
```
cd C:\Users\My Name\project
```

**Solution:**
```cmd
# Use quotes
cd "C:\Users\My Name\project"
```

### Issue 4: Line endings (CRLF vs LF)
**Problem:** Scripts created on macOS might have LF endings

**Solution (Git Bash):**
```bash
dos2unix run.sh
# or
sed -i 's/\r$//' run.sh
```

### Issue 5: npm install errors
**Solution:**
```cmd
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rmdir /s node_modules
del package-lock.json

# Reinstall
npm install
```

---

## 📝 Windows-Specific File Updates

### Key Changes Made:

1. **Created `run.bat`** - Windows batch script equivalent
2. **Created `run.ps1`** - PowerShell script
3. **Updated paths** - All examples now show both Unix and Windows paths
4. **Command equivalents** - Added Windows commands throughout

---

## 🎯 Recommended Setup for Windows Users

### Best Configuration:

1. **Install Git for Windows** (includes Git Bash)
   - Download: https://git-scm.com/download/win
   - Use Git Bash for all commands
   - Makes `run.sh` work without modification

2. **Use Windows Terminal**
   - Modern, tabbed interface
   - Supports Git Bash, PowerShell, CMD
   - Better color support

3. **Set Git Bash as Default in VS Code**
   ```json
   // settings.json
   {
     "terminal.integrated.defaultProfile.windows": "Git Bash"
   }
   ```

4. **Install VS Code Extensions**
   - Live Server (for HTML files)
   - ESLint
   - Prettier

---

## 🚀 Quick Start Checklist for Windows

- [ ] Node.js installed and verified (`node --version`)
- [ ] VS Code installed
- [ ] Git Bash installed (recommended)
- [ ] Navigated to starter kit folder
- [ ] Ran `node 00-environment-setup\hello-world.js` successfully
- [ ] Chosen preferred terminal (Git Bash recommended)
- [ ] Opened `INDEX.md` to start learning

---

## 💡 Windows Tips

### Tip 1: Use Tab Completion
Press `Tab` to auto-complete file/folder names in any terminal

### Tip 2: Copy-Paste in Terminal
- **CMD**: Right-click to paste
- **PowerShell**: `Ctrl+V` to paste
- **Git Bash**: `Shift+Insert` or right-click

### Tip 3: Open Folder in VS Code
```cmd
# From terminal, in any folder:
code .
```

### Tip 4: Use Forward Slashes
Node.js on Windows accepts forward slashes:
```cmd
node 01-js-basics/variables.js  # Works!
```

### Tip 5: Windows Terminal Split Panes
- `Alt+Shift+D` - Duplicate pane
- `Alt+Shift+-` - Split horizontal
- `Alt+Shift++` - Split vertical

---

## 📚 Learning Path (Same on Windows!)

The learning path is **identical** on Windows:

1. Start with `00-environment-setup`
2. Complete iterations 1-4 (JavaScript)
3. Move to iterations 5-10 (React)
4. Build the final Notes App

**All JavaScript and React code works identically on Windows!**

---

## 🎓 Summary

### What's Different on Windows:
- ✅ Path separators (`\` instead of `/`)
- ✅ Terminal commands (`dir` instead of `ls`)
- ✅ Script execution (use `.bat`, `.ps1`, or Git Bash)

### What's the Same:
- ✅ Node.js and npm work identically
- ✅ All JavaScript code runs the same
- ✅ React development is identical
- ✅ All code examples work without changes
- ✅ Learning path and iterations are the same

---

## 🆘 Need Help?

### Check these resources:
- Node.js Windows docs: https://nodejs.org/en/download/package-manager/
- VS Code on Windows: https://code.visualstudio.com/docs/setup/windows
- Git for Windows: https://git-scm.com/download/win
- Windows Terminal: https://aka.ms/terminal

---

**Windows users - you're all set! Start learning with `INDEX.md`** 🚀

**Recommended:** Use Git Bash for the smoothest experience!
