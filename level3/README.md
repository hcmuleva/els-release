# Level 3: Helm Charts - Package Management

**Duration**: 8-10 hours  
**Difficulty**: ⭐⭐⭐ Intermediate-Advanced

## 🎯 Overview

In Level 1, you deployed resources with `kubectl apply -f`. In Level 2, you managed multiple YAML files for a complete application. Now it's time to **package** everything properly using **Helm** - the package manager for Kubernetes.

**What is Helm?**
- 📦 Package Kubernetes applications into **Charts**
- 🔧 Templating engine for reusable YAML
- 📊 Manage releases and rollbacks
- 🏗️ Build complex applications from modular components

Think of Helm as **npm for Kubernetes** or **apt-get for K8s**.

## 🎓 What You'll Learn

By the end of Level 3, you will:
- ✅ Understand Helm architecture (Charts, Releases, Repositories)
- ✅ Create your first Helm chart from scratch
- ✅ Use Helm templating (values, functions, conditionals)
- ✅ Build sub-charts and dependencies
- ✅ Create an umbrella chart (like temple-stack)
- ✅ Manage Helm releases (install, upgrade, rollback)
- ✅ Package and share charts

## 📋 Prerequisites

**Must Complete First**:
- ✅ [Level 2: Multi-Service Deployment](../level2/README.md)

**Required Knowledge**:
- Kubernetes basics (Pods, Deployments, Services)
- Multi-tier application deployment
- ConfigMaps and Secrets
- Ingress configuration

**Tools Required**:
- Helm 3.x installed (see [PREREQUISITES.md](../PREREQUISITES.md))
- kubectl configured
- Docker Desktop Kubernetes running

**Verify Helm**:
```bash
helm version
# Should show v3.x.x

helm repo list
# May be empty if fresh install
```

## 🗺️ Level 3 Iterations

### Iteration 3.1: Helm Basics (1.5-2 hours)
**Objective**: Understand Helm concepts and create your first chart

**Topics**:
- Helm architecture and terminology
- Chart structure (`Chart.yaml`, `values.yaml`, `templates/`)
- Installing, upgrading, and rolling back releases
- Helm repositories

**Outcome**: Deploy nginx using a custom Helm chart

---

### Iteration 3.2: Templating Basics (1.5-2 hours)
**Objective**: Master Helm templating language

**Topics**:
- Template syntax (`{{ .Values.* }}`)
- Built-in objects (`.Values`, `.Release`, `.Chart`)
- Functions and pipelines
- Conditionals (`if/else`)
- Loops (`range`)

**Outcome**: Create templated Deployment and Service

---

### Iteration 3.3: Values and Overrides (1-1.5 hours)
**Objective**: Manage configuration with values

**Topics**:
- Default values in `values.yaml`
- Overriding with `--set` and `-f`
- Values file hierarchy
- Environment-specific values (`values-dev.yaml`, `values-prod.yaml`)

**Outcome**: Deploy same chart in different environments

---

### Iteration 3.4: Dependencies and Sub-charts (2-2.5 hours)
**Objective**: Build modular charts with dependencies

**Topics**:
- Chart dependencies in `Chart.yaml`
- Sub-charts in `charts/` directory
- Parent-child value passing
- Conditional dependencies

**Outcome**: Create chart with PostgreSQL dependency

---

### Iteration 3.5: Umbrella Chart (2-3 hours)
**Objective**: Package complete temple-stack application

**Topics**:
- Umbrella chart pattern
- Multiple sub-charts (postgres, temple-api, temple-ui)
- Global values
- Chart lifecycle hooks

**Outcome**: Create temple-stack umbrella chart matching `/devops/temple-stack/`

---

## 🎯 Learning Outcomes

After completing Level 3, you will be able to:

**Helm Fundamentals**:
- ✅ Explain what Helm is and why it's useful
- ✅ Understand Charts, Releases, and Repositories
- ✅ Navigate chart directory structure
- ✅ Install and manage Helm releases

**Templating**:
- ✅ Write Helm templates with variables
- ✅ Use functions and pipelines
- ✅ Implement conditionals and loops
- ✅ Debug template rendering

**Architecture**:
- ✅ Design modular charts with sub-charts
- ✅ Manage dependencies
- ✅ Build umbrella charts
- ✅ Share values between charts

**Operations**:
- ✅ Deploy applications with Helm
- ✅ Upgrade releases without downtime
- ✅ Rollback failed deployments
- ✅ Package and distribute charts

