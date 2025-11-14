# ELS-LMS Stack with Istio - Deployment Guide

## Overview
This Helm chart deploys the ELS-LMS stack with Istio service mesh enabled, providing advanced traffic management, security, and observability features.

## Prerequisites

1. **Kubernetes Cluster** (Minikube, Kind, or any K8s cluster)
2. **Istio Installed** on the cluster
3. **kubectl** configured to access your cluster
4. **Helm 3.x** installed
5. **Local DNS Configuration** (for local deployment)

## Istio Installation

If Istio is not already installed, install it:

```bash
# Download Istio
curl -L https://istio.io/downloadIstio | sh -
cd istio-*
export PATH=$PWD/bin:$PATH

# Install Istio with demo profile (includes monitoring tools)
istioctl install --set profile=demo -y

# Install Istio addons (Kiali, Prometheus, Grafana, Jaeger)
kubectl apply -f samples/addons/
kubectl rollout status deployment/kiali -n istio-system
kubectl rollout status deployment/prometheus -n istio-system
kubectl rollout status deployment/grafana -n istio-system
kubectl rollout status deployment/jaeger -n istio-system
```

## Local Deployment Setup

### 1. Update /etc/hosts

Add the following entry to your `/etc/hosts` file:

```bash
127.0.0.1 elslms.local
```

### 2. Deploy the Helm Chart

```bash
# Navigate to the helm directory
cd /Users/Harish.Muleva/project/experiments/m2m/dev-test-ops-pro/level1/development/helm

# Update dependencies
helm dependency update els-lms-stack/

# Install the chart
helm install els-lms els-lms-stack/ -n els-lms --create-namespace

# Verify installation
kubectl get pods -n els-lms
kubectl get gateway -n els-lms
kubectl get virtualservice -n els-lms
```

### 3. Expose Istio Ingress Gateway

For local development, port-forward the Istio ingress gateway:

```bash
kubectl port-forward -n istio-system service/istio-ingressgateway 80:80 &
```

## Accessing Services

Once deployed, you can access the following services via the unified `elslms.local` domain:

### Application Services
- **LMS Client (UI)**: http://elslms.local/lmsclient
- **LMS Server (API)**: http://elslms.local/lmsserver
- **Root Path (redirects to UI)**: http://elslms.local/

### Monitoring Services
- **Kiali (Service Mesh Dashboard)**: http://elslms.local/kiali
- **Prometheus (Metrics)**: http://elslms.local/prometheus
- **Grafana (Dashboards)**: http://elslms.local/grafana
- **Jaeger (Tracing)**: http://elslms.local/jaeger

## Architecture

### Istio Components

1. **Gateway**: Entry point for external traffic on port 80
2. **VirtualService**: Routes traffic to appropriate services based on path:
   - `/lmsserver` → els-lms-api service (port 1337)
   - `/lmsclient` → els-lms-ui service (port 80)
   - `/` → els-lms-ui service (default)
3. **DestinationRules**: Configure traffic policies, load balancing, and circuit breaking
4. **PeerAuthentication**: Enable mutual TLS (mTLS) in PERMISSIVE mode

### Monitoring Stack

- **Kiali**: Service mesh observability, topology visualization
- **Prometheus**: Metrics collection and storage
- **Grafana**: Metrics visualization with pre-built dashboards
- **Jaeger**: Distributed tracing for request flows

## Configuration

### Key Values in values.yaml

```yaml
global:
  namespace: els-lms
  domain: elslms.local
  istio:
    enabled: true
    gateway:
      name: els-lms-gateway
    monitoring:
      kiali:
        enabled: true
      prometheus:
        enabled: true
      grafana:
        enabled: true
      jaeger:
        enabled: true
```

## Traffic Management Features

### Load Balancing
- Round-robin load balancing across service instances
- Connection pooling with configurable limits

### Circuit Breaking
- Outlier detection enabled
- Automatic ejection of unhealthy instances
- Configurable error thresholds

### Retry Policy
- Automatic retries on 5xx errors
- 3 attempts with 10s timeout per attempt
- Applied to critical service routes

### CORS Support
- Configured for cross-origin requests
- Allows all common HTTP methods
- Credential support enabled

## Monitoring and Observability

### Kiali Dashboard
- View service topology and traffic flow
- Monitor service health and performance
- Configure traffic routing rules
- View metrics and traces integrated with Prometheus and Jaeger

### Prometheus Metrics
- Service-level metrics (request rate, error rate, duration)
- Resource utilization metrics
- Custom application metrics

### Grafana Dashboards
- Pre-built Istio dashboards
- Service mesh performance metrics
- Resource utilization graphs

### Jaeger Tracing
- End-to-end request tracing
- Performance bottleneck identification
- Service dependency analysis

## Troubleshooting

### Check Istio Injection
```bash
kubectl get namespace els-lms --show-labels
# Should show: istio-injection=enabled
```

### Verify Pod Sidecar
```bash
kubectl get pods -n els-lms
# Each pod should have 2/2 containers (app + istio-proxy)
```

### Check Gateway Status
```bash
kubectl get gateway -n els-lms
kubectl describe gateway els-lms-gateway -n els-lms
```

### View Logs
```bash
# Application logs
kubectl logs -n els-lms <pod-name> -c <container-name>

# Istio proxy logs
kubectl logs -n els-lms <pod-name> -c istio-proxy
```

### Access Istio Ingress Gateway Logs
```bash
kubectl logs -n istio-system -l app=istio-ingressgateway
```

## Uninstall

```bash
# Uninstall the helm release
helm uninstall els-lms -n els-lms

# Delete the namespace
kubectl delete namespace els-lms

# Optionally uninstall Istio
istioctl uninstall --purge -y
```

## Advanced Configuration

### Enable Strict mTLS

Edit `templates/istio-peerauthentication.yaml`:
```yaml
spec:
  mtls:
    mode: STRICT
```

### Adjust Circuit Breaker Settings

Edit `templates/istio-destinationrules.yaml`:
```yaml
outlierDetection:
  consecutiveErrors: 3
  interval: 10s
  baseEjectionTime: 30s
  maxEjectionPercent: 50
```

### Add Custom Metrics

Configure Istio telemetry to expose custom application metrics to Prometheus.

## Support

For issues or questions, refer to:
- Istio Documentation: https://istio.io/latest/docs/
- Helm Documentation: https://helm.sh/docs/
- Kubernetes Documentation: https://kubernetes.io/docs/
