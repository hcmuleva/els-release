# Iteration 4.4: Sync Policies and Health Checks

**Duration**: ~1.5-2 hours  
**Difficulty**: ⭐⭐⭐⭐ Advanced

## 🎯 Learning Objectives

- ✅ Configure automated sync
- ✅ Enable self-healing
- ✅ Configure prune (delete unused resources)
- ✅ Use sync waves for ordered deployment
- ✅ Implement sync hooks
- ✅ Custom health checks

## 📚 Sync Policy Options

### Automated Sync

```yaml
syncPolicy:
  automated:
    prune: true      # Delete resources not in Git
    selfHeal: true   # Auto-correct manual changes
    allowEmpty: false # Prevent deleting all resources
```

### Sync Options

```yaml
syncPolicy:
  syncOptions:
  - CreateNamespace=true    # Auto-create namespace
  - PruneLast=true          # Delete resources last
  - PrunePropagationPolicy=foreground
  - Replace=true            # Use replace instead of patch
  - ServerSideApply=true    # Use server-side apply
  - Validate=false          # Skip kubectl validation
```

### Sync Waves

Control deployment order with annotations:

```yaml
metadata:
  annotations:
    argocd.argoproj.io/sync-wave: "1"  # Deploy in order: 0, 1, 2...
```

**Example**:
- Wave 0: Namespaces, CRDs
- Wave 1: ConfigMaps, Secrets
- Wave 2: Databases (StatefulSets)
- Wave 3: APIs (Deployments)
- Wave 4: UIs (Deployments)
- Wave 5: Ingress

### Sync Hooks

Run tasks at specific points:

```yaml
metadata:
  annotations:
    argocd.argoproj.io/hook: PreSync  # or PostSync, SyncFail
    argocd.argoproj.io/hook-delete-policy: BeforeHookCreation
```

**Hook Types**:
- `PreSync` - Before sync
- `Sync` - During sync
- `PostSync` - After sync
- `SyncFail` - On sync failure

## 🛠️ Hands-On Examples

### Example 1: Full Automation

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: automated-app
  namespace: argocd
spec:
  source:
    repoURL: https://github.com/org/repo.git
    path: apps/myapp
  destination:
    server: https://kubernetes.default.svc
    namespace: myapp
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        maxDuration: 3m
```

### Example 2: Database Migration Hook

```yaml
# pre-sync-migration.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
  annotations:
    argocd.argoproj.io/hook: PreSync
    argocd.argoproj.io/hook-delete-policy: BeforeHookCreation
spec:
  template:
    spec:
      containers:
      - name: migrate
        image: myapp:latest
        command: ["npm", "run", "migrate"]
      restartPolicy: Never
```

### Example 3: Ordered Deployment with Waves

```yaml
# 1. Namespace (wave 0)
apiVersion: v1
kind: Namespace
metadata:
  name: temple-stack
  annotations:
    argocd.argoproj.io/sync-wave: "0"

---
# 2. Database Secret (wave 1)
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
  annotations:
    argocd.argoproj.io/sync-wave: "1"

---
# 3. Database (wave 2)
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  annotations:
    argocd.argoproj.io/sync-wave: "2"

---
# 4. API (wave 3)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: temple-api
  annotations:
    argocd.argoproj.io/sync-wave: "3"

---
# 5. UI (wave 4)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: temple-ui
  annotations:
    argocd.argoproj.io/sync-wave: "4"
```

### Example 4: Health Check Customization

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: custom-health
spec:
  # ... source and destination
  ignoreDifferences:
  - group: apps
    kind: Deployment
    jsonPointers:
    - /spec/replicas  # Ignore replica count differences
  
  # Custom health check
  info:
  - name: health-check-url
    value: http://myapp/health
```

## 🎯 Practice: Temple Stack with Advanced Sync

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: temple-stack-advanced
  namespace: argocd
spec:
  project: default
  
  source:
    repoURL: https://github.com/your-org/gitops-temple-stack.git
    targetRevision: main
    path: charts/temple-stack
    helm:
      valueFiles:
      - values-prod.yaml
  
  destination:
    server: https://kubernetes.default.svc
    namespace: temple-prod
  
  syncPolicy:
    # Full automation
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    
    # Sync options
    syncOptions:
    - CreateNamespace=true
    - PruneLast=true
    - ApplyOutOfSyncOnly=true
    
    # Retry on failure
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 5m
  
  # Ignore known differences
  ignoreDifferences:
  - group: apps
    kind: StatefulSet
    jsonPointers:
    - /spec/volumeClaimTemplates
```

## ✅ Validation

Test self-healing:

```bash
# Deploy application
kubectl apply -f temple-stack-advanced.yaml

# Make manual change
kubectl scale deployment temple-api --replicas=10 -n temple-prod

# ArgoCD should auto-correct within sync interval (default 3min)
# Or force sync:
argocd app sync temple-stack-advanced

# Verify self-heal
kubectl get deployment temple-api -n temple-prod
# Should return to Git-defined replica count
```

## 🎯 Next Steps

**Next**: [Iteration 4.5: Multi-Environment Strategy](../4.5-multi-environment/README.md)

Complete Level 4 with production multi-environment GitOps setup!
