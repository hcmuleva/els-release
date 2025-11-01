# Iteration 3.1: Helm Basics

**Duration**: ~1.5-2 hours  
**Difficulty**: ⭐⭐⭐ Intermediate

## 🎯 Learning Objectives

By the end of this iteration, you will:
- ✅ Understand Helm architecture and terminology
- ✅ Create your first Helm chart from scratch
- ✅ Understand chart directory structure
- ✅ Install and manage Helm releases
- ✅ Use Helm repositories
- ✅ Perform upgrades and rollbacks

## 📚 Background

### What is Helm?

**Helm** is the package manager for Kubernetes. Think of it as:
- **npm** for Node.js
- **apt/yum** for Linux
- **pip** for Python

**Helm solves**:
- ❌ Managing dozens of YAML files
- ❌ Copy-paste configuration across environments
- ❌ Versioning deployments
- ❌ Sharing applications

**Helm provides**:
- ✅ Package applications as **Charts**
- ✅ Templating for reusable YAML
- ✅ Version control and rollback
- ✅ Dependency management

### Helm Architecture

```
Helm CLI (your machine)
    ↓ communicates with
Kubernetes API Server
    ↓ deploys
Helm Charts → Kubernetes Resources
```

**Key Concepts**:
- **Chart**: Package of Kubernetes resources
- **Release**: Instance of a chart deployed to cluster
- **Repository**: Collection of charts
- **Values**: Configuration parameters

## 📋 Prerequisites

- Completed [Level 2](../../level2/README.md)
- Helm 3.x installed (check: `helm version`)
- kubectl configured
- Understanding of Kubernetes manifests

## 🎓 Theory

### Chart Directory Structure

```
my-chart/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default configuration
├── charts/             # Chart dependencies
├── templates/          # Kubernetes manifests with Go templates
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── _helpers.tpl   # Template helpers
│   └── NOTES.txt      # Post-install notes
└── .helmignore         # Files to ignore
```

### Chart.yaml

```yaml
apiVersion: v2
name: my-app
description: A Helm chart for my application
type: application
version: 0.1.0        # Chart version
appVersion: "1.0"     # Application version
```

### values.yaml

```yaml
replicaCount: 2
image:
  repository: nginx
  tag: "1.21"
  pullPolicy: IfNotPresent
service:
  type: ClusterIP
  port: 80
```

## 🛠️ Hands-On Exercise

### Task 1: Create Your First Chart

```bash
# Create a new chart
helm create my-first-chart

# Explore the structure
cd my-first-chart
tree

# Chart.yaml - metadata
cat Chart.yaml

# values.yaml - default values
cat values.yaml

# templates/ - Kubernetes manifests
ls -la templates/
```

### Task 2: Understand Chart Templates

```bash
# View deployment template
cat templates/deployment.yaml
```

Notice the Go template syntax:
- `{{ .Values.replicaCount }}` - Reference values.yaml
- `{{ .Chart.Name }}` - Reference Chart.yaml
- `{{ .Release.Name }}` - Release name at install time

### Task 3: Install the Chart

```bash
# Dry-run to see what will be created
helm install --dry-run --debug my-release ./my-first-chart

# Actually install
helm install my-release ./my-first-chart -n level3 --create-namespace

# List releases
helm list -n level3

# Check what was created
kubectl get all -n level3
```

### Task 4: Inspect the Release

```bash
# Get release details
helm get all my-release -n level3

# Get manifest
helm get manifest my-release -n level3

# Get values
helm get values my-release -n level3

# Get notes
helm get notes my-release -n level3
```

### Task 5: Upgrade the Release

```bash
# Change replica count
helm upgrade my-release ./my-first-chart \
  --set replicaCount=3 \
  -n level3

# Check deployment
kubectl get deployment -n level3

# View revision history
helm history my-release -n level3
```

### Task 6: Rollback the Release

```bash
# Rollback to previous version
helm rollback my-release -n level3

# Rollback to specific revision
helm rollback my-release 1 -n level3

# Check history
helm history my-release -n level3
```

### Task 7: Work with Helm Repositories

```bash
# Add a repository
helm repo add bitnami https://charts.bitnami.com/bitnami

# Update repositories
helm repo update

# Search for charts
helm search repo postgres

# Search hub (public charts)
helm search hub wordpress

# List repositories
helm repo list

# Install from repository
helm install my-postgres bitnami/postgresql -n level3
```

### Task 8: Create a Simple Chart from Scratch

Let's create a chart for nginx:

