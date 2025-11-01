# Iteration 5.8: Multi-Cluster Management

**Duration**: ~3-4 hours  
**Difficulty**: ⭐⭐⭐⭐⭐ Expert

## 🎯 Learning Objectives

- ✅ Manage multiple Kubernetes clusters
- ✅ Deploy applications across clusters with ArgoCD
- ✅ Implement cluster federation
- ✅ Configure multi-cluster service discovery
- ✅ Implement disaster recovery across clusters

## 🌐 Architecture

```
┌─────────────────────┐
│   ArgoCD Hub        │
│   (Management)      │
└──────┬──────────────┘
       │
   ┌───┴────────┬────────────┐
   │            │            │
┌──▼──┐    ┌───▼──┐    ┌───▼──┐
│Dev  │    │Stg   │    │Prod  │
│Cluster│  │Cluster│  │Cluster│
└─────┘    └──────┘    └──────┘
```

## 🔧 Setup Multiple Contexts

```bash
# List contexts
kubectl config get-contexts

# Create contexts for different clusters
kubectl config set-context dev-cluster --cluster=dev --user=dev-user
kubectl config set-context staging-cluster --cluster=staging --user=staging-user
kubectl config set-context prod-cluster --cluster=prod --user=prod-user

# Switch context
kubectl config use-context dev-cluster

# Current context
kubectl config current-context
```

## 🚀 ArgoCD Multi-Cluster Setup

```bash
# Login to ArgoCD
argocd login localhost:8080 --username admin --password <password>

# Add clusters to ArgoCD
argocd cluster add dev-cluster --name dev
argocd cluster add staging-cluster --name staging  
argocd cluster add prod-cluster --name prod

# List registered clusters
argocd cluster list
```

## 📱 ApplicationSet for Multi-Cluster

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: temple-stack-multi-cluster
  namespace: argocd
spec:
  generators:
  - list:
      elements:
      - cluster: dev
        url: https://dev-cluster.example.com
        values:
          replicas: "1"
          environment: development
      - cluster: staging
        url: https://staging-cluster.example.com
        values:
          replicas: "2"
          environment: staging
      - cluster: prod
        url: https://prod-cluster.example.com
        values:
          replicas: "3"
          environment: production
  
  template:
    metadata:
      name: 'temple-stack-{{cluster}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/your-org/temple-stack.git
        targetRevision: HEAD
        path: charts/temple-stack
        helm:
          parameters:
          - name: replicas
            value: '{{values.replicas}}'
          - name: environment
            value: '{{values.environment}}'
      destination:
        server: '{{url}}'
        namespace: temple-stack
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
```

## 🔄 Kubefed (Kubernetes Federation)

```bash
# Install kubefedctl
brew install kubefedctl

# Join clusters to federation
kubefedctl join dev-cluster \
  --cluster-context dev-cluster \
  --host-cluster-context hub-cluster

kubefedctl join staging-cluster \
  --cluster-context staging-cluster \
  --host-cluster-context hub-cluster

# Verify federated clusters
kubectl get kubefedclusters -n kube-federation-system
```

### Federated Deployment

```yaml
apiVersion: types.kubefed.io/v1beta1
kind: FederatedDeployment
metadata:
  name: temple-api
  namespace: temple-stack
spec:
  template:
    metadata:
      labels:
        app: temple-api
    spec:
      replicas: 2
      selector:
        matchLabels:
          app: temple-api
      template:
        metadata:
          labels:
            app: temple-api
        spec:
          containers:
          - name: api
            image: temple-api:latest
            ports:
            - containerPort: 1337
  placement:
    clusters:
    - name: dev-cluster
    - name: staging-cluster
    - name: prod-cluster
  overrides:
  - clusterName: dev-cluster
    clusterOverrides:
    - path: "/spec/replicas"
      value: 1
  - clusterName: prod-cluster
    clusterOverrides:
    - path: "/spec/replicas"
      value: 5
```

## 🔍 Multi-Cluster Observability

### Thanos for Multi-Cluster Prometheus

```bash
# Install Thanos
helm install thanos bitnami/thanos \
  --namespace monitoring \
  --set query.enabled=true \
  --set queryFrontend.enabled=true \
  --set storegateway.enabled=true

# Configure Prometheus to use Thanos sidecar
# (Update prometheus-operator values)
```

## ✅ Validation

```bash
# Verify all clusters registered
argocd cluster list

# Check ApplicationSet
kubectl get applicationset -n argocd

# Verify apps deployed to all clusters
argocd app list

# Check specific cluster deployment
kubectl get pods -n temple-stack --context=dev-cluster
kubectl get pods -n temple-stack --context=prod-cluster
```

## 🎯 Next Steps

**Next**: [Iteration 5.9: Chaos Engineering](../5.9-chaos-engineering/README.md)
