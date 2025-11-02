# 🛠️ Prerequisites & Setup Guide

This guide will help you set up all the tools needed for the Temple Stack Learning Path.

## 📋 Table of Contents

- [System Requirements](#system-requirements)
- [Level 1-2 Tools](#level-1-2-tools-kubernetes-basics)
- [Level 3 Tools](#level-3-tools-helm)
- [Level 4 Tools](#level-4-tools-argocd)
- [Level 5 Tools](#level-5-tools-production-features)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## 💻 System Requirements

### Minimum Requirements
- **OS**: macOS, Linux, or Windows 10/11
- **RAM**: 8 GB (16 GB recommended)
- **Disk**: 20 GB free space
- **CPU**: 4 cores (2 cores minimum)

### Recommended Requirements
- **RAM**: 16 GB+
- **Disk**: 50 GB SSD
- **CPU**: 8 cores

---

## 🚀 Level 1-2 Tools (Kubernetes Basics)

### 1. Docker Desktop (Recommended for beginners)

**macOS**:
```bash
# Download from: https://www.docker.com/products/docker-desktop

# After installation, enable Kubernetes:
# Docker Desktop → Settings → Kubernetes → Enable Kubernetes
```

**Linux**:
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER
newgrp docker

# For Kubernetes, use Minikube (see alternative below)
```

**Windows**:
```powershell
# Download from: https://www.docker.com/products/docker-desktop
# Enable Kubernetes in settings after installation
```

**Verify Docker**:
```bash
docker --version
# Expected: Docker version 20.x or higher

docker ps
# Should run without errors
```

### 2. kubectl (Kubernetes CLI)

**macOS**:
```bash
# Using Homebrew
brew install kubectl

# Or direct download
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

**Linux**:
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

**Windows** (PowerShell as Admin):
```powershell
choco install kubernetes-cli
# Or download from https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
```

**Verify kubectl**:
```bash
kubectl version --client
# Expected: Client Version with recent version

kubectl cluster-info
# Should show cluster running
```

### 3. Git

**macOS**:
```bash
# Usually pre-installed, or:
brew install git
```

**Linux**:
```bash
sudo apt-get install git  # Debian/Ubuntu
sudo yum install git      # RHEL/CentOS
```

**Windows**:
```powershell
choco install git
# Or download from https://git-scm.com/download/win
```

**Verify Git**:
```bash
git --version
# Expected: git version 2.x or higher
```

### 4. Text Editor

**Recommended**: Visual Studio Code
```bash
# macOS
brew install --cask visual-studio-code

# Linux - download from https://code.visualstudio.com/

# Windows
choco install vscode
```

**VS Code Extensions** (recommended):
- Kubernetes
- YAML
- Docker
- GitLens

---

## Alternative: Minikube

If you prefer Minikube over Docker Desktop:

**Installation**:
```bash
# macOS
brew install minikube

# Linux
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Windows
choco install minikube
```

**Start Minikube**:
```bash
minikube start --cpus=4 --memory=8192 --disk-size=20g
minikube addons enable ingress
```

**Verify**:
```bash
minikube status
kubectl get nodes
```

---

## 📦 Level 3 Tools (Helm)

### Helm 3

**macOS**:
```bash
brew install helm
```

**Linux**:
```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

**Windows**:
```powershell
choco install kubernetes-helm
```

**Verify Helm**:
```bash
helm version
# Expected: version.BuildInfo{Version:"v3.x.x"

helm repo add stable https://charts.helm.sh/stable
helm repo update
```

---

## 🔄 Level 4 Tools (ArgoCD)

### ArgoCD CLI

**macOS**:
```bash
brew install argocd
```

**Linux**:
```bash
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64
```

**Windows**:
```powershell
# Download from: https://github.com/argoproj/argo-cd/releases/latest
# Add to PATH
```

**Verify ArgoCD CLI**:
```bash
argocd version --client
```

### GitHub/GitLab Account

You'll need a Git repository to practice GitOps:
- Create account at https://github.com or https://gitlab.com
- Set up SSH keys or personal access tokens

---

## 🏆 Level 5 Tools (Production Features)

These will be installed as part of Level 5 iterations, but here's the overview:

### 5.1 - Vault
```bash
# macOS
brew install hashicorp/tap/vault

# Linux
wget https://releases.hashicorp.com/vault/1.15.0/vault_1.15.0_linux_amd64.zip
unzip vault_1.15.0_linux_amd64.zip
sudo mv vault /usr/local/bin/
```

### 5.3 - Monitoring Tools
- Prometheus (via Helm)
- Grafana (via Helm)
- Installation covered in iteration 5.3

### 5.4 - Logging Tools
- Loki or ELK Stack (via Helm)
- Installation covered in iteration 5.4

### 5.8 - Chaos Engineering
- Chaos Mesh (via Helm)
- Installation covered in iteration 5.8

---

## ✅ Verification Checklist

Run these commands to verify your setup:

```bash
# Docker
docker --version && docker ps

# Kubernetes
kubectl version --client
kubectl cluster-info
kubectl get nodes

# Helm (Level 3+)
helm version

# ArgoCD CLI (Level 4+)
argocd version --client

# Git
git --version
```

### Quick Verification Script

Save this as `verify-setup.sh`:

```bash
#!/bin/bash

echo "🔍 Verifying Learning Path Prerequisites..."
echo ""

# Check Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker: $(docker --version)"
else
    echo "❌ Docker: Not installed"
fi

# Check kubectl
if command -v kubectl &> /dev/null; then
    echo "✅ kubectl: $(kubectl version --client --short 2>/dev/null || echo 'Installed')"
else
    echo "❌ kubectl: Not installed"
fi

# Check Kubernetes cluster
if kubectl cluster-info &> /dev/null; then
    echo "✅ Kubernetes cluster: Running"
else
    echo "❌ Kubernetes cluster: Not accessible"
fi

# Check Git
if command -v git &> /dev/null; then
    echo "✅ Git: $(git --version)"
else
    echo "❌ Git: Not installed"
fi

# Check Helm (optional for Level 1-2)
if command -v helm &> /dev/null; then
    echo "✅ Helm: $(helm version --short 2>/dev/null || echo 'Installed')"
else
    echo "⚠️  Helm: Not installed (required for Level 3+)"
fi

# Check ArgoCD (optional for Level 1-3)
if command -v argocd &> /dev/null; then
    echo "✅ ArgoCD CLI: Installed"
else
    echo "⚠️  ArgoCD CLI: Not installed (required for Level 4+)"
fi

echo ""
echo "🎯 Setup Status:"
echo "   Level 1-2: $(kubectl cluster-info &> /dev/null && echo 'Ready ✅' || echo 'Not Ready ❌')"
echo "   Level 3: $(command -v helm &> /dev/null && echo 'Ready ✅' || echo 'Install Helm first ⚠️')"
echo "   Level 4: $(command -v argocd &> /dev/null && echo 'Ready ✅' || echo 'Install ArgoCD CLI first ⚠️')"
```

Run it:
```bash
chmod +x verify-setup.sh
./verify-setup.sh
```

---

## 🔧 Troubleshooting

### Docker Desktop Kubernetes not starting

**macOS/Windows**:
1. Reset Kubernetes: Docker Desktop → Settings → Kubernetes → Reset Kubernetes Cluster
2. Increase resources: Settings → Resources → Adjust CPU/Memory
3. Restart Docker Desktop

### kubectl cannot connect to cluster

```bash
# Check context
kubectl config get-contexts

# Set correct context (Docker Desktop)
kubectl config use-context docker-desktop

# Or for Minikube
kubectl config use-context minikube
```

### Permission denied errors (Linux)

```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Test
docker ps
```

### Helm repo errors

```bash
# Remove and re-add repos
helm repo remove stable
helm repo add stable https://charts.helm.sh/stable
helm repo update
```

### Port conflicts

If ports 80/443/8080 are in use:
```bash
# Find process using port
lsof -i :80  # macOS/Linux
netstat -ano | findstr :80  # Windows

# Kill process or change service ports
```

---

## 📚 Additional Resources

### Documentation
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Docker Docs](https://docs.docker.com/)
- [Helm Docs](https://helm.sh/docs/)
- [ArgoCD Docs](https://argo-cd.readthedocs.io/)

### Learning Resources
- [Kubernetes Basics Tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [Docker Getting Started](https://docs.docker.com/get-started/)
- [Helm Getting Started](https://helm.sh/docs/intro/quickstart/)

### Community
- [Kubernetes Slack](https://slack.kubernetes.io/)
- [CNCF Community](https://www.cncf.io/community/)

---

## ✨ Ready to Start!

Once all tools are installed and verified, you're ready to begin!

**Start here**: [Level 1: Kubernetes Basics](./level1/README.md)

**Questions?** Check the troubleshooting section or refer to official documentation.

Good luck! 🚀
