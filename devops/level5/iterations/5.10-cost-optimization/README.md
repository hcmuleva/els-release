# Iteration 5.10: Cost Optimization

**Duration**: ~2-3 hours  
**Difficulty**: ⭐⭐⭐⭐ Advanced

## 🎯 Learning Objectives

- ✅ Analyze Kubernetes resource costs
- ✅ Implement resource quotas and limits
- ✅ Right-size workloads with VPA
- ✅ Use Spot/Preemptible nodes
- ✅ Optimize storage costs
- ✅ Monitor and report costs

## 💰 Cost Analysis Tools

### Install KubeCost

```bash
# Add KubeCost Helm repository
helm repo add kubecost https://kubecost.github.io/cost-analyzer/
helm repo update

# Install KubeCost
helm install kubecost kubecost/cost-analyzer \
  --namespace kubecost \
  --create-namespace \
  --set kubecostToken="aGVsbUBrdWJlY29zdC5jb20=xm343yadf98"

# Access dashboard
kubectl port-forward -n kubecost svc/kubecost-cost-analyzer 9090:9090
# Open: http://localhost:9090
```

## 📊 Resource Quotas

### Namespace Resource Quota

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: temple-stack-quota
  namespace: temple-stack
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    persistentvolumeclaims: "5"
    services.loadbalancers: "1"
```

### LimitRange

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: temple-stack-limits
  namespace: temple-stack
spec:
  limits:
  - max:
      cpu: "2"
      memory: 2Gi
    min:
      cpu: 50m
      memory: 64Mi
    default:
      cpu: 500m
      memory: 512Mi
    defaultRequest:
      cpu: 100m
      memory: 128Mi
    type: Container
```

## 🎯 Right-Sizing with VPA

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: temple-api-vpa
  namespace: temple-stack
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: temple-api
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: api
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 1
        memory: 1Gi
      controlledResources:
      - cpu
      - memory
```

## 💾 Storage Optimization

### Use Storage Classes Efficiently

```yaml
# Standard storage (cheaper)
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: cache-pvc
spec:
  storageClassName: standard
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi

---
# Premium storage (only when needed)
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: database-pvc
spec:
  storageClassName: premium-ssd
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

### PVC Lifecycle Management

```yaml
# Retention policy
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-retain
spec:
  persistentVolumeReclaimPolicy: Retain  # or Delete
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce
```

## 🏷️ Node Affinity for Cost Optimization

### Use Spot Instances

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: temple-batch-processor
spec:
  replicas: 3
  template:
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: node.kubernetes.io/instance-type
                operator: In
                values:
                - spot
                - preemptible
      tolerations:
      - key: spot
        operator: Equal
        value: "true"
        effect: NoSchedule
      containers:
      - name: processor
        image: temple-processor:latest
```

## 📉 Cost Optimization Strategies

### 1. Horizontal Pod Autoscaling

```yaml
# Scale down during off-hours
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: temple-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: temple-api
  minReplicas: 1      # Off-hours
  maxReplicas: 10     # Peak hours
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### 2. Cluster Autoscaler

Enable cluster autoscaler to scale nodes based on demand:

```yaml
# For GKE
gcloud container clusters update temple-cluster \
  --enable-autoscaling \
  --min-nodes=1 \
  --max-nodes=10

# For EKS
eksctl create cluster \
  --name=temple-cluster \
  --nodes-min=1 \
  --nodes-max=10 \
  --node-type=t3.medium
```

### 3. Schedule-Based Scaling

```yaml
# CronJob to scale down at night
apiVersion: batch/v1
kind: CronJob
metadata:
  name: scale-down-night
spec:
  schedule: "0 22 * * *"  # 10 PM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: kubectl
            image: bitnami/kubectl
            command:
            - sh
            - -c
            - kubectl scale deployment temple-api --replicas=1 -n temple-stack
          restartPolicy: OnFailure

---
# Scale up in morning
apiVersion: batch/v1
kind: CronJob
metadata:
  name: scale-up-morning
spec:
  schedule: "0 6 * * *"  # 6 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: kubectl
            image: bitnami/kubectl
            command:
            - sh
            - -c
            - kubectl scale deployment temple-api --replicas=3 -n temple-stack
          restartPolicy: OnFailure
```

## 📊 Cost Monitoring

### Prometheus Queries for Cost

```promql
# CPU cost per namespace
sum(rate(container_cpu_usage_seconds_total[5m])) by (namespace) * 3600 * 24 * 30 * 0.04

# Memory cost per namespace
sum(container_memory_usage_bytes) by (namespace) / 1024 / 1024 / 1024 * 30 * 0.005

# Storage cost
sum(kubelet_volume_stats_capacity_bytes) by (namespace) / 1024 / 1024 / 1024 * 0.10
```

## ✅ Cost Optimization Checklist

- [ ] Set resource requests and limits on all containers
- [ ] Implement horizontal and vertical autoscaling
- [ ] Use appropriate storage classes
- [ ] Enable cluster autoscaling
- [ ] Use spot/preemptible nodes for non-critical workloads
- [ ] Implement resource quotas per namespace
- [ ] Delete unused PVCs and LoadBalancers
- [ ] Right-size workloads based on actual usage
- [ ] Schedule scale-down during off-hours
- [ ] Monitor costs with KubeCost or cloud provider tools

## 📈 Cost Savings Report

Generate monthly cost report:

```bash
# Get resource usage
kubectl top nodes
kubectl top pods --all-namespaces

# Check storage usage
kubectl get pvc --all-namespaces

# Identify idle resources
kubectl get pods --all-namespaces --field-selector=status.phase!=Running

# Find pods without resource limits
kubectl get pods --all-namespaces -o json | \
  jq '.items[] | select(.spec.containers[].resources.limits == null) | .metadata.name'
```

## 🎉 Level 5 Complete!

**Congratulations!** You've mastered production-grade Kubernetes:
- ✅ Secrets management with Vault
- ✅ Comprehensive monitoring and alerting
- ✅ Service mesh with Istio
- ✅ Auto-scaling strategies
- ✅ RBAC and security policies
- ✅ Network security
- ✅ Backup and disaster recovery
- ✅ Multi-cluster management
- ✅ Chaos engineering
- ✅ Cost optimization

**You've completed the entire Kubernetes Learning Path!** 🎓

See [COMPLETION_CERTIFICATE.md](../../COMPLETION_CERTIFICATE.md) for next steps and career guidance.

---

**Total Course Completion**: 32 iterations, 75-95 hours! 🚀
