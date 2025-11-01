# Iteration 5.9: Chaos Engineering

**Duration**: ~2-3 hours  
**Difficulty**: ⭐⭐⭐⭐ Advanced

## 🎯 Learning Objectives

- ✅ Understand chaos engineering principles
- ✅ Install Chaos Mesh
- ✅ Inject pod failures
- ✅ Simulate network latency and partitions
- ✅ Test application resilience
- ✅ Create chaos experiments

## 🔬 What is Chaos Engineering?

**Definition**: Intentionally injecting failures to test system resilience

**Goals**:
- Identify weaknesses before production incidents
- Validate recovery mechanisms
- Build confidence in system reliability
- Improve incident response

## 🚀 Install Chaos Mesh

```bash
# Add Chaos Mesh repository
helm repo add chaos-mesh https://charts.chaos-mesh.org
helm repo update

# Install Chaos Mesh
kubectl create namespace chaos-mesh
helm install chaos-mesh chaos-mesh/chaos-mesh \
  --namespace=chaos-mesh \
  --set chaosDaemon.runtime=containerd \
  --set chaosDaemon.socketPath=/run/containerd/containerd.sock \
  --set dashboard.create=true

# Verify installation
kubectl get pods -n chaos-mesh

# Access dashboard
kubectl port-forward -n chaos-mesh svc/chaos-dashboard 2333:2333
# Open: http://localhost:2333
```

## 💥 Pod Failure Chaos

### Random Pod Kill

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: temple-api-pod-kill
  namespace: temple-stack
spec:
  action: pod-kill
  mode: one
  selector:
    namespaces:
    - temple-stack
    labelSelectors:
      app: temple-api
  scheduler:
    cron: "@every 5m"
```

### Pod Failure

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: temple-api-pod-failure
  namespace: temple-stack
spec:
  action: pod-failure
  mode: fixed
  value: "1"
  selector:
    namespaces:
    - temple-stack
    labelSelectors:
      app: temple-api
  duration: "30s"
```

## 🌐 Network Chaos

### Network Delay

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: temple-api-network-delay
  namespace: temple-stack
spec:
  action: delay
  mode: one
  selector:
    namespaces:
    - temple-stack
    labelSelectors:
      app: temple-api
  delay:
    latency: "500ms"
    correlation: "25"
    jitter: "100ms"
  duration: "2m"
```

### Network Partition

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: temple-api-partition
  namespace: temple-stack
spec:
  action: partition
  mode: all
  selector:
    namespaces:
    - temple-stack
    labelSelectors:
      app: temple-api
  direction: both
  target:
    selector:
      namespaces:
      - temple-stack
      labelSelectors:
        app: postgres
  duration: "30s"
```

### Network Bandwidth Limit

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: temple-ui-bandwidth-limit
  namespace: temple-stack
spec:
  action: bandwidth
  mode: all
  selector:
    namespaces:
    - temple-stack
    labelSelectors:
      app: temple-ui
  bandwidth:
    rate: "1mbps"
    limit: 20000
    buffer: 10000
  duration: "1m"
```

## 💾 Stress Testing

### CPU Stress

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: StressChaos
metadata:
  name: temple-api-cpu-stress
  namespace: temple-stack
spec:
  mode: one
  selector:
    namespaces:
    - temple-stack
    labelSelectors:
      app: temple-api
  stressors:
    cpu:
      workers: 2
      load: 80
  duration: "2m"
```

### Memory Stress

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: StressChaos
metadata:
  name: temple-api-memory-stress
  namespace: temple-stack
spec:
  mode: one
  selector:
    namespaces:
    - temple-stack
    labelSelectors:
      app: temple-api
  stressors:
    memory:
      workers: 1
      size: "512MB"
  duration: "1m"
```

## 🧪 Comprehensive Chaos Workflow

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: Workflow
metadata:
  name: temple-stack-chaos-workflow
  namespace: temple-stack
spec:
  entry: entry
  templates:
  - name: entry
    templateType: Serial
    deadline: 15m
    children:
    - pod-kill-test
    - network-delay-test
    - stress-test
  
  - name: pod-kill-test
    templateType: PodChaos
    deadline: 2m
    podChaos:
      action: pod-kill
      mode: one
      selector:
        namespaces:
        - temple-stack
        labelSelectors:
          app: temple-api
  
  - name: network-delay-test
    templateType: NetworkChaos
    deadline: 2m
    networkChaos:
      action: delay
      mode: all
      selector:
        namespaces:
        - temple-stack
        labelSelectors:
          app: temple-api
      delay:
        latency: "200ms"
  
  - name: stress-test
    templateType: StressChaos
    deadline: 2m
    stressChaos:
      mode: one
      selector:
        namespaces:
        - temple-stack
        labelSelectors:
          app: temple-api
      stressors:
        cpu:
          workers: 1
          load: 50
```

## ✅ Validation & Testing

```bash
# Apply chaos experiment
kubectl apply -f pod-kill-chaos.yaml

# Check chaos status
kubectl get podchaos -n temple-stack

# Describe chaos
kubectl describe podchaos temple-api-pod-kill -n temple-stack

# Monitor pod restarts
kubectl get pods -n temple-stack -w

# Delete chaos experiment
kubectl delete podchaos temple-api-pod-kill -n temple-stack

# View in dashboard
# http://localhost:2333
```

## 📊 Chaos Testing Checklist

- [ ] Pod failures - Does app recover?
- [ ] Network latency - Does UI remain responsive?
- [ ] Database unavailability - Does API handle gracefully?
- [ ] High CPU - Does HPA scale correctly?
- [ ] High memory - Does OOM protection work?
- [ ] Network partition - Does service mesh handle it?

## 🎯 Next Steps

**Next**: [Iteration 5.10: Cost Optimization](../5.10-cost-optimization/README.md)

Complete Level 5 with Kubernetes cost optimization strategies!
