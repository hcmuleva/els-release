# 🌱 Level 1: Kubernetes Basics

**Welcome to Level 1!** This is where your Kubernetes journey begins.

## 🎯 Level Goal

Deploy and manage a single containerized application on Kubernetes using core primitives.

## 📚 What You'll Learn

By the end of this level, you will understand and be able to use:

- ✅ **Pods** - The smallest deployable units in Kubernetes
- ✅ **Deployments** - Managing replicated applications
- ✅ **ReplicaSets** - Ensuring desired number of pods
- ✅ **Services** - Exposing applications on the network
- ✅ **kubectl** - The Kubernetes command-line tool
- ✅ **Health Checks** - Liveness and readiness probes
- ✅ **Resource Limits** - CPU and memory management
- ✅ **Labels & Selectors** - Organizing and selecting resources

## 🎓 Prerequisites

Before starting Level 1, ensure you have:

- [x] Docker Desktop with Kubernetes enabled (or Minikube)
- [x] kubectl installed and configured
- [x] Basic command-line skills
- [x] Understanding of containers and Docker basics

**Not ready?** See [PREREQUISITES.md](../PREREQUISITES.md)

## 📖 Learning Structure

### Iterations Overview

This level has 4 iterations, each building on the previous:

| Iteration | Topic | Time | Difficulty |
|-----------|-------|------|------------|
| [1.1](./iterations/1.1-pod/) | Deploy a Simple Pod | 1h | ⭐ |
| [1.2](./iterations/1.2-deployment/) | Create a Deployment | 1-2h | ⭐⭐ |
| [1.3](./iterations/1.3-service/) | Expose with a Service | 1-2h | ⭐⭐ |
| [1.4](./iterations/1.4-health-checks/) | Add Health Checks & Resources | 2h | ⭐⭐⭐ |

**Total Time**: 4-6 hours

## 🗺️ Learning Path

```
Start Here
    ↓
[1.1] Pod            → Learn the basic unit
    ↓
[1.2] Deployment     → Add replication & updates
    ↓
[1.3] Service        → Enable networking
    ↓
[1.4] Health Checks  → Production readiness
    ↓
Level 1 Complete! 🎉
```

## 📂 Directory Structure

```
level1/
├── README.md (this file)
├── iterations/
│   ├── 1.1-pod/
│   │   ├── README.md
│   │   ├── exercise.md
│   │   └── solution/
│   ├── 1.2-deployment/
│   │   ├── README.md
│   │   ├── exercise.md
│   │   └── solution/
│   ├── 1.3-service/
│   │   ├── README.md
│   │   ├── exercise.md
│   │   └── solution/
│   └── 1.4-health-checks/
│       ├── README.md
│       ├── exercise.md
│       └── solution/
├── resources/
│   ├── kubectl-cheatsheet.md
│   ├── pod-lifecycle.md
│   └── troubleshooting.md
└── final-project/
    └── README.md
```

## 🚀 Getting Started

### 1. Verify Your Setup

```bash
# Check kubectl is configured
kubectl version --client
kubectl cluster-info

# Check cluster nodes
kubectl get nodes

# Expected output: Ready node(s)
```

### 2. Create a Namespace

We'll use a dedicated namespace for Level 1:

```bash
# Create namespace
kubectl create namespace level1-tutorial

# Set as default
kubectl config set-context --current --namespace=level1-tutorial

# Verify
kubectl config view --minify | grep namespace:
```

### 3. Start with Iteration 1.1

Begin your journey here: [Iteration 1.1: Deploy a Simple Pod](./iterations/1.1-pod/README.md)

## 📝 Iterations Deep Dive

### Iteration 1.1: Deploy a Simple Pod

**Learn**: What is a Pod and how to create one

**Tasks**:
- Create a Pod manifest
- Deploy using kubectl
- View logs and describe Pod
- Access the application
- Delete the Pod

**Key Concepts**:
- Pod definition (YAML)
- Container specification
- Pod lifecycle
- Basic kubectl commands

**Deliverable**: Running Pod with nginx

---

### Iteration 1.2: Create a Deployment

**Learn**: Replication and rolling updates

**Tasks**:
- Convert Pod to Deployment
- Scale replicas
- Update image version
- Rollback deployment
- View deployment history

