# Iteration 3.5: Build Temple Stack Umbrella Chart

**Duration**: ~2-3 hours  
**Difficulty**: ⭐⭐⭐⭐ Advanced

## 🎯 Learning Objectives

- ✅ Create production umbrella chart
- ✅ Build sub-charts for each service
- ✅ Configure global values
- ✅ Implement conditional deployments
- ✅ Match `/devops/temple-stack/` structure

## 📁 Target Structure

```
temple-stack/
├── Chart.yaml              # Umbrella chart metadata
├── values.yaml             # Default values
├── values-dev.yaml         # Development overrides
├── values-prod.yaml        # Production overrides
└── charts/                 # Sub-charts
    ├── postgres/
    │   ├── Chart.yaml
    │   ├── values.yaml
    │   └── templates/
    │       ├── statefulset.yaml
    │       ├── service.yaml
    │       ├── pvc.yaml
    │       └── secret.yaml
    ├── temple-api/
    │   ├── Chart.yaml
    │   ├── values.yaml
    │   └── templates/
    │       ├── deployment.yaml
    │       ├── service.yaml
    │       ├── configmap.yaml
    │       └── secret.yaml
    └── temple-ui/
        ├── Chart.yaml
        ├── values.yaml
        └── templates/
            ├── deployment.yaml
            ├── service.yaml
            └── ingress.yaml
```

## 🛠️ Building the Chart

### Step 1: Create Umbrella Chart

```bash
cd /path/to/learning-path/level3/iterations/3.5-umbrella-chart/solution

# Create main chart
mkdir -p temple-stack/charts
cd temple-stack

cat > Chart.yaml << EOF
apiVersion: v2
name: temple-stack
description: Complete temple management application stack
type: application
version: 1.0.0
appVersion: "1.0"
dependencies:
  - name: postgres
    version: "1.0.0"
    condition: postgres.enabled
  - name: temple-api
    version: "1.0.0"
    condition: temple-api.enabled
  - name: temple-ui
    version: "1.0.0"
    condition: temple-ui.enabled
EOF
```

### Step 2: Create values.yaml

```yaml
global:
  environment: development
  namespace: temple-stack

postgres:
  enabled: true
  persistence:
    size: 2Gi
  auth:
    username: templeadmin
    password: temple123
    database: templedb

temple-api:
  enabled: true
  replicas: 2
  image:
    repository: temple-api
    tag: "1.0"
  database:
    host: postgres-service
    port: 5432

temple-ui:
  enabled: true
  replicas: 2
  image:
    repository: temple-ui
    tag: "1.1"
  api:
    url: http://temple-api-service:1337

ingress:
  enabled: true
  host: temple.local
  className: nginx
```

### Step 3: Create Sub-charts

Reference the complete structure in `./solution/temple-stack/`.

Each sub-chart contains:
- Chart.yaml
- values.yaml  
- templates/ (deployment, service, etc.)

### Step 4: Deploy

```bash
# Lint
helm lint ./temple-stack

# Template
helm template temple ./temple-stack

# Install (development)
helm install temple ./temple-stack \
  -f values-dev.yaml \
  -n temple-dev \
  --create-namespace

# Install (production)
helm install temple ./temple-stack \
  -f values-prod.yaml \
  -n temple-prod \
  --create-namespace

# Upgrade
helm upgrade temple ./temple-stack \
  --set temple-api.replicas=5 \
  -n temple-dev

# Rollback
helm rollback temple -n temple-dev
```

## ✅ Validation

```bash
# All components deployed
kubectl get all -n temple-dev

# Postgres running
kubectl get statefulset -n temple-dev

# API and UI running
kubectl get deployment -n temple-dev

# Services accessible
kubectl get svc -n temple-dev

# Ingress configured
kubectl get ingress -n temple-dev

# Test application
kubectl port-forward svc/temple-ui-service 8080:80 -n temple-dev
curl http://localhost:8080
```

## 📚 Key Takeaways

- 📌 **Umbrella charts** package multiple sub-charts
- 📌 **Global values** share config across charts
- 📌 **Conditional deployment** with `enabled` flags
- 📌 **Environment values** files for dev/staging/prod
- 📌 Charts are **reusable** and **version-controlled**

## 🎉 Level 3 Complete!

**Congratulations!** You've mastered Helm:
- ✅ Created charts from scratch
- ✅ Mastered templating
- ✅ Managed dependencies
- ✅ Built production umbrella chart

**Next**: [Level 4: GitOps with ArgoCD →](../../level4/README.md)

Automate deployments with GitOps!

---

**Reference**: Compare your work with `/devops/temple-stack/` for production implementation.
