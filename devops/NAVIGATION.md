# 🗺️ Quick Navigation - Temple Stack Learning Path

## 🚀 Start Here

**New to this learning path?**  
→ Read [README.md](./README.md) for the complete overview

**Need to set up tools?**  
→ Follow [PREREQUISITES.md](./PREREQUISITES.md)

**Want learning tips?**  
→ Check [LEARNING_GUIDE.md](./LEARNING_GUIDE.md)

---

## 📚 Level Navigation

### [🌱 Level 1: Kubernetes Basics](./level1/README.md)
**Goal**: Deploy and manage a single application  
**Time**: 4-6 hours | **Difficulty**: ⭐ Beginner

**Iterations**:
- [1.1 - Deploy a Simple Pod](./level1/iterations/1.1-pod/README.md) ⭐
- [1.2 - Create a Deployment](./level1/iterations/1.2-deployment/) ⭐⭐
- [1.3 - Expose with a Service](./level1/iterations/1.3-service/) ⭐⭐
- [1.4 - Add Health Checks & Resources](./level1/iterations/1.4-health-checks/) ⭐⭐⭐

---

### [🌿 Level 2: Multi-Service Deployment](./level2/README.md)
**Goal**: Deploy connected services (UI + API + Database)  
**Time**: 8-12 hours | **Difficulty**: ⭐⭐ Intermediate

**Iterations**:
- [2.1 - Deploy PostgreSQL with Storage](./level2/iterations/2.1-database/) ⭐⭐
- [2.2 - Deploy Temple API](./level2/iterations/2.2-api/) ⭐⭐
- [2.3 - Deploy Temple UI](./level2/iterations/2.3-ui/) ⭐⭐
- [2.4 - Use ConfigMaps](./level2/iterations/2.4-configmaps/) ⭐⭐
- [2.5 - Secure with Secrets](./level2/iterations/2.5-secrets/) ⭐⭐⭐
- [2.6 - Expose with Ingress](./level2/iterations/2.6-ingress/) ⭐⭐⭐

---

### [🚀 Level 3: Helm Chart Packaging](./level3/)
**Goal**: Package applications as reusable Helm charts  
**Time**: 10-12 hours | **Difficulty**: ⭐⭐⭐ Advanced

**Iterations**:
- 3.1 - Create a Simple Chart
- 3.2 - Add Templating and Values
- 3.3 - Create Sub-Charts
- 3.4 - Build Umbrella Chart
- 3.5 - Manage Dependencies
- 3.6 - Package and Deploy

---

### [🔄 Level 4: GitOps with ArgoCD](./level4/)
**Goal**: Implement GitOps workflows  
**Time**: 12-15 hours | **Difficulty**: ⭐⭐⭐⭐ Expert

**Iterations**:
- 4.1 - Install and Configure ArgoCD
- 4.2 - Create Application CRDs
- 4.3 - Implement Sync Policies
- 4.4 - Set Up Multi-Environment
- 4.5 - Automated Deployments
- 4.6 - Configure RBAC

---

### [🏆 Level 5: Production-Grade Features](./level5/README.md)
**Goal**: Enterprise-grade production deployment  
**Time**: 40-50 hours | **Difficulty**: ⭐⭐⭐⭐⭐ Master

**Iterations**:
- [5.1 - HashiCorp Vault Integration](./level5/iterations/5.1-vault/) ⭐⭐⭐⭐
- [5.2 - Horizontal Pod Autoscaler](./level5/iterations/5.2-hpa/) ⭐⭐⭐
- [5.3 - Prometheus + Grafana Monitoring](./level5/iterations/5.3-monitoring/) ⭐⭐⭐⭐
- [5.4 - Loki Logging Stack](./level5/iterations/5.4-logging/) ⭐⭐⭐⭐
- [5.5 - Istio Service Mesh](./level5/iterations/5.5-service-mesh/) ⭐⭐⭐⭐⭐
- [5.6 - Security Hardening](./level5/iterations/5.6-security/) ⭐⭐⭐⭐
- [5.7 - Backup & Disaster Recovery](./level5/iterations/5.7-backup-dr/) ⭐⭐⭐⭐
- [5.8 - Chaos Engineering](./level5/iterations/5.8-chaos/) ⭐⭐⭐⭐⭐
- [5.9 - Performance Testing](./level5/iterations/5.9-performance/) ⭐⭐⭐
- [5.10 - Cost Optimization](./level5/iterations/5.10-cost/) ⭐⭐⭐

