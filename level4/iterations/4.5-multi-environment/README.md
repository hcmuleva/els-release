# Iteration 4.5: Multi-Environment GitOps Strategy

**Duration**: ~2-3 hours  
**Difficulty**: ⭐⭐⭐⭐ Advanced

## 🎯 Learning Objectives

- ✅ Implement multi-environment GitOps
- ✅ Use Git branches or directories for environments
- ✅ Manage environment-specific configurations
- ✅ Deploy to dev, staging, production
- ✅ Implement promotion workflows
- ✅ Use ArgoCD Projects for isolation

## 📚 Multi-Environment Strategies

### Strategy 1: Directory-Based (Recommended)

```
gitops-temple-stack/
├── apps/
│   ├── dev/
│   │   └── temple-stack.yaml
│   ├── staging/
│   │   └── temple-stack.yaml
│   └── production/
│       └── temple-stack.yaml
└── charts/
    └── temple-stack/
        ├── values.yaml
        ├── values-dev.yaml
        ├── values-staging.yaml
        └── values-prod.yaml
```

### Strategy 2: Branch-Based

- `dev` branch → Dev environment
- `staging` branch → Staging environment
- `main` branch → Production environment

### Strategy 3: Kustomize Overlays

```
gitops-temple-stack/
├── base/
│   └── temple-stack/
└── overlays/
    ├── dev/
    ├── staging/
    └── production/
```

## 🛠️ Implementation: Directory-Based Approach

### Step 1: Repository Structure

```bash
mkdir -p gitops-temple-stack/{apps/{dev,staging,production},charts}
cd gitops-temple-stack

# Copy temple-stack chart
cp -r /path/to/temple-stack charts/
```

### Step 2: Development Environment

```yaml
# apps/dev/temple-stack.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: temple-stack-dev
  namespace: argocd
  labels:
    environment: development
spec:
  project: temple-dev
  
  source:
    repoURL: https://github.com/your-org/gitops-temple-stack.git
    targetRevision: HEAD
    path: charts/temple-stack
    helm:
      releaseName: temple-dev
      valueFiles:
      - values.yaml
      - values-dev.yaml
  
  destination:
    server: https://kubernetes.default.svc
    namespace: temple-dev
  
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

### Step 3: Staging Environment

```yaml
# apps/staging/temple-stack.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: temple-stack-staging
  namespace: argocd
  labels:
    environment: staging
spec:
  project: temple-staging
  
  source:
    repoURL: https://github.com/your-org/gitops-temple-stack.git
    targetRevision: release-candidate  # Specific branch
    path: charts/temple-stack
    helm:
      releaseName: temple-staging
      valueFiles:
      - values.yaml
      - values-staging.yaml
  
  destination:
    server: https://kubernetes.default.svc
    namespace: temple-staging
  
  syncPolicy:
    automated:
      prune: true
      selfHeal: false  # Manual approval for staging
```

### Step 4: Production Environment

```yaml
# apps/production/temple-stack.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: temple-stack-prod
  namespace: argocd
  labels:
    environment: production
spec:
  project: temple-prod
  
  source:
    repoURL: https://github.com/your-org/gitops-temple-stack.git
    targetRevision: v1.0.0  # Git tag for production
    path: charts/temple-stack
    helm:
      releaseName: temple-prod
      valueFiles:
      - values.yaml
      - values-prod.yaml
  
  destination:
    server: https://kubernetes.default.svc
    namespace: temple-prod
  
  syncPolicy:
    automated: null  # Manual sync only for production
    syncOptions:
    - CreateNamespace=true
```

### Step 5: Create ArgoCD Projects

```yaml
# projects/temple-dev.yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: temple-dev
  namespace: argocd
spec:
  description: Temple Stack Development Environment
  
  sourceRepos:
  - https://github.com/your-org/gitops-temple-stack.git
  
  destinations:
  - namespace: temple-dev
    server: https://kubernetes.default.svc
  
  clusterResourceWhitelist:
  - group: ''
    kind: Namespace

---
# projects/temple-staging.yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: temple-staging
  namespace: argocd
spec:
  description: Temple Stack Staging Environment
  
  sourceRepos:
  - https://github.com/your-org/gitops-temple-stack.git
  
  destinations:
  - namespace: temple-staging
    server: https://kubernetes.default.svc

---
# projects/temple-prod.yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: temple-prod
  namespace: argocd
spec:
  description: Temple Stack Production Environment
  
  sourceRepos:
  - https://github.com/your-org/gitops-temple-stack.git
  
  destinations:
  - namespace: temple-prod
    server: https://kubernetes.default.svc
  
  # Production restrictions
  clusterResourceWhitelist:
  - group: ''
    kind: Namespace
  
  namespaceResourceBlacklist:
  - group: ''
    kind: ResourceQuota
```

## 🚀 Deployment Workflow

### Step 1: Deploy Projects

```bash
kubectl apply -f projects/temple-dev.yaml
kubectl apply -f projects/temple-staging.yaml
kubectl apply -f projects/temple-prod.yaml
```

### Step 2: Deploy Applications

```bash
# Deploy dev (auto-syncs)
kubectl apply -f apps/dev/temple-stack.yaml

# Deploy staging (auto-syncs from specific branch)
kubectl apply -f apps/staging/temple-stack.yaml

# Deploy production (manual sync only)
kubectl apply -f apps/production/temple-stack.yaml
```

### Step 3: Promotion Workflow

**Dev → Staging**:
```bash
# Merge dev to release-candidate branch
git checkout release-candidate
git merge dev
git push

# Staging auto-syncs
argocd app get temple-stack-staging --refresh
```

**Staging → Production**:
```bash
# Tag release
git tag -a v1.0.0 -m "Release v1.0.0"
git push --tags

# Update production app to use v1.0.0
# Edit apps/production/temple-stack.yaml:
#   targetRevision: v1.0.0

# Manual sync production
argocd app sync temple-stack-prod
```

## ✅ Validation

```bash
# All projects created
argocd proj list

# All applications created
argocd app list

# Check each environment
argocd app get temple-stack-dev
argocd app get temple-stack-staging
argocd app get temple-stack-prod

# Verify resources
kubectl get all -n temple-dev
kubectl get all -n temple-staging
kubectl get all -n temple-prod

# Test promotion
# 1. Make change in dev
# 2. Commit and push
# 3. Verify dev auto-syncs
# 4. Promote to staging
# 5. Verify staging syncs
# 6. Tag release
# 7. Manually sync production
```

## 📚 Best Practices

1. **Git Tags for Production** - Use semver tags
2. **Manual Sync for Prod** - Require manual approval
3. **Separate Projects** - Isolation and RBAC
4. **Environment-Specific Values** - values-{env}.yaml
5. **Branch Protection** - Protect main/production branches
6. **PR Reviews** - Require reviews for production changes
7. **Rollback Strategy** - Keep previous tags

## 🎉 Level 4 Complete!

**Congratulations!** You've mastered GitOps with ArgoCD:
- ✅ Installed and configured ArgoCD
- ✅ Created Applications from Git
- ✅ Deployed Helm charts with ArgoCD
- ✅ Configured sync policies and automation
- ✅ Implemented multi-environment strategy

**Ready for**: [Level 5: Production-Grade Features →](../../level5/README.md)

---

**Your GitOps journey is complete!** 🚀🎓
