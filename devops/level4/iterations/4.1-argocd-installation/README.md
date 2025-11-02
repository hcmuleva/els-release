# Iteration 4.1: ArgoCD Installation and Setup

**Duration**: ~1-1.5 hours  
**Difficulty**: ⭐⭐⭐ Intermediate-Advanced

## 🎯 Learning Objectives

By the end of this iteration, you will:
- ✅ Understand ArgoCD architecture
- ✅ Install ArgoCD in Kubernetes
- ✅ Access ArgoCD UI and CLI
- ✅ Configure initial admin password
- ✅ Add Git repositories
- ✅ Navigate the ArgoCD interface

## 📚 Background

### What is ArgoCD?

**ArgoCD** is a declarative, GitOps continuous delivery tool for Kubernetes.

**Key Concepts**:
- 🔄 **GitOps**: Git as single source of truth
- 📝 **Declarative**: Desired state in Git
- 🔁 **Automated Sync**: Auto-deploy from Git
- 🎯 **Self-Healing**: Auto-correct drift
- 📊 **Observability**: Visual application state

### ArgoCD Architecture

```
┌─────────────────┐
│   Git Repo      │  ← Source of Truth
│  (manifests)    │
└────────┬────────┘
         │ polls/webhooks
         ↓
┌─────────────────────────────┐
│      ArgoCD Server          │
│  ┌──────────────────────┐  │
│  │ Application          │  │
│  │ Controller           │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ Repo Server          │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ API Server + UI      │  │
│  └──────────────────────┘  │
└─────────────┬───────────────┘
              │ applies
              ↓
┌─────────────────────────────┐
│   Kubernetes Cluster        │
│   (Deployments, Services)   │
└─────────────────────────────┘
```

## 📋 Prerequisites

- Completed [Level 3: Helm Charts](../../level3/README.md)
- kubectl configured and working
- Docker Desktop Kubernetes running
- Git repository access (GitHub/GitLab)

## 🛠️ Installation

### Step 1: Install ArgoCD

```bash
# Create argocd namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for pods to be ready
kubectl wait --for=condition=ready pod --all -n argocd --timeout=300s

# Verify installation
kubectl get pods -n argocd
kubectl get svc -n argocd
```

You should see:
- `argocd-server`
- `argocd-repo-server`
- `argocd-application-controller`
- `argocd-redis`
- `argocd-dex-server`

### Step 2: Access ArgoCD UI

**Method 1: Port Forward (Recommended for local)**

```bash
# Port forward to localhost
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Access at: https://localhost:8080
# Note: Accept self-signed certificate warning
```

**Method 2: LoadBalancer (for cloud)**

```bash
# Change service type to LoadBalancer
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'

# Get external IP
kubectl get svc argocd-server -n argocd
```

**Method 3: NodePort (for testing)**

```bash
# Change to NodePort
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'

# Get NodePort
kubectl get svc argocd-server -n argocd
# Access at: https://localhost:<nodeport>
```

### Step 3: Get Admin Password

```bash
# Get initial admin password
kubectl get secret argocd-initial-admin-secret -n argocd \
  -o jsonpath="{.data.password}" | base64 -d && echo

# Save this password!
```

### Step 4: Login to UI

1. Open browser: `https://localhost:8080`
2. Accept certificate warning
3. Username: `admin`
4. Password: (from Step 3)

You should see the ArgoCD dashboard!

### Step 5: Install ArgoCD CLI

**macOS**:
```bash
brew install argocd

# Or download binary
curl -sSL -o argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-darwin-amd64
chmod +x argocd
sudo mv argocd /usr/local/bin/
```

**Linux**:
```bash
curl -sSL -o argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
chmod +x argocd
sudo mv argocd /usr/local/bin/
```

**Verify**:
```bash
argocd version --client
```

### Step 6: Login via CLI

```bash
# Login (with port-forward running)
argocd login localhost:8080

# Username: admin
# Password: (your admin password)

# Accept self-signed certificate

# Verify
argocd cluster list
argocd app list
```

### Step 7: Change Admin Password

```bash
# Change password via CLI
argocd account update-password

# Or via UI: User Info → Update Password
```

### Step 8: Add Git Repository

