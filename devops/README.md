# 🎓 Temple Stack - Progressive Learning Path

Welcome to the Temple Stack Progressive Learning Path! This comprehensive curriculum will take you from Kubernetes basics to production-grade deployments.

## 🎯 Learning Journey Overview

This learning path is designed as a **progressive skill-building journey** where each level builds upon the previous one. You'll work with the same application (Temple Stack: UI + API + Database) throughout, gradually increasing complexity and best practices.

```
Level 1 (Beginner)     → Kubernetes Basics
    ↓
Level 2 (Intermediate) → Multi-Service Orchestration  
    ↓
Level 3 (Advanced)     → Helm Chart Packaging
    ↓
Level 4 (Expert)       → GitOps with ArgoCD
    ↓
Level 5 (Master)       → Production-Grade Features
```

## 📚 Level Breakdown

### [Level 1: Kubernetes Basics](./level1/README.md) 🌱
**Goal**: Deploy and manage a single application on Kubernetes

**Prerequisites**: 
- Docker basics
- Basic command line skills
- Access to a Kubernetes cluster (Docker Desktop, Minikube, or Kind)

**What You'll Learn**:
- Pods, Deployments, and ReplicaSets
- Services and networking
- Basic kubectl commands
- Container logs and debugging

**Iterations**:
1. Deploy a simple Pod
2. Create a Deployment with replicas
3. Expose with a Service
4. Add health checks and resource limits

**Time Estimate**: 4-6 hours

**Deliverable**: A running single-service application accessible via Service

---

### [Level 2: Multi-Service Deployment](./level2/README.md) 🌿
**Goal**: Deploy and connect multiple services (UI + API + Database)

**Prerequisites**: 
- Completed Level 1
- Understanding of how web applications work

**What You'll Learn**:
- Service discovery and DNS
- ConfigMaps for configuration
- Secrets for sensitive data
- Persistent storage with PVCs
- Multi-container deployments

**Iterations**:
1. Deploy PostgreSQL with persistent storage
2. Deploy API server with database connection
3. Deploy UI connecting to API
4. Configure with ConfigMaps
5. Secure with Secrets
6. Add Ingress for external access

**Time Estimate**: 8-10 hours

**Deliverable**: Full 3-tier application (UI + API + DB) running on Kubernetes

---

### [Level 3: Helm Chart Packaging](./level3/README.md) 🚀
**Goal**: Package applications as reusable Helm charts

**Prerequisites**: 
- Completed Level 2
- Understanding of templates and parameterization

**What You'll Learn**:
- Helm chart structure
- Templating with Go templates
- Values files and overrides
- Chart dependencies
- Sub-charts and umbrella charts
- Chart versioning and repositories

**Iterations**:
1. Create a simple Helm chart
2. Add templating and values
3. Create sub-charts for each service
4. Build an umbrella chart
5. Manage dependencies
6. Package and deploy

**Time Estimate**: 10-12 hours

**Deliverable**: Reusable Helm umbrella chart for Temple Stack

---

### [Level 4: GitOps with ArgoCD](./level4/README.md) 🔄
**Goal**: Implement GitOps workflows for automated deployments

**Prerequisites**: 
- Completed Level 3
- Basic Git knowledge
- Understanding of CI/CD concepts

**What You'll Learn**:
- GitOps principles
- ArgoCD installation and configuration
- Application definitions
- Sync policies and strategies
- Multi-environment management
- Automated deployments
- Rollback strategies

**Iterations**:
1. Install and configure ArgoCD
2. Create Application CRDs
3. Implement sync policies
4. Set up multi-environment (dev/staging/prod)
5. Implement automated sync
6. Configure RBAC and access control

**Time Estimate**: 12-15 hours

**Deliverable**: Fully automated GitOps deployment pipeline

---

### [Level 5: Production-Grade Features](./level5/README.md) 🏆
**Goal**: Implement enterprise-grade production features

**Prerequisites**: 
- Completed Level 4
- Understanding of security and operational concerns
- Production environment experience (helpful)

**What You'll Learn**:
- **Security**: Vault, RBAC, Network Policies, Pod Security
- **Scaling**: HPA, VPA, Cluster Autoscaler
- **Observability**: Prometheus, Grafana, Logging
- **Resilience**: Chaos Engineering, Disaster Recovery
- **Service Mesh**: Istio for advanced traffic management
- **Backup & Recovery**: Velero, database backups
- **Cost Optimization**: Resource management

**Iterations**:
1. **Secrets Management** - HashiCorp Vault integration
2. **Autoscaling** - HPA and VPA implementation
3. **Monitoring** - Prometheus + Grafana stack
4. **Logging** - ELK or Loki stack
5. **Service Mesh** - Istio deployment
6. **Security Hardening** - RBAC, Network Policies, Pod Security
7. **Backup & DR** - Velero and database backups
8. **Chaos Engineering** - Chaos Mesh implementation
9. **Performance Testing** - Load testing and optimization
10. **Cost Management** - Resource optimization

**Time Estimate**: 40-50 hours

**Deliverable**: Production-ready, secure, scalable, and observable deployment

---

