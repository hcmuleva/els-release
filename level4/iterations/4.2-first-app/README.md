# Iteration 4.2: Create Your First ArgoCD Application

**Duration**: ~1.5-2 hours  
**Difficulty**: ⭐⭐⭐ Intermediate-Advanced

## 🎯 Learning Objectives

- ✅ Create ArgoCD Application CRD
- ✅ Deploy from Git repository
- ✅ Understand sync strategies (manual vs auto)
- ✅ Monitor application health
- ✅ Perform manual sync
- ✅ View application details and logs

## 📚 Application CRD Structure

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  # Source: Where the manifests are
  source:
    repoURL: https://github.com/org/repo.git
    targetRevision: HEAD  # or branch/tag/commit
    path: k8s/manifests   # path to manifests
  
  # Destination: Where to deploy
  destination:
    server: https://kubernetes.default.svc
    namespace: my-app
  
  # Sync policy
  syncPolicy:
    automated: null  # manual sync
    syncOptions:
    - CreateNamespace=true
```

## 🛠️ Hands-On Exercise

### Task 1: Prepare Git Repository

Create a Git repository with Kubernetes manifests:

```bash
# Create directory structure
mkdir -p argocd-demo/apps/nginx
cd argocd-demo

# Create nginx deployment
cat > apps/nginx/deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
EOF

# Create nginx service
cat > apps/nginx/service.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
EOF

# Initialize Git and push
git init
git add .
git commit -m "Add nginx app"
git remote add origin <your-repo-url>
git push -u origin main
```

### Task 2: Create Application via CLI

```bash
# Create application
argocd app create nginx-app \
  --repo https://github.com/your-org/argocd-demo.git \
  --path apps/nginx \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace default \
  --sync-policy none

# List applications
argocd app list

# Get application details
argocd app get nginx-app
```

### Task 3: Create Application via YAML

```yaml
# nginx-application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: nginx-app
  namespace: argocd
spec:
  project: default
  
  source:
    repoURL: https://github.com/your-org/argocd-demo.git
    targetRevision: HEAD
    path: apps/nginx
  
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  
  syncPolicy:
    syncOptions:
    - CreateNamespace=true
```

Apply it:
```bash
kubectl apply -f nginx-application.yaml

# Check status
argocd app get nginx-app
```

### Task 4: Manual Sync

```bash
# Sync via CLI
argocd app sync nginx-app

# Watch sync progress
argocd app wait nginx-app --health

# Or sync via UI
# Click on application → SYNC → SYNCHRONIZE
```

### Task 5: View Application Details

```bash
# Get overview
argocd app get nginx-app

# Get manifest
argocd app manifests nginx-app

# Get history
argocd app history nginx-app

# View resources
kubectl get all -l app=nginx
```

### Task 6: Make Changes and Sync

```bash
# Update replicas in Git
cd argocd-demo
sed -i '' 's/replicas: 2/replicas: 3/' apps/nginx/deployment.yaml
git commit -am "Scale to 3 replicas"
git push

# ArgoCD detects drift
argocd app get nginx-app
# Status: OutOfSync

# Sync
argocd app sync nginx-app

# Verify
kubectl get deployment nginx
# Should show 3 replicas
```

## 🎯 Practice Exercises

### Exercise 1: Deploy from Different Branch

```bash
argocd app create nginx-dev \
  --repo https://github.com/your-org/argocd-demo.git \
  --revision dev \
  --path apps/nginx \
  --dest-namespace dev \
  --sync-policy none
```

### Exercise 2: Deploy with Labels

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: nginx-app
  namespace: argocd
  labels:
    environment: production
    team: platform
  annotations:
    notifications.argoproj.io/subscribe.on-sync-succeeded.slack: my-channel
```

### Exercise 3: Multi-Source Application

Deploy with both Helm chart and values:

```yaml
spec:
  sources:
  - repoURL: https://github.com/org/charts
    path: nginx-chart
  - repoURL: https://github.com/org/values
    path: production/nginx-values.yaml
```

## ✅ Validation

```bash
# Application created
argocd app list | grep nginx-app

# Application synced
argocd app get nginx-app | grep "Sync Status"
# Should show: Synced

# Health check
argocd app get nginx-app | grep "Health Status"
# Should show: Healthy

# Resources deployed
kubectl get deployment nginx
kubectl get svc nginx

# View in UI
# Applications → nginx-app
# Should see green status
```

## 📚 Application States

**Sync Status**:
- `Synced` - Git matches cluster
- `OutOfSync` - Differences detected
- `Unknown` - Can't determine state

**Health Status**:
- `Healthy` - All resources healthy
- `Progressing` - Deployment in progress
- `Degraded` - Some resources unhealthy
- `Missing` - Resources not found
- `Unknown` - Can't determine health

## 🎯 Next Steps

**Next**: [Iteration 4.3: Helm Integration with ArgoCD](../4.3-helm-integration/README.md)

Learn to deploy Helm charts using ArgoCD for the temple-stack application.

---

See `./solution/` for complete examples.
