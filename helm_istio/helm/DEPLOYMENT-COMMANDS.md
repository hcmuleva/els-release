# ELS-LMS Stack with Istio - Deployment & Testing Commands

## Prerequisites Setup

### 1. Update /etc/hosts
```bash
# Add domain mapping for local deployment
echo "127.0.0.1 elslms.local" | sudo tee -a /etc/hosts

# Verify the entry
cat /etc/hosts | grep elslms.local
```

### 2. Install Istio (if not already installed)

```bash
# Download Istio
curl -L https://istio.io/downloadIstio | sh -

# Navigate to Istio directory
cd istio-*
export PATH=$PWD/bin:$PATH

# Install Istio with demo profile (includes all monitoring tools)
istioctl install --set profile=demo -y

# Verify Istio installation
kubectl get pods -n istio-system

# Install monitoring addons (Kiali, Prometheus, Grafana, Jaeger)
kubectl apply -f samples/addons/

# Wait for all monitoring tools to be ready
kubectl rollout status deployment/kiali -n istio-system
kubectl rollout status deployment/prometheus -n istio-system
kubectl rollout status deployment/grafana -n istio-system
kubectl rollout status deployment/jaeger -n istio-system
```

## Deployment Commands

### 1. Navigate to Helm Directory
```bash
cd /Users/Harish.Muleva/project/experiments/m2m/dev-test-ops-pro/level1/development/helm
```

### 2. Update Helm Dependencies
```bash
# Update dependencies for the chart
helm dependency update els-lms-stack/

# Verify dependencies
helm dependency list els-lms-stack/
```

### 3. Validate Helm Chart
```bash
# Lint the chart for any issues
helm lint els-lms-stack/

# Dry-run to see what will be deployed
helm install els-lms els-lms-stack/ -n els-lms --create-namespace --dry-run --debug
```

### 4. Install the Helm Chart
```bash
# Install the chart
helm install els-lms els-lms-stack/ -n els-lms --create-namespace

# Watch the deployment progress
kubectl get pods -n els-lms -w
```

### 5. Port Forward Istio Ingress Gateway
```bash
# Port forward to access services locally
kubectl port-forward -n istio-system service/istio-ingressgateway 80:80
```

**Note**: Keep this terminal open. Open a new terminal for testing.

## Verification Commands

### Check Namespace and Istio Injection
```bash
# Verify namespace has Istio injection enabled
kubectl get namespace els-lms --show-labels

# Should show: istio-injection=enabled
```

### Check Pod Status
```bash
# List all pods (should show 2/2 containers - app + istio-proxy)
kubectl get pods -n els-lms

# Get detailed pod information
kubectl get pods -n els-lms -o wide

# Check specific pod details
kubectl describe pod <pod-name> -n els-lms
```

### Check Istio Resources
```bash
# Check Gateway
kubectl get gateway -n els-lms
kubectl describe gateway els-lms-gateway -n els-lms

# Check VirtualService
kubectl get virtualservice -n els-lms
kubectl describe virtualservice els-lms-virtualservice -n els-lms

# Check DestinationRules
kubectl get destinationrule -n els-lms
kubectl describe destinationrule -n els-lms

# Check PeerAuthentication
kubectl get peerauthentication -n els-lms
```

### Check Services
```bash
# List all services
kubectl get svc -n els-lms

# Check service endpoints
kubectl get endpoints -n els-lms
```

### Check Logs
```bash
# Application logs
kubectl logs -n els-lms deployment/default-els-lms-api -c els-lms-api

# Istio proxy logs
kubectl logs -n els-lms deployment/default-els-lms-api -c istio-proxy

# UI logs
kubectl logs -n els-lms deployment/default-els-lms-ui -c els-lms-ui

# Postgres logs
kubectl logs -n els-lms deployment/default-postgres -c postgres

# Istio ingress gateway logs
kubectl logs -n istio-system -l app=istio-ingressgateway --tail=100 -f
```