```bash
# Create empty chart directory
mkdir nginx-chart
cd nginx-chart

# Create Chart.yaml
cat > Chart.yaml << EOF
apiVersion: v2
name: nginx-chart
description: Simple nginx web server
type: application
version: 0.1.0
appVersion: "1.21"
EOF

# Create values.yaml
cat > values.yaml << EOF
replicaCount: 2

image:
  repository: nginx
  tag: "1.21"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

resources:
  requests:
    memory: "64Mi"
    cpu: "100m"
  limits:
    memory: "128Mi"
    cpu: "200m"
EOF

# Create templates directory
mkdir templates

# Create deployment
cat > templates/deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-nginx
  labels:
    app: {{ .Release.Name }}-nginx
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Release.Name }}-nginx
  template:
    metadata:
      labels:
        app: {{ .Release.Name }}-nginx
    spec:
      containers:
      - name: nginx
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - containerPort: 80
        resources:
{{ toYaml .Values.resources | indent 10 }}
EOF

# Create service
cat > templates/service.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: {{ .Release.Name }}-nginx
  labels:
    app: {{ .Release.Name }}-nginx
spec:
  type: {{ .Values.service.type }}
  ports:
  - port: {{ .Values.service.port }}
    targetPort: 80
    protocol: TCP
  selector:
    app: {{ .Release.Name }}-nginx
EOF
```

Install your chart:

```bash
# Validate
helm lint nginx-chart

# Dry-run
helm install --dry-run --debug my-nginx ./nginx-chart -n level3

# Install
helm install my-nginx ./nginx-chart -n level3

# Verify
kubectl get all -n level3 -l app=my-nginx-nginx
```

## 🎯 Practice Exercises

### Exercise 1: Customize Installation

Install the nginx chart with custom values:

```bash
helm install my-custom-nginx ./nginx-chart \
  --set replicaCount=4 \
  --set service.type=LoadBalancer \
  --set image.tag=alpine \
  -n level3
```

### Exercise 2: Use Values File

Create `custom-values.yaml`:

```yaml
replicaCount: 3
image:
  tag: "alpine"
service:
  type: NodePort
```

Install:
```bash
helm install my-nginx ./nginx-chart -f custom-values.yaml -n level3
```

### Exercise 3: Package and Share

```bash
# Package the chart
helm package nginx-chart

# This creates: nginx-chart-0.1.0.tgz

# Install from package
helm install packaged-nginx ./nginx-chart-0.1.0.tgz -n level3
```

## ✅ Validation

Check your understanding:

**Questions**:
1. What's the difference between Chart version and appVersion?
2. What does `{{ .Release.Name }}` reference?
3. How do you override values during installation?
4. What's the difference between upgrade and rollback?
5. What does `helm lint` do?

**Practical Check**:

```bash
# Create chart
helm create test-chart

# Lint chart
helm lint test-chart
# Should pass with no errors

# Template chart (render without installing)
helm template my-test ./test-chart
# Should output valid YAML

# Install chart
helm install test-release ./test-chart -n level3

# Verify installation
helm list -n level3 | grep test-release
kubectl get all -n level3 -l app.kubernetes.io/instance=test-release

# Upgrade with new values
helm upgrade test-release ./test-chart --set replicaCount=5 -n level3
kubectl get deployment -n level3
# Should show 5 replicas

# Rollback
helm rollback test-release -n level3

# Uninstall
helm uninstall test-release -n level3
```

## 📚 Key Takeaways

- 📌 **Helm** packages Kubernetes apps as Charts
- 📌 **Charts** contain templates + values + metadata
- 📌 **Releases** are deployed instances of charts
- 📌 **Templates** use Go template syntax
- 📌 **Values** provide configuration flexibility
- 📌 `helm install/upgrade/rollback` manage lifecycle
- 📌 `helm lint` validates charts before deployment
- 📌 Repositories share reusable charts

## 🐛 Common Issues

### Chart fails to install

```bash
# Check template rendering
helm template my-release ./my-chart

# Check for syntax errors
helm lint my-chart
```

### Values not applied

```bash
# Check actual values used
helm get values my-release -n level3

# Include default values
helm get values my-release -n level3 --all
```

### Release not found

```bash
# List all releases in all namespaces
helm list -A

# Specify correct namespace
helm list -n level3
```

### Template errors

```bash
# Use debug mode
helm install --dry-run --debug my-release ./my-chart -n level3
# Shows rendered templates and errors
```

## 🔧 Essential Commands Summary

```bash
# Chart management
helm create <name>              # Create new chart
helm lint <chart>               # Validate chart
helm package <chart>            # Package chart

# Release management
helm install <release> <chart>  # Install chart
helm upgrade <release> <chart>  # Upgrade release
helm rollback <release>         # Rollback release
helm uninstall <release>        # Delete release
helm list                       # List releases

# Debugging
helm template <release> <chart> # Render templates
helm get manifest <release>     # Get deployed manifest
helm get values <release>       # Get values
helm history <release>          # Show revisions

# Repositories
helm repo add <name> <url>      # Add repository
helm repo update                # Update repos
helm search repo <keyword>      # Search repos
helm search hub <keyword>       # Search Helm Hub
```

## 🎯 Next Steps

**Completed Iteration 3.1?** Excellent! 🎉

You now understand Helm basics and can create simple charts.

**Next**: [Iteration 3.2: Templating Deep Dive](../3.2-templating/README.md)

In 3.2, you'll learn:
- Advanced template syntax
- Built-in objects and functions
- Conditionals and loops
- Template helpers and includes

---

**You're becoming a Helm expert!** 📦🚀