## 📁 Project: Temple Stack Helm Chart

Throughout Level 3, you'll build a production-ready Helm chart for the temple-stack application:

```
temple-stack/
├── Chart.yaml              # Chart metadata
├── values.yaml             # Default configuration
├── values-dev.yaml         # Development overrides
├── values-prod.yaml        # Production overrides
└── charts/                 # Sub-charts
    ├── postgres/           # Database chart
    │   ├── Chart.yaml
    │   ├── values.yaml
    │   └── templates/
    ├── temple-api/         # API chart
    │   ├── Chart.yaml
    │   ├── values.yaml
    │   └── templates/
    └── temple-ui/          # UI chart
        ├── Chart.yaml
        ├── values.yaml
        └── templates/
```

**Reference**: `/devops/temple-stack/` contains the complete implementation

## ✅ Validation Criteria

You've successfully completed Level 3 when you can:

**Practical Skills**:
- [ ] Create a Helm chart from scratch
- [ ] Template Deployments, Services, ConfigMaps, Secrets
- [ ] Use values files for configuration
- [ ] Build a chart with dependencies
- [ ] Create an umbrella chart
- [ ] Deploy, upgrade, and rollback releases

**Knowledge Check**:
- [ ] Explain the benefits of Helm over raw YAML
- [ ] Describe Helm chart structure
- [ ] Understand template syntax and built-in objects
- [ ] Know how to debug template rendering
- [ ] Explain umbrella chart pattern

**Project Completion**:
- [ ] Temple stack umbrella chart created
- [ ] All three sub-charts working (postgres, api, ui)
- [ ] Environment-specific value files
- [ ] Successful deployment to Kubernetes
- [ ] Can upgrade and rollback the release

## 🐛 Common Challenges

### Challenge 1: Template Syntax Errors
**Problem**: YAML indentation issues in templates

**Solution**:
```bash
# Dry-run to validate templates
helm install --dry-run --debug my-release ./my-chart

# Lint chart
helm lint ./my-chart
```

### Challenge 2: Values Not Passing to Sub-charts
**Problem**: Sub-charts not receiving parent values

**Solution**: Use global values or explicit passing:
```yaml
# Parent values.yaml
global:
  database:
    host: postgres-service

postgres:
  enabled: true
```

### Challenge 3: Dependency Hell
**Problem**: Chart dependencies not updating

**Solution**:
```bash
# Update dependencies
helm dependency update ./my-chart

# Build dependencies
helm dependency build ./my-chart
```

## 🔧 Essential Commands

```bash
# Create new chart
helm create my-chart

# Lint chart
helm lint ./my-chart

# Template rendering (dry-run)
helm template my-release ./my-chart
helm install --dry-run --debug my-release ./my-chart

# Install release
helm install my-release ./my-chart
helm install my-release ./my-chart -f values-dev.yaml
helm install my-release ./my-chart --set replicas=3

# List releases
helm list
helm list -A  # All namespaces

# Upgrade release
helm upgrade my-release ./my-chart
helm upgrade --install my-release ./my-chart  # Install if not exists

# Rollback release
helm rollback my-release
helm rollback my-release 2  # To specific revision

# History
helm history my-release

# Uninstall
helm uninstall my-release

# Dependencies
helm dependency update ./my-chart
helm dependency build ./my-chart
helm dependency list ./my-chart

# Package chart
helm package ./my-chart

# Search charts
helm search repo postgres
```

## 📚 Resources

**Official Documentation**:
- [Helm Documentation](https://helm.sh/docs/)
- [Chart Template Guide](https://helm.sh/docs/chart_template_guide/)
- [Best Practices](https://helm.sh/docs/chart_best_practices/)

**Reference Implementation**:
- `/devops/temple-stack/` - Complete umbrella chart example
- `/devops/temple-stack/charts/` - Sub-chart examples

**Tools**:
- [Helm Hub](https://artifacthub.io/) - Public chart repository
- [Helmfile](https://github.com/roboll/helmfile) - Declarative Helm deployments

## 🎯 Next Steps

Ready to start? Begin with:

**[Iteration 3.1: Helm Basics →](./iterations/3.1-helm-basics/README.md)**

After Level 3, you'll move to:

**[Level 4: GitOps with ArgoCD →](../level4/README.md)**

Where you'll learn:
- Declarative deployments
- Git as single source of truth
- Automated sync and rollback
- Progressive delivery

---

**Let's package everything with Helm!** 📦🚀
