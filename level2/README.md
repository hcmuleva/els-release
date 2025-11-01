# 🌿 Level 2: Multi-Service Deployment

**Welcome to Level 2!** Now you'll deploy a complete 3-tier application stack.

## 🎯 Level Goal

Deploy and connect multiple services (UI + API + Database) on Kubernetes using ConfigMaps, Secrets, and persistent storage.

## 📚 What You'll Learn

By the end of this level, you will understand and be able to use:

- ✅ **Multi-service architecture** - UI, API, and Database
- ✅ **ConfigMaps** - Externalizing configuration
- ✅ **Secrets** - Managing sensitive data
- ✅ **Persistent Volumes** - Data that survives Pod restarts
- ✅ **Service Discovery** - How services find each other
- ✅ **Ingress** - Exposing applications externally
- ✅ **Environment Variables** - Configuring containers
- ✅ **Init Containers** - Initialization logic

## 🎓 Prerequisites

Before starting Level 2, ensure you have:

- [x] Completed Level 1
- [x] Understanding of Pods, Deployments, and Services
- [x] kubectl proficiency
- [x] Basic understanding of databases and APIs

## 🏗️ Application Architecture

### Temple Stack

We'll deploy a real-world 3-tier application:

```
┌─────────────────┐
│   Temple UI     │  ← React Frontend (Port 80)
│  (Web Browser)  │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐
│   Temple API    │  ← Strapi Backend (Port 1337)
│  (REST API)     │
└────────┬────────┘
         │ PostgreSQL Protocol
         ↓
┌─────────────────┐
│   PostgreSQL    │  ← Database (Port 5432)
│   (Database)    │
└─────────────────┘
```

**Components**:
1. **PostgreSQL** - Database for storing data
2. **Temple API** - Strapi CMS providing REST API
3. **Temple UI** - React application (web interface)

## 📖 Learning Structure

### Iterations Overview

| Iteration | Topic | Time | Difficulty |
|-----------|-------|------|------------|
| [2.1](./iterations/2.1-database/) | Deploy PostgreSQL with Storage | 2h | ⭐⭐ |
| [2.2](./iterations/2.2-api/) | Deploy Temple API | 2h | ⭐⭐ |
| [2.3](./iterations/2.3-ui/) | Deploy Temple UI | 1-2h | ⭐⭐ |
| [2.4](./iterations/2.4-configmaps/) | Use ConfigMaps | 1h | ⭐⭐ |
| [2.5](./iterations/2.5-secrets/) | Secure with Secrets | 1-2h | ⭐⭐⭐ |
| [2.6](./iterations/2.6-ingress/) | Expose with Ingress | 2h | ⭐⭐⭐ |

**Total Time**: 8-12 hours

## 🗺️ Learning Path

```
Start Here (Level 1 Complete)
    ↓
[2.1] PostgreSQL     → Database with persistence
    ↓
[2.2] Temple API     → Backend connecting to DB
    ↓
[2.3] Temple UI      → Frontend connecting to API
    ↓
[2.4] ConfigMaps     → Externalize configuration
    ↓
[2.5] Secrets        → Secure sensitive data
    ↓
[2.6] Ingress        → External access
    ↓
Level 2 Complete! 🎉
```

## 🚀 Getting Started

### 1. Create Namespace

```bash
kubectl create namespace level2-temple-stack
kubectl config set-context --current --namespace=level2-temple-stack
```

### 2. Verify Prerequisites

```bash
# Check cluster
kubectl cluster-info

# Check storage class (for PVCs)
kubectl get storageclass

# Should see: hostpath or similar (Docker Desktop)
# Should see: standard (Minikube)
```

### 3. Start with Iteration 2.1

Begin here: [Iteration 2.1: Deploy PostgreSQL](./iterations/2.1-database/README.md)

## 📝 Iterations Deep Dive

### Iteration 2.1: Deploy PostgreSQL with Persistent Storage

**Learn**: StatefulSets, PVCs, and data persistence

**Tasks**:
- Create PersistentVolumeClaim
- Deploy PostgreSQL StatefulSet
- Configure database credentials
- Test database connectivity
- Verify data persists after Pod restart

**Key Concepts**:
- StatefulSets vs Deployments
- PersistentVolumes and PersistentVolumeClaims
- Storage Classes
- Data persistence

**Deliverable**: Running PostgreSQL with persistent storage

---

### Iteration 2.2: Deploy Temple API

**Learn**: Multi-container communication and environment variables

**Tasks**:
- Deploy Strapi API
- Configure database connection
- Use environment variables
- Create ClusterIP Service
- Test API endpoints