**Key Concepts**:
- Deployment controller
- ReplicaSets
- Rolling updates
- Rollback strategies
- Scaling

**Deliverable**: Deployment with 3 replicas

---

### Iteration 1.3: Expose with a Service

**Learn**: Kubernetes networking and Service discovery

**Tasks**:
- Create ClusterIP Service
- Create NodePort Service
- Test service connectivity
- Understand service endpoints
- Use DNS for discovery

**Key Concepts**:
- Service types (ClusterIP, NodePort, LoadBalancer)
- Label selectors
- Service endpoints
- DNS in Kubernetes
- Port forwarding

**Deliverable**: Accessible service via NodePort

---

### Iteration 1.4: Add Health Checks & Resources

**Learn**: Production readiness and resource management

**Tasks**:
- Add liveness probe
- Add readiness probe
- Set resource requests
- Set resource limits
- Test probe failures

**Key Concepts**:
- Liveness vs Readiness probes
- Resource requests vs limits
- QoS classes
- Container restart policies
- Probe configuration

**Deliverable**: Production-ready deployment with health checks

---

## 🎯 Learning Outcomes

After completing Level 1, you will be able to:

- ✅ Create and manage Pods
- ✅ Deploy applications with Deployments
- ✅ Expose applications with Services
- ✅ Configure health checks
- ✅ Manage resources
- ✅ Use kubectl effectively
- ✅ Debug basic issues
- ✅ Understand Kubernetes architecture basics

## ✅ Validation

To validate your Level 1 completion, you should be able to:

### Quick Quiz

1. What is the smallest deployable unit in Kubernetes?
2. What's the difference between a Pod and a Deployment?
3. Name three types of Services
4. What's the difference between liveness and readiness probes?
5. What does `kubectl apply -f` do?

### Practical Validation

Run this validation script:

```bash
# Check you have a working deployment
kubectl get deployment -n level1-tutorial
# Should show: deployment with 3 replicas running

# Check service
kubectl get service -n level1-tutorial
# Should show: service with endpoints

# Check pods are healthy
kubectl get pods -n level1-tutorial
# All pods should be Running with Ready status

# Check resource limits
kubectl describe pod -n level1-tutorial | grep -A 5 "Limits"
# Should show CPU and memory limits
```

If all checks pass, you're ready for Level 2! 🎉

## 📚 Additional Resources

### Cheat Sheets
- [kubectl Cheat Sheet](./resources/kubectl-cheatsheet.md)
- [Pod Lifecycle](./resources/pod-lifecycle.md)
- [Common Troubleshooting](./resources/troubleshooting.md)

### Official Documentation
- [Kubernetes Pods](https://kubernetes.io/docs/concepts/workloads/pods/)
- [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Services](https://kubernetes.io/docs/concepts/services-networking/service/)
- [kubectl Commands](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

### Video Tutorials
- [Kubernetes Basics - Official](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [Pods Explained](https://www.youtube.com/watch?v=5cNrTU6o3Fw)

## 🏆 Final Project

Ready for a challenge? Try the [Level 1 Final Project](./final-project/README.md)

**Project**: Deploy a complete web application with:
- Frontend (3 replicas)
- Health checks configured
- Service exposure
- Resource limits
- Monitoring commands

## 🐛 Troubleshooting

### Common Issues

**Pods not starting?**
```bash
kubectl describe pod <pod-name> -n level1-tutorial
kubectl logs <pod-name> -n level1-tutorial
```

**Service not accessible?**
```bash
kubectl get endpoints <service-name> -n level1-tutorial
kubectl describe service <service-name> -n level1-tutorial
```

**Image pull errors?**
```bash
# Check if image exists
docker pull <image-name>

# Check pod events
kubectl get events -n level1-tutorial --sort-by='.lastTimestamp'
```

See [Troubleshooting Guide](./resources/troubleshooting.md) for more help.

## 🎯 Next Steps

### Completed Level 1?

Congratulations! 🎉 You now understand Kubernetes basics.

**Ready for Level 2?** → [Level 2: Multi-Service Deployment](../level2/README.md)

In Level 2, you'll learn to:
- Deploy multiple connected services
- Use ConfigMaps and Secrets
- Set up persistent storage
- Configure Ingress

---

**Questions?** Check the resources section or refer to official Kubernetes documentation.

**Happy Learning!** 🚀
