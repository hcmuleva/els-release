# Iteration 5.4: Horizontal Pod Autoscaling (HPA)

**Duration**: ~2-3 hours  
**Difficulty**: ⭐⭐⭐⭐ Advanced

## 🎯 Learning Objectives

- ✅ Install Metrics Server
- ✅ Configure HPA based on CPU
- ✅ Configure HPA based on memory
- ✅ Use custom metrics for autoscaling
- ✅ Test autoscaling with load generation
- ✅ Implement Vertical Pod Autoscaler (VPA)

## 🚀 Install Metrics Server

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Verify
kubectl get deployment metrics-server -n kube-system
kubectl top nodes
kubectl top pods -n temple-stack
```

## 📊 CPU-Based HPA

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: temple-api-hpa
  namespace: temple-stack
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: temple-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
```

## 💾 Memory-Based HPA

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: temple-ui-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: temple-ui
  minReplicas: 2
  maxReplicas: 8
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## 🧪 Load Testing

```bash
# Install hey (HTTP load generator)
# macOS
brew install hey

# Generate load
hey -z 5m -c 50 -q 10 http://<temple-api-url>

# Watch HPA in action
kubectl get hpa -n temple-stack --watch

# Monitor pods scaling
kubectl get pods -n temple-stack --watch
```

## 📈 Custom Metrics HPA

Using Prometheus adapter for custom metrics:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: temple-api-custom-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: temple-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "1000"
```

## 📏 Vertical Pod Autoscaler (VPA)

```bash
# Install VPA
git clone https://github.com/kubernetes/autoscaler.git
cd autoscaler/vertical-pod-autoscaler
./hack/vpa-up.sh
```

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: temple-api-vpa
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
        cpu: 2
        memory: 2Gi
```

## ✅ Validation

```bash
# Check HPA status
kubectl get hpa -n temple-stack

# Describe HPA
kubectl describe hpa temple-api-hpa -n temple-stack

# Generate load and watch scaling
kubectl get hpa -n temple-stack --watch

# Check VPA recommendations
kubectl describe vpa temple-api-vpa
```

## 🎯 Next Steps

**Next**: [Iteration 5.5: RBAC and Security Policies](../5.5-rbac-security/README.md)