## 🗂️ Directory Structure

```
learning-path/
├── README.md (this file)
├── LEARNING_GUIDE.md (how to use this path)
├── PREREQUISITES.md (tools and setup)
│
├── level1/
│   ├── README.md (level overview)
│   ├── iterations/
│   │   ├── 1.1-pod/
│   │   ├── 1.2-deployment/
│   │   ├── 1.3-service/
│   │   └── 1.4-health-checks/
│   ├── solutions/ (working examples)
│   ├── exercises/ (hands-on tasks)
│   └── resources/ (cheat sheets, docs)
│
├── level2/
│   ├── README.md
│   ├── iterations/
│   │   ├── 2.1-database/
│   │   ├── 2.2-api/
│   │   ├── 2.3-ui/
│   │   ├── 2.4-configmaps/
│   │   ├── 2.5-secrets/
│   │   └── 2.6-ingress/
│   ├── solutions/
│   ├── exercises/
│   └── resources/
│
├── level3/
│   ├── README.md
│   ├── iterations/
│   │   ├── 3.1-simple-chart/
│   │   ├── 3.2-templating/
│   │   ├── 3.3-sub-charts/
│   │   ├── 3.4-umbrella-chart/
│   │   ├── 3.5-dependencies/
│   │   └── 3.6-packaging/
│   ├── solutions/
│   ├── exercises/
│   └── resources/
│
├── level4/
│   ├── README.md
│   ├── iterations/
│   │   ├── 4.1-argocd-install/
│   │   ├── 4.2-application-crd/
│   │   ├── 4.3-sync-policies/
│   │   ├── 4.4-multi-env/
│   │   ├── 4.5-automation/
│   │   └── 4.6-rbac/
│   ├── solutions/
│   ├── exercises/
│   └── resources/
│
└── level5/
    ├── README.md
    ├── iterations/
    │   ├── 5.1-vault/
    │   ├── 5.2-hpa/
    │   ├── 5.3-monitoring/
    │   ├── 5.4-logging/
    │   ├── 5.5-service-mesh/
    │   ├── 5.6-security/
    │   ├── 5.7-backup-dr/
    │   ├── 5.8-chaos-engineering/
    │   ├── 5.9-performance/
    │   └── 5.10-cost-optimization/
    ├── solutions/
    ├── exercises/
    └── resources/
```

## 🎯 How to Use This Learning Path

### 1. **Start at Your Level**
- **New to Kubernetes?** → Start at Level 1
- **Know Kubernetes basics?** → Start at Level 2
- **Comfortable with K8s?** → Start at Level 3
- **Know Helm?** → Start at Level 4
- **Ready for production?** → Jump to Level 5

### 2. **Follow the Iterations**
Each level has numbered iterations. Complete them in order for the best learning experience.

### 3. **Hands-On Practice**
- Read the iteration README
- Try the exercises yourself first
- Check the solutions if stuck
- Validate your work with provided tests

### 4. **Use the Resources**
Each level includes:
- 📘 **Cheat sheets** - Quick reference guides
- 📝 **Documentation links** - Official docs
- 🎥 **Video tutorials** - Visual learners
- 💡 **Best practices** - Industry standards

### 5. **Validate Your Learning**
Each iteration includes:
- ✅ **Validation criteria** - Know when you're done
- 🧪 **Tests** - Automated verification
- 🏆 **Challenges** - Extra credit tasks

## 🛠️ Required Tools

### Core Tools (All Levels)
- Docker Desktop (with Kubernetes enabled) or Minikube
- kubectl
- Git
- Text editor (VS Code recommended)

### Level 3+
- Helm 3.x

### Level 4+
- ArgoCD CLI
- GitHub/GitLab account

### Level 5
- Various tools per iteration (documented in each)

See [PREREQUISITES.md](./PREREQUISITES.md) for detailed setup instructions.

## 📊 Progress Tracking

Track your progress:
- [ ] Level 1 Complete
- [ ] Level 2 Complete
- [ ] Level 3 Complete
- [ ] Level 4 Complete
- [ ] Level 5 Complete

## 🎓 Learning Outcomes

By completing this path, you will be able to:

✅ Deploy and manage applications on Kubernetes  
✅ Implement multi-service architectures  
✅ Package applications with Helm charts  
✅ Implement GitOps workflows with ArgoCD  
✅ Build production-grade, secure, and scalable systems  
✅ Monitor, log, and debug distributed applications  
✅ Implement chaos engineering and resilience testing  
✅ Manage secrets securely with Vault  
✅ Implement service mesh for advanced networking  
✅ Optimize costs and performance  

## 🤝 Contributing

Found an issue? Have a suggestion? Contributions are welcome!

## 📞 Support

- **Issues**: Check the exercises/solutions
- **Questions**: Review the resources section
- **Stuck?**: Each iteration has troubleshooting guides

## 📜 License

This learning path is provided as-is for educational purposes.

---

**Ready to begin?** Start with [Level 1: Kubernetes Basics](./level1/README.md) 🚀

**Already experienced?** Jump to your appropriate level using the guide above.

**Good luck on your learning journey!** 🎉
