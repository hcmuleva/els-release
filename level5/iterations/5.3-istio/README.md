# Iteration 5.3: Service Mesh with Istio

**Duration**: ~3-4 hours  
**Difficulty**: ⭐⭐⭐⭐⭐ Expert

## 🎯 Learning Objectives

- ✅ Install Istio service mesh
- ✅ Enable automatic sidecar injection
- ✅ Configure traffic management (routing, retries, timeouts)
- ✅ Implement circuit breakers
- ✅ Set up mutual TLS (mTLS)
- ✅ Visualize service mesh with Kiali

## 📚 What is Istio?

Istio provides:
- 🔀 **Traffic Management** - Smart routing, load balancing
- 🔒 **Security** - mTLS, authorization policies
- 📊 **Observability** - Metrics, traces, logs
- 🛡️ **Resilience** - Circuit breakers, retries, timeouts

## 🚀 Installation

### Install Istio

```bash
# Download Istio
curl -L https://istio.io/downloadIstio | sh -
cd istio-*
export PATH=$PWD/bin:$PATH

# Install Istio with demo profile
istioctl install --set profile=demo -y

# Enable sidecar injection for temple-stack namespace
kubectl label namespace temple-stack istio-injection=enabled

# Verify installation
kubectl get pods -n istio-system
```

### Install Addons (Kiali, Jaeger, Prometheus, Grafana)

```bash
kubectl apply -f samples/addons/
kubectl rollout status deployment/kiali -n istio-system
```

### Access Dashboards

```bash
# Kiali (Service Mesh Dashboard)
istioctl dashboard kiali

# Jaeger (Distributed Tracing)
istioctl dashboard jaeger

# Grafana (Metrics)
istioctl dashboard grafana
```

## 🔀 Traffic Management

### Gateway (Ingress)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: temple-gateway
  namespace: temple-stack
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*"
```

### VirtualService (Routing)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: temple-ui
  namespace: temple-stack
spec:
  hosts:
  - "*"
  gateways:
  - temple-gateway
  http:
  - match:
    - uri:
        prefix: /
    route:
    - destination:
        host: temple-ui-service
        port:
          number: 80
```

### Canary Deployment (90/10 split)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: temple-api-canary
spec:
  hosts:
  - temple-api-service
  http:
  - match:
    - headers:
        canary:
          exact: "true"
    route:
    - destination:
        host: temple-api-service
        subset: v2
  - route:
    - destination:
        host: temple-api-service
        subset: v1
      weight: 90
    - destination:
        host: temple-api-service
        subset: v2
      weight: 10
```

## 🛡️ Resilience Patterns

### Circuit Breaker

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: temple-api-circuit-breaker
spec:
  host: temple-api-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        maxRequestsPerConnection: 2
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
```

### Retries and Timeouts

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: temple-api-retry
spec:
  hosts:
  - temple-api-service
  http:
  - route:
    - destination:
        host: temple-api-service
    timeout: 10s
    retries:
      attempts: 3
      perTryTimeout: 2s
      retryOn: 5xx,reset,connect-failure
```

## 🔒 Security with mTLS

### Enable strict mTLS

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: temple-stack
spec:
  mtls:
    mode: STRICT
```

### Authorization Policy

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: temple-api-authz
  namespace: temple-stack
spec:
  selector:
    matchLabels:
      app: temple-api
  rules:
  - from:
    - source:
        namespaces: ["temple-stack"]
    to:
    - operation:
        methods: ["GET", "POST"]
```

## ✅ Validation

```bash
# Check Istio installation
istioctl verify-install

# Check sidecar injection
kubectl get pods -n temple-stack
# Should see 2/2 containers (app + envoy sidecar)

# View mesh topology in Kiali
istioctl dashboard kiali

# Generate traffic
for i in {1..100}; do
  curl http://temple-ui.local
done

# View distributed traces in Jaeger
istioctl dashboard jaeger
```

## 🎯 Next Steps

**Next**: [Iteration 5.4: Horizontal Pod Autoscaling](../5.4-autoscaling/README.md)

Configure auto-scaling based on CPU, memory, and custom metrics.
