# Level 4: GitOps with ArgoCD

**Duration**: 8-10 hours  
**Difficulty**: ⭐⭐⭐⭐ Advanced

## 🎯 Overview

You've deployed applications manually with `kubectl` (Level 1-2) and packaged them with Helm (Level 3). Now it's time to implement **GitOps** - where Git becomes the single source of truth for your infrastructure.

**What is GitOps?**
- 📝 Declarative infrastructure in Git
- 🔄 Automated deployment from Git repositories
- 🎯 Git as the source of truth
- ⏪ Easy rollbacks via Git history
- 🔍 Full audit trail of all changes

**ArgoCD** is the leading GitOps tool for Kubernetes - think of it as **"Continuous Deployment for Kubernetes"**.

## 🎓 What You'll Learn

By the end of Level 4, you will:
- ✅ Understand GitOps principles and benefits
- ✅ Install and configure ArgoCD
- ✅ Deploy applications using ArgoCD
- ✅ Implement automated sync from Git
- ✅ Configure sync policies and health checks
- ✅ Manage multi-environment deployments
- ✅ Implement progressive delivery strategies
- ✅ Troubleshoot ArgoCD applications

## 📋 Prerequisites

**Must Complete First**:
- ✅ [Level 3: Helm Charts](../level3/README.md)

**Required Knowledge**:
- Kubernetes fundamentals
- Helm charts and templating
- Git basics (clone, commit, push, branch)
- YAML manifests

**Tools Required**:
- ArgoCD CLI installed (see [PREREQUISITES.md](../PREREQUISITES.md))
- kubectl configured
- Helm 3.x installed
- Git repository access (GitHub/GitLab)

**Verify ArgoCD CLI**:
```bash
argocd version --client
# Should show argocd: vX.X.X
```

## 🗺️ Level 4 Iterations

### Iteration 4.1: ArgoCD Installation (1-1.5 hours)
**Objective**: Install and access ArgoCD

**Topics**:
- ArgoCD architecture
- Installation methods (manifest, Helm)
- Accessing ArgoCD UI
- CLI authentication

**Outcome**: ArgoCD running on your cluster with UI access

---

### Iteration 4.2: First ArgoCD Application (1.5-2 hours)
**Objective**: Deploy your first app with ArgoCD

**Topics**:
- Application CRD
- Source (Git repo) configuration
- Destination (cluster/namespace)
- Sync policies (manual vs automatic)

**Outcome**: Deploy nginx from Git using ArgoCD

---

### Iteration 4.3: Helm Integration (2-2.5 hours)
**Objective**: Deploy Helm charts with ArgoCD

**Topics**:
- Helm chart sources
- Values file management
- Chart versioning
- Upgrade strategies

**Outcome**: Deploy temple-stack using ArgoCD + Helm

---

### Iteration 4.4: Sync Policies and Health (1.5-2 hours)
**Objective**: Configure automated sync and health checks

**Topics**:
- Auto-sync configuration
- Prune resources
- Self-healing
- Health assessment
- Sync waves and hooks

**Outcome**: Fully automated GitOps deployment

---

### Iteration 4.5: Multi-Environment Strategy (2-3 hours)
**Objective**: Manage dev, staging, production with ArgoCD

**Topics**:
- Environment-specific value files
- Branch-based deployments
- Application sets
- Project isolation

**Outcome**: Temple-stack deployed to dev and prod environments

---

## 🎯 Learning Outcomes

After completing Level 4, you will be able to:

**GitOps Fundamentals**:
- ✅ Explain GitOps principles and benefits
- ✅ Understand declarative vs imperative deployments
- ✅ Describe ArgoCD architecture
- ✅ Navigate ArgoCD UI and CLI

**Application Management**:
- ✅ Create ArgoCD applications via UI and YAML
- ✅ Configure sync policies
- ✅ Manage application health and status
- ✅ Troubleshoot sync issues

**Helm Integration**:
- ✅ Deploy Helm charts with ArgoCD
- ✅ Manage values files in Git
- ✅ Handle chart dependencies
- ✅ Version control chart releases

**Advanced Patterns**:
- ✅ Implement multi-environment deployments
- ✅ Use sync waves for ordered deployments
- ✅ Configure sync hooks
- ✅ Set up progressive delivery

## 📁 Iteration Structure

### [Iteration 4.1: ArgoCD Installation](iterations/4.1-argocd-installation/)
**Duration**: ~1-1.5 hours | **Difficulty**: ⭐⭐⭐ Intermediate-Advanced