## Testing Commands

### 1. Test Application Endpoints

```bash
# Test LMS Client (UI) - Root path
curl -I http://elslms.local/

# Test LMS Client (UI) - Full path
curl -I http://elslms.local/lmsclient

# Test LMS Server (API) - Health check
curl http://elslms.local/lmsserver/_health

# Test LMS Server (API) - Base endpoint
curl http://elslms.local/lmsserver/
```

### 2. Test Monitoring Endpoints

```bash
# Test Kiali
curl -I http://elslms.local/kiali

# Test Prometheus
curl -I http://elslms.local/prometheus

# Test Grafana
curl -I http://elslms.local/grafana

# Test Jaeger
curl -I http://elslms.local/jaeger
```

### 3. Browser Testing

Open your browser and access:

**Application URLs:**
- http://elslms.local/
- http://elslms.local/lmsclient
- http://elslms.local/lmsserver

**Monitoring URLs:**
- http://elslms.local/kiali (Service Mesh Dashboard)
- http://elslms.local/prometheus (Metrics)
- http://elslms.local/grafana (Dashboards)
- http://elslms.local/jaeger (Tracing)

### 4. Test Traffic Flow with Load

```bash
# Generate some load to see traffic in Kiali
for i in {1..100}; do
  curl -s http://elslms.local/lmsserver/_health > /dev/null
  echo "Request $i completed"
  sleep 1
done
```

### 5. View in Kiali

1. Open http://elslms.local/kiali
2. Go to "Graph" section
3. Select namespace: `els-lms`
4. You should see traffic flow between services

## Advanced Testing

### Test Circuit Breaking
```bash
# Generate high load to trigger circuit breaker
for i in {1..200}; do
  curl -s http://elslms.local/lmsserver/ &
done
wait

# Check DestinationRule status
kubectl describe destinationrule els-lms-api-destinationrule -n els-lms
```

### Test Retry Policy
```bash
# Monitor retries in logs
kubectl logs -n els-lms deployment/default-els-lms-api -c istio-proxy -f | grep retry
```

### Test mTLS
```bash
# Check mTLS status
istioctl authn tls-check -n els-lms
```

### View Metrics in Prometheus
```bash
# Example queries to run in Prometheus UI (http://elslms.local/prometheus)

# Request rate
rate(istio_requests_total{destination_service_namespace="els-lms"}[5m])

# Error rate
rate(istio_requests_total{destination_service_namespace="els-lms",response_code=~"5.."}[5m])

# Request duration
histogram_quantile(0.99, rate(istio_request_duration_milliseconds_bucket{destination_service_namespace="els-lms"}[5m]))
```

## Troubleshooting Commands

### Check Istio Configuration
```bash
# Validate Istio configuration
istioctl analyze -n els-lms

# Check proxy status
istioctl proxy-status

# Get proxy configuration
istioctl proxy-config routes -n els-lms <pod-name>
istioctl proxy-config clusters -n els-lms <pod-name>
istioctl proxy-config endpoints -n els-lms <pod-name>
```

### Debug Connection Issues
```bash
# Test connectivity from within a pod
kubectl exec -n els-lms <pod-name> -c els-lms-api -- curl http://localhost:1337/_health

# Check DNS resolution
kubectl exec -n els-lms <pod-name> -c els-lms-api -- nslookup default-els-lms-api.els-lms.svc.cluster.local
```

### Check Helm Release
```bash
# List Helm releases
helm list -n els-lms

# Get release values
helm get values els-lms -n els-lms

# Get release manifest
helm get manifest els-lms -n els-lms

# Check release history
helm history els-lms -n els-lms
```

## Update/Upgrade Commands

### Upgrade Helm Release
```bash
# After making changes to values or templates
helm upgrade els-lms els-lms-stack/ -n els-lms

# Upgrade with specific values file
helm upgrade els-lms els-lms-stack/ -n els-lms -f custom-values.yaml

# Watch the rollout
kubectl rollout status deployment -n els-lms
```

