# ELS-LMS Helm Chart

## 🚀 Quick Start

### Using Helm Directly

**Deploy Client:**
```bash
make install-client CLIENT_NAME=temple
```

**Deploy Server:**
```bash
make install-server
```

### Using ArgoCD

**Deploy Client via ArgoCD:**
```bash
kubectl apply -f argocd/client-application.yaml
```

**Deploy Server via ArgoCD:**
```bash
kubectl apply -f argocd/server-application.yaml
```

## 📦 What's Included

- **PostgreSQL 15** - Database
- **ELS-LMS API** - Strapi backend
- **ELS-LMS UI** - React frontend

## 🔧 Configuration

### Client Deployment
- Image: `harishdell/els-lmclient:1.1`
- Database: Local PostgreSQL (5Gi)
- Replicas: 1 API + 1 UI

### Server Deployment
- Image: `harishdell/els-lmsserver:1.0`
- Database: Centralized PostgreSQL (50Gi)
- Replicas: 3 API + 2 UI

## 📊 Common Commands

```bash
# Update dependencies
make deps

# Check status
make status NAMESPACE=temple

# Upgrade deployment
make upgrade-client CLIENT_NAME=temple

# Uninstall
make uninstall-client CLIENT_NAME=temple
```

## 🔗 Access

After deployment, add to `/etc/hosts`:

**Client:**
```
127.0.0.1 temple.local temple-api.local
```

**Server:**
```
127.0.0.1 els-lms-server.local els-lms-server-ui.local
```

## 📚 Documentation

See individual files:
- `values-client.yaml` - Client configuration
- `values-server.yaml` - Server configuration
- `argocd/` - ArgoCD manifests