---

## 🎯 Quick Links by Topic

### Kubernetes Fundamentals
- [Pods](./level1/iterations/1.1-pod/README.md)
- [Deployments](./level1/iterations/1.2-deployment/)
- [Services](./level1/iterations/1.3-service/)
- [ConfigMaps](./level2/iterations/2.4-configmaps/)
- [Secrets](./level2/iterations/2.5-secrets/)

### Storage & Persistence
- [Persistent Volumes](./level2/iterations/2.1-database/)
- [StatefulSets](./level2/iterations/2.1-database/)

### Networking
- [Service Discovery](./level2/iterations/2.2-api/)
- [Ingress](./level2/iterations/2.6-ingress/)
- [Service Mesh](./level5/iterations/5.5-service-mesh/)

### Packaging & Deployment
- [Helm Basics](./level3/)
- [GitOps with ArgoCD](./level4/)

### Production Features
- [Secrets Management (Vault)](./level5/iterations/5.1-vault/)
- [Autoscaling (HPA)](./level5/iterations/5.2-hpa/)
- [Monitoring](./level5/iterations/5.3-monitoring/)
- [Logging](./level5/iterations/5.4-logging/)
- [Security](./level5/iterations/5.6-security/)
- [Backup & DR](./level5/iterations/5.7-backup-dr/)
- [Chaos Engineering](./level5/iterations/5.8-chaos/)

---

## 🎓 Learning Paths by Experience

### Complete Beginner
```
Prerequisites → Level 1 → Level 2 → Level 3 → Level 4 → Level 5
(10-12 weeks at 5-10 hours/week)
```

### Some K8s Experience
```
Level 1 (quick review) → Level 2 → Level 3 → Level 4 → Level 5
(8-10 weeks at 5-10 hours/week)
```

### K8s Practitioner
```
Level 3 → Level 4 → Level 5
(6-8 weeks at 5-10 hours/week)
```

### Topic-Specific Learning
```
Prerequisites → Jump to specific iteration → Complete related exercises
(1-2 weeks per topic)
```

---

## 📋 Checklists

### Before You Start
- [ ] Read [README.md](./README.md)
- [ ] Complete [PREREQUISITES.md](./PREREQUISITES.md) setup
- [ ] Review [LEARNING_GUIDE.md](./LEARNING_GUIDE.md)
- [ ] Create learning journal
- [ ] Set goals and timeline

### Level Completion
- [ ] Level 1: Kubernetes Basics ✅
- [ ] Level 2: Multi-Service Deployment ✅
- [ ] Level 3: Helm Packaging ✅
- [ ] Level 4: GitOps with ArgoCD ✅
- [ ] Level 5: Production Features ✅

---

## 🆘 Need Help?

### Documentation
- [Prerequisites & Setup](./PREREQUISITES.md)
- [Learning Guide](./LEARNING_GUIDE.md)
- Level-specific resources in each `/resources` folder

### Troubleshooting
- Check iteration-specific troubleshooting sections
- Review [Level 1 Troubleshooting](./level1/resources/troubleshooting.md)
- Search [Kubernetes documentation](https://kubernetes.io/docs/)

### Community
- [Kubernetes Slack](https://slack.kubernetes.io/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)
- [Reddit r/kubernetes](https://www.reddit.com/r/kubernetes/)

---

## 🎯 Quick Reference

| Level | Focus | Duration | Outcome |
|-------|-------|----------|---------|
| 1 | K8s Basics | 4-6h | Deploy single apps |
| 2 | Multi-Service | 8-12h | Full-stack deployment |
| 3 | Helm Charts | 10-12h | Package applications |
| 4 | GitOps | 12-15h | Automated deployments |
| 5 | Production | 40-50h | Enterprise-ready systems |

**Total Learning Time**: 75-95 hours

---

## 🚀 Get Started Now!

**Absolute Beginner?**  
→ Start here: [Level 1: Kubernetes Basics](./level1/README.md)

**Have K8s experience?**  
→ Skip to: [Level 2: Multi-Service](./level2/README.md) or [Level 3: Helm](./level3/)

**Need production skills?**  
→ Jump to: [Level 5: Production Features](./level5/README.md)

---

**Happy Learning!** 🎓✨