### Rollback if Needed
```bash
# Rollback to previous version
helm rollback els-lms -n els-lms

# Rollback to specific revision
helm rollback els-lms <revision-number> -n els-lms
```

## Cleanup Commands

### Uninstall Everything
```bash
# Uninstall Helm release
helm uninstall els-lms -n els-lms

# Delete namespace
kubectl delete namespace els-lms

# Delete Istio (optional)
istioctl uninstall --purge -y
kubectl delete namespace istio-system

# Remove from /etc/hosts
sudo sed -i '' '/elslms.local/d' /etc/hosts
```

## Complete End-to-End Test Script

Create a test script:

```bash
#!/bin/bash

echo "=== ELS-LMS Stack Testing ==="

echo "1. Testing LMS Client (UI)..."
if curl -f -s http://elslms.local/ > /dev/null; then
  echo "✅ Root path accessible"
else
  echo "❌ Root path failed"
fi

if curl -f -s http://elslms.local/lmsclient > /dev/null; then
  echo "✅ LMS Client accessible"
else
  echo "❌ LMS Client failed"
fi

echo "2. Testing LMS Server (API)..."
if curl -f -s http://elslms.local/lmsserver/_health > /dev/null; then
  echo "✅ LMS Server health check passed"
else
  echo "❌ LMS Server health check failed"
fi

echo "3. Testing Monitoring Services..."
if curl -f -s -I http://elslms.local/kiali > /dev/null; then
  echo "✅ Kiali accessible"
else
  echo "❌ Kiali failed"
fi

if curl -f -s -I http://elslms.local/prometheus > /dev/null; then
  echo "✅ Prometheus accessible"
else
  echo "❌ Prometheus failed"
fi

if curl -f -s -I http://elslms.local/grafana > /dev/null; then
  echo "✅ Grafana accessible"
else
  echo "❌ Grafana failed"
fi

if curl -f -s -I http://elslms.local/jaeger > /dev/null; then
  echo "✅ Jaeger accessible"
else
  echo "❌ Jaeger failed"
fi

echo "4. Checking Pod Status..."
kubectl get pods -n els-lms

echo "5. Checking Istio Resources..."
kubectl get gateway,virtualservice,destinationrule -n els-lms

echo "=== Testing Complete ==="
```

Save as `test-deployment.sh`, make executable, and run:

```bash
chmod +x test-deployment.sh
./test-deployment.sh
```

## Expected Output

### Successful Pod Status:
```
NAME                                READY   STATUS    RESTARTS   AGE
default-els-lms-api-xxx             2/2     Running   0          5m
default-els-lms-ui-xxx              2/2     Running   0          5m
default-postgres-xxx                2/2     Running   0          5m
```

### Successful Service Access:
- All curl commands return HTTP 200 or 302
- Browser displays application UI
- Kiali shows service mesh topology
- Prometheus shows metrics
- Grafana displays dashboards
- Jaeger shows traces

## Quick Reference

| Task | Command |
|------|---------|
| Install | `helm install els-lms els-lms-stack/ -n els-lms --create-namespace` |
| Upgrade | `helm upgrade els-lms els-lms-stack/ -n els-lms` |
| Uninstall | `helm uninstall els-lms -n els-lms` |
| Check Pods | `kubectl get pods -n els-lms` |
| Check Logs | `kubectl logs -n els-lms <pod-name> -c <container>` |
| Port Forward | `kubectl port-forward -n istio-system svc/istio-ingressgateway 80:80` |
| Analyze Istio | `istioctl analyze -n els-lms` |
| View Topology | Open http://elslms.local/kiali |

## Support & Documentation

- Full Deployment Guide: `ISTIO-DEPLOYMENT.md`
- Configuration Summary: `ISTIO-SUMMARY.md`
- This Commands Reference: `DEPLOYMENT-COMMANDS.md`