Install and configure ArgoCD for GitOps continuous deployment.

**What You'll Learn**:
- Install ArgoCD in Kubernetes
- Access ArgoCD UI and CLI
- Configure Git repository connections
- Understand ArgoCD architecture

**Solution Files**:
- `install-argocd.sh` - Automated installation script
- `argocd-ingress.yaml` - Ingress configuration for UI access

---

### [Iteration 4.2: Create Your First ArgoCD Application](iterations/4.2-first-app/)
**Duration**: ~1.5-2 hours | **Difficulty**: ⭐⭐⭐ Intermediate-Advanced

Deploy applications from Git repositories using ArgoCD Application CRD.

**What You'll Learn**:
- Create Application CRD
- Deploy from Git repository
- Understand sync strategies (manual vs auto)
- Monitor application health
- Perform manual sync operations

**Solution Files**:
- `nginx-application.yaml` - Sample Application manifest

---

### [Iteration 4.3: Helm Integration with ArgoCD](iterations/4.3-helm-integration/)
**Duration**: ~2-2.5 hours | **Difficulty**: ⭐⭐⭐⭐ Advanced

Deploy Helm charts using ArgoCD for the temple-stack application.

**What You'll Learn**:
- Deploy Helm charts with ArgoCD
- Manage Helm values in Git
- Use values files and parameters
- Deploy temple-stack with ArgoCD + Helm
- Handle chart dependencies

**Solution Files**:
- `temple-stack-helm-app.yaml` - Temple Stack Application with Helm
- `values-dev.yaml` - Development environment values

---

### [Iteration 4.4: Sync Policies and Health Checks](iterations/4.4-sync-policies/)
**Duration**: ~1.5-2 hours | **Difficulty**: ⭐⭐⭐⭐ Advanced

Configure automated sync, self-healing, and advanced sync options.

**What You'll Learn**:
- Configure automated sync
- Enable self-healing
- Configure prune (delete unused resources)
- Use sync waves for ordered deployment
- Implement sync hooks
- Custom health checks

**Solution Files**:
- `automated-sync-app.yaml` - Fully automated application
- `sync-hooks.yaml` - PreSync/PostSync job examples
- `sync-waves.yaml` - Ordered deployment example

---

### [Iteration 4.5: Multi-Environment GitOps Strategy](iterations/4.5-multi-environment/)
**Duration**: ~2-3 hours | **Difficulty**: ⭐⭐⭐⭐ Advanced

Implement production-ready multi-environment GitOps workflow.

**What You'll Learn**:
- Implement multi-environment GitOps
- Use Git branches or directories for environments
- Manage environment-specific configurations
- Deploy to dev, staging, production
- Implement promotion workflows
- Use ArgoCD Projects for isolation

**Solution Files**:
- `argocd-projects.yaml` - Dev/Staging/Prod projects
- `multi-env-apps.yaml` - Applications for all environments

```
gitops-temple-stack/
├── apps/                          # ArgoCD Application manifests
│   ├── temple-stack-dev.yaml
│   └── temple-stack-prod.yaml
├── charts/                        # Helm charts (from Level 3)
│   └── temple-stack/
│       ├── Chart.yaml
│       ├── values.yaml
│       ├── values-dev.yaml
│       └── values-prod.yaml
└── manifests/                     # Raw Kubernetes manifests
    ├── namespace.yaml
    └── secrets.yaml
```

**Reference**: `/devops/argocd/temple-stack-app.yaml` contains application example

## ✅ Validation Criteria

You've successfully completed Level 4 when you can:

**Practical Skills**:
- [ ] Install ArgoCD in Kubernetes
- [ ] Access ArgoCD UI and authenticate
- [ ] Create ArgoCD applications via UI and YAML
- [ ] Deploy Helm charts using ArgoCD
- [ ] Configure auto-sync and self-healing
- [ ] Manage multi-environment deployments
- [ ] Rollback deployments via Git

**Knowledge Check**:
- [ ] Explain GitOps principles
- [ ] Describe ArgoCD architecture
- [ ] Understand sync policies (manual, auto, self-heal)
- [ ] Know health check mechanisms
- [ ] Explain sync waves and hooks

**Project Completion**:
- [ ] ArgoCD installed and accessible
- [ ] Temple-stack deployed via ArgoCD
- [ ] Automatic sync from Git enabled
- [ ] Dev and prod environments configured
- [ ] Can update app by committing to Git
- [ ] Can rollback by reverting Git commits