**Key Concepts**:
- Service discovery via DNS
- Environment-based configuration
- Container-to-container communication
- API deployment patterns

**Deliverable**: Temple API connected to PostgreSQL

---

### Iteration 2.3: Deploy Temple UI

**Learn**: Frontend deployment and service connectivity

**Tasks**:
- Deploy React UI application
- Configure API URL
- Create Service
- Test UI functionality
- Verify end-to-end flow

**Key Concepts**:
- Frontend/backend separation
- Static file serving
- Service endpoints
- Full-stack connectivity

**Deliverable**: Complete 3-tier application running

---

### Iteration 2.4: Use ConfigMaps

**Learn**: Externalizing configuration

**Tasks**:
- Create ConfigMaps for each service
- Move configuration out of Deployments
- Use ConfigMaps as environment variables
- Use ConfigMaps as mounted files
- Update configuration without rebuilding

**Key Concepts**:
- ConfigMaps vs hardcoded config
- Environment variables from ConfigMaps
- Volume mounts from ConfigMaps
- Configuration management

**Deliverable**: Configuration externalized in ConfigMaps

---

### Iteration 2.5: Secure with Secrets

**Learn**: Managing sensitive data securely

**Tasks**:
- Create Secrets for database credentials
- Create Secrets for API keys
- Reference Secrets in Deployments
- Encode/decode secret values
- Best practices for secrets

**Key Concepts**:
- Secrets vs ConfigMaps
- Base64 encoding
- Secret references
- Security best practices
- Kubernetes RBAC (intro)

**Deliverable**: Sensitive data stored in Secrets

---

### Iteration 2.6: Expose with Ingress

**Learn**: External access and routing

**Tasks**:
- Install NGINX Ingress Controller
- Create Ingress resource
- Configure host-based routing
- Add TLS (optional)
- Test external access

**Key Concepts**:
- Ingress vs Service
- Ingress Controllers
- Host-based routing
- Path-based routing
- TLS termination

**Deliverable**: Application accessible via domain name

---

## 🎯 Learning Outcomes

After completing Level 2, you will be able to:

- ✅ Deploy multi-tier applications
- ✅ Configure persistent storage
- ✅ Manage configuration with ConfigMaps
- ✅ Secure sensitive data with Secrets
- ✅ Enable service-to-service communication
- ✅ Expose applications with Ingress
- ✅ Understand full-stack Kubernetes deployments
- ✅ Debug multi-service issues

## ✅ Validation

To validate your Level 2 completion:

### Quick Quiz

1. What's the difference between a ConfigMap and a Secret?
2. Why use a StatefulSet for databases instead of a Deployment?
3. How do services discover each other in Kubernetes?
4. What's the purpose of an Ingress Controller?
5. How do PVCs ensure data persistence?

### Practical Validation

```bash
# Check all components running
kubectl get all -n level2-temple-stack

# Should see:
# - PostgreSQL StatefulSet (1/1)
# - Temple API Deployment (2/2 replicas)
# - Temple UI Deployment (1/1)
# - Services for each
# - PVC for PostgreSQL

# Test connectivity
kubectl exec -it <temple-api-pod> -- curl http://postgres-service:5432
# Should show database is accessible

# Check Ingress
kubectl get ingress -n level2-temple-stack
# Should show configured hosts

# Access application
curl http://temple-ui.local  # or configured domain
```

## 📚 Additional Resources

### Documentation
- [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
- [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
- [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)

### Best Practices
- [Configuration Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [Security Best Practices](https://kubernetes.io/docs/concepts/security/overview/)

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
kubectl get pods -l app=postgres

# Check service endpoints
kubectl get endpoints postgres-service

# Test from API pod
kubectl exec -it <api-pod> -- nc -zv postgres-service 5432
```

### PVC Not Binding

```bash
# Check PVC status
kubectl get pvc

# Describe for events
kubectl describe pvc postgres-pvc

# Check storage class
kubectl get storageclass
```

### Service Discovery Failing

```bash
# Test DNS resolution
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup postgres-service

# Check service exists
kubectl get svc postgres-service
```

See [Level 2 Troubleshooting Guide](./resources/troubleshooting.md) for more.

## 🎯 Next Steps

### Completed Level 2?

Excellent! 🎉 You can now deploy and manage multi-service applications.

**Ready for Level 3?** → [Level 3: Helm Packaging](../level3/README.md)

In Level 3, you'll learn to:
- Package applications as Helm charts
- Use templates and values
- Create reusable charts
- Manage dependencies
- Build umbrella charts

---

**Real-World Application**: What you learned in Level 2 is exactly how production applications run on Kubernetes - multiple services working together with proper configuration and secrets management.

**Keep learning!** 🚀
