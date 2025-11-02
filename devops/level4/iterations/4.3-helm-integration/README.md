# Iteration 4.3: Helm Integration with ArgoCD

**Duration**: ~2-2.5 hours  
**Difficulty**: ⭐⭐⭐⭐ Advanced

## 🎯 Learning Objectives

- ✅ Deploy Helm charts with ArgoCD
- ✅ Manage Helm values in Git
- ✅ Use values files and parameters
- ✅ Deploy temple-stack with ArgoCD + Helm
- ✅ Handle chart dependencies

## 📚 Helm Source Configuration

```yaml
spec:
  source:
    repoURL: https://github.com/org/repo.git
    targetRevision: HEAD
    path: charts/myapp
    helm:
      # Values files
      valueFiles:
      - values.yaml
      - values-production.yaml
      
      # Override values
      parameters:
      - name: replicas
        value: "3"
      - name: image.tag
        value: "v1.2.3"
      
      # Release name
      releaseName: myapp
```

## 🛠️ Deploy Temple Stack with ArgoCD

### Task 1: Prepare Git Repository

```bash
# Create repository structure
mkdir -p gitops-temple-stack
cd gitops-temple-stack

# Copy temple-stack chart
cp -r /path/to/level3/iterations/3.5-umbrella-chart/solution/temple-stack/ charts/

# Create ArgoCD application manifests
mkdir apps
```

### Task 2: Create Application for Temple Stack

```yaml
# apps/temple-stack-dev.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: temple-stack-dev
  namespace: argocd
spec:
  project: default
  
  source:
    repoURL: https://github.com/your-org/gitops-temple-stack.git
    targetRevision: main
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

### Task 3: Create Values Override

```yaml
# charts/temple-stack/values-dev.yaml
global:
  environment: development

postgres:
  enabled: true
  persistence:
    size: 1Gi

temple-api:
  replicas: 1
  image:
    tag: "dev-latest"

temple-ui:
  replicas: 1
  image:
    tag: "dev-latest"
```

### Task 4: Deploy via ArgoCD

```bash
# Push to Git
git add .
git commit -m "Add temple-stack ArgoCD application"
git push

# Create application
kubectl apply -f apps/temple-stack-dev.yaml

# Or via CLI
argocd app create temple-stack-dev \
  --repo https://github.com/your-org/gitops-temple-stack.git \
  --path charts/temple-stack \
  --dest-namespace temple-dev \
  --dest-server https://kubernetes.default.svc \
  --helm-set-file values=values-dev.yaml \
  --sync-policy automated
```

### Task 5: Monitor Deployment

```bash
# Watch sync
argocd app get temple-stack-dev --refresh

# Check resources
kubectl get all -n temple-dev

# View logs
kubectl logs -n temple-dev -l app=temple-api

# Port-forward to test
kubectl port-forward -n temple-dev svc/temple-ui-service 8080:80
```

## 🎯 Production Deployment

```yaml
# apps/temple-stack-prod.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: temple-stack-prod
  namespace: argocd
spec:
  project: default
  
  source:
    repoURL: https://github.com/your-org/gitops-temple-stack.git
    targetRevision: v1.0.0  # Tagged release
    path: charts/temple-stack
    helm:
      releaseName: temple-prod
      valueFiles:
      - values.yaml
      - values-prod.yaml
      parameters:
      - name: temple-api.replicas
        value: "3"
      - name: temple-ui.replicas
        value: "3"
  
  destination:
    server: https://kubernetes.default.svc
    namespace: temple-prod
  
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

## ✅ Validation

```bash
# Applications created
argocd app list | grep temple-stack

# Both synced
argocd app get temple-stack-dev
argocd app get temple-stack-prod

# Resources deployed
kubectl get all -n temple-dev
kubectl get all -n temple-prod

# Helm releases managed by ArgoCD
helm list -n temple-dev
helm list -n temple-prod
```

## 🎯 Next Steps

**Next**: [Iteration 4.4: Sync Policies and Health Checks](../4.4-sync-policies/README.md)

Learn automated sync, self-healing, and advanced sync options.