## 🐛 Common Challenges

### Challenge 1: Application OutOfSync
**Problem**: Application shows as OutOfSync

**Solution**:
```bash
# Check diff
argocd app diff <app-name>

# Manual sync
argocd app sync <app-name>

# Enable auto-sync
argocd app set <app-name> --sync-policy automated
```

### Challenge 2: Health Check Failures
**Problem**: Resources show as Degraded

**Solution**:
- Check pod status: `kubectl get pods -n <namespace>`
- Check events: `kubectl get events -n <namespace>`
- ArgoCD logs: `kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller`

### Challenge 3: Helm Values Not Applied
**Problem**: Values file changes not reflected

**Solution**:
```yaml
# In Application spec:
source:
  helm:
    valueFiles:
    - values-dev.yaml  # Ensure correct file path
```

### Challenge 4: Private Git Repository
**Problem**: ArgoCD can't access private repo

**Solution**:
```bash
# Add repo credentials
argocd repo add https://github.com/org/repo --username <user> --password <token>

# Or use SSH
argocd repo add git@github.com:org/repo.git --ssh-private-key-path ~/.ssh/id_rsa
```

## 🔧 Essential Commands

```bash
# ArgoCD Installation
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get admin password
argocd admin initial-password -n argocd

# Login via CLI
argocd login localhost:8080

# Create application
argocd app create my-app \
  --repo https://github.com/org/repo \
  --path charts/my-app \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace default

# List applications
argocd app list

# Get application details
argocd app get my-app

# Sync application
argocd app sync my-app

# Check diff
argocd app diff my-app

# Enable auto-sync
argocd app set my-app --sync-policy automated

# Enable self-heal
argocd app set my-app --self-heal

# Enable auto-prune
argocd app set my-app --auto-prune

# History
argocd app history my-app

# Rollback
argocd app rollback my-app <revision>

# Delete application
argocd app delete my-app

# Add repository
argocd repo add https://github.com/org/repo

# List repositories
argocd repo list
```

## 📚 GitOps Principles

**Core Principles**:

1. **Declarative**: Entire system described declaratively
2. **Versioned**: Canonical state stored in Git
3. **Immutable**: No direct changes to running system
4. **Automated**: Software agents ensure desired state

**Benefits**:

| Benefit | Description |
|---------|-------------|
| 🔍 **Audit Trail** | Full history of who changed what and when |
| ⏪ **Easy Rollback** | Revert Git commit to rollback deployment |
| 🔄 **Consistency** | Git as single source of truth |
| 🚀 **Faster Deployments** | Automated sync from Git |
| 👥 **Collaboration** | Standard Git workflows (PR, review) |
| 🔐 **Security** | No kubectl access needed for deployments |

## 🏗️ ArgoCD Architecture

```
┌─────────────┐
│   Git Repo  │  ← Source of truth
└──────┬──────┘
       │
       │ polls/webhook
       ↓
┌─────────────────────────────┐
│      ArgoCD Server          │
│  ┌─────────────────────┐   │
│  │ Application CRDs    │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ Sync Controller     │   │
│  └─────────────────────┘   │
└──────────┬──────────────────┘
           │
           │ applies manifests
           ↓
┌─────────────────────────────┐
│   Kubernetes Cluster        │
│  ┌──────┐  ┌──────┐        │
│  │ Pods │  │ Svc  │  ...   │
│  └──────┘  └──────┘        │
└─────────────────────────────┘
```

## 📚 Resources

**Official Documentation**:
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [GitOps Principles](https://opengitops.dev/)
- [ArgoCD Best Practices](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/)

**Reference Implementation**:
- `/devops/argocd/` - ArgoCD application examples
- `/devops/temple-stack/` - Helm chart for GitOps deployment

**Tools**:
- [ArgoCD UI](http://localhost:8080) - Web interface (after installation)
- [ArgoCD CLI](https://argo-cd.readthedocs.io/en/stable/cli_installation/) - Command-line tool

## 🎯 Next Steps

Ready to start? Begin with:

**[Iteration 4.1: ArgoCD Installation →](./iterations/4.1-argocd-installation/README.md)**

After Level 4, you'll move to:

**[Level 5: Production-Grade Features →](../level5/README.md)**

Where you'll learn:
- HashiCorp Vault for secrets
- Monitoring with Prometheus/Grafana
- Service mesh with Istio
- Autoscaling and cost optimization

---

**Let's automate everything with GitOps!** 🔄🚀
