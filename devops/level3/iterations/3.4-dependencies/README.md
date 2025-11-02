# Iteration 3.4: Dependencies and Sub-charts

**Duration**: ~2-2.5 hours  
**Difficulty**: ⭐⭐⭐⭐ Advanced

## 🎯 Learning Objectives

- ✅ Add chart dependencies
- ✅ Create sub-charts
- ✅ Pass values to dependencies
- ✅ Use conditional dependencies
- ✅ Manage chart versions

## 📚 Chart Dependencies

### Define Dependencies in Chart.yaml

```yaml
apiVersion: v2
name: myapp
version: 1.0.0
dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
  - name: redis
    version: "17.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: redis.enabled
```

### Install Dependencies

```bash
# Download dependencies
helm dependency update ./myapp

# This creates:
# - charts/postgresql-12.x.x.tgz
# - charts/redis-17.x.x.tgz
# - Chart.lock

# View dependencies
helm dependency list ./myapp
```

## 🛠️ Passing Values to Dependencies

**values.yaml**:
```yaml
# Enable/disable dependencies
postgresql:
  enabled: true
  auth:
    username: myapp
    password: secret123
    database: myappdb
  primary:
    persistence:
      size: 2Gi

redis:
  enabled: true
  auth:
    enabled: false
  master:
    persistence:
      enabled: false

# Your app configuration
app:
  database:
    host: myapp-postgresql  # Service name
    port: 5432
  cache:
    host: myapp-redis-master
    port: 6379
```

## 🏗️ Sub-charts (charts/ directory)

Create a sub-chart:

```bash
cd myapp/charts
helm create backend
helm create frontend
```

**Parent values passing**:

```yaml
# myapp/values.yaml
global:
  image:
    registry: docker.io
  environment: production

backend:
  replicas: 2
  database:
    host: postgres

frontend:
  replicas: 3
```

**Sub-chart access**:

```yaml
# backend/templates/deployment.yaml
image: {{ .Values.global.image.registry }}/backend:latest
replicas: {{ .Values.replicas }}
env:
- name: DB_HOST
  value: {{ .Values.database.host }}
```

## 🎯 Temple Stack Example

**temple-stack/Chart.yaml**:
```yaml
apiVersion: v2
name: temple-stack
description: Complete temple management application
version: 1.0.0
dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
```

**temple-stack/values.yaml**:
```yaml
global:
  environment: development

postgresql:
  enabled: true
  auth:
    username: templeadmin
    password: temple123
    database: templedb

temple-api:
  enabled: true
  replicas: 2
  database:
    host: temple-stack-postgresql

temple-ui:
  enabled: true
  replicas: 2
```

## ✅ Validation

```bash
# Update dependencies
helm dependency update ./temple-stack

# Check dependencies
helm dependency list ./temple-stack

# Install with all dependencies
helm install temple ./temple-stack -n level3

# Disable a dependency
helm install temple ./temple-stack \
  --set postgresql.enabled=false \
  -n level3
```

## 🎯 Next Steps

**Next**: [Iteration 3.5: Umbrella Chart (Temple Stack)](../3.5-umbrella-chart/README.md)

Create the complete temple-stack umbrella chart matching `/devops/temple-stack/`.