**Via CLI**:
```bash
# Add public repository
argocd repo add https://github.com/your-org/your-repo.git

# Add private repository with credentials
argocd repo add https://github.com/your-org/your-repo.git \
  --username your-username \
  --password your-token

# Add private repo with SSH
argocd repo add git@github.com:your-org/your-repo.git \
  --ssh-private-key-path ~/.ssh/id_rsa

# List repositories
argocd repo list
```

**Via UI**:
1. Settings → Repositories
2. Click "Connect Repo"
3. Fill in repository details
4. Click "Connect"

## 🎯 Explore ArgoCD UI

### Dashboard Overview

**Main Sections**:
1. **Applications** - List of all applications
2. **Settings** - Repositories, Clusters, Projects
3. **User Info** - Account settings

### Create First Application (Preview)

We'll do this in detail in 4.2, but here's a preview:

1. Click "+ NEW APP"
2. Fill in:
   - Application Name: `test-app`
   - Project: `default`
   - Sync Policy: `Manual`
   - Repository URL: Your Git repo
   - Path: `path/to/manifests`
   - Cluster URL: `https://kubernetes.default.svc`
   - Namespace: `default`
3. Click "Create"

## 🎯 Practice Exercises

### Exercise 1: Install ArgoCD in Different Namespace

```bash
# Install in custom namespace
kubectl create namespace gitops
kubectl apply -n gitops -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Exercise 2: Configure Ingress for ArgoCD

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-server-ingress
  namespace: argocd
  annotations:
    nginx.ingress.kubernetes.io/ssl-passthrough: "true"
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
spec:
  ingressClassName: nginx
  rules:
  - host: argocd.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: argocd-server
            port:
              number: 443
```

### Exercise 3: Add Multiple Repositories

```bash
# Add multiple repos for different projects
argocd repo add https://github.com/argoproj/argocd-example-apps.git
argocd repo add https://github.com/bitnami/charts.git --type helm --name bitnami

# List all repos
argocd repo list
```

## ✅ Validation

Check your installation:

```bash
# All pods running
kubectl get pods -n argocd
# All should be Running

# Server accessible
curl -k https://localhost:8080/api/version
# Should return version info

# CLI working
argocd version
# Should show both client and server versions

# Can create applications
argocd app list
# Should return (possibly empty list)

# Repository added
argocd repo list
# Should show your repository
```

## 📚 Key Takeaways

- 📌 **ArgoCD** automates Kubernetes deployments from Git
- 📌 **Installation** is straightforward with kubectl
- 📌 **Access** via UI (web) or CLI (terminal)
- 📌 **Repositories** must be registered before use
- 📌 **Admin password** should be changed after install
- 📌 Multiple access methods: Port-forward, LoadBalancer, Ingress

## 🐛 Common Issues

### Pods not starting

```bash
# Check pod status
kubectl get pods -n argocd

# Check logs
kubectl logs -n argocd deployment/argocd-server

# Check events
kubectl get events -n argocd --sort-by='.lastTimestamp'
```

### Can't access UI

```bash
# Verify port-forward is running
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Check service
kubectl get svc argocd-server -n argocd

# Try different port
kubectl port-forward svc/argocd-server -n argocd 9090:443
```

### Certificate errors

```bash
# Use --insecure flag
argocd login localhost:8080 --insecure

# Or accept certificate in browser
# Chrome: Type "thisisunsafe" on warning page
```

### Login fails

```bash
# Reset admin password
kubectl delete secret argocd-initial-admin-secret -n argocd

# Restart argocd-server
kubectl rollout restart deployment argocd-server -n argocd

# Get new password
kubectl get secret argocd-initial-admin-secret -n argocd \
  -o jsonpath="{.data.password}" | base64 -d
```

## 🔧 Essential Commands

```bash
# Installation
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Access
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get password
kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d

# CLI login
argocd login localhost:8080

# Repository management
argocd repo add <repo-url>
argocd repo list

# Cluster management
argocd cluster add
argocd cluster list

# Check health
kubectl get pods -n argocd
argocd version
```

## 🎯 Next Steps

**Completed Iteration 4.1?** Excellent! 🎉

You now have ArgoCD installed and configured.

**Next**: [Iteration 4.2: Create Your First ArgoCD Application](../4.2-first-app/README.md)

In 4.2, you'll:
- Create ArgoCD Application CRD
- Deploy from Git repository
- Understand sync strategies
- Monitor application health

---

**ArgoCD is ready! Let's deploy applications with GitOps!** 🚀
