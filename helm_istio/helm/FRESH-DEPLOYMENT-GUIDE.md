# ELS-LMS Stack - Fresh Deployment Guide

## 📋 Prerequisites Check

Before starting, ensure you have:

1. ✅ **Kubernetes Cluster** running (Minikube, Kind, Docker Desktop, or any K8s cluster)
2. ✅ **Istio Installed** (with demo profile including monitoring addons)
3. ✅ **kubectl** installed and configured
4. ✅ **Helm 3.x** installed
5. ✅ **HTTP enabled** (this laptop supports HTTP - confirmed)

---

## 🚀 Fresh Deployment Steps

### Step 1: Verify Istio is Installed

```bash
# Check Istio system namespace exists
kubectl get namespace istio-system

# Check Istio pods are running
kubectl get pods -n istio-system

# Should see:
# - istiod
# - istio-ingressgateway  
# - istio-egressgateway
# - grafana
# - kiali
# - prometheus
# - jaeger
```

**If Istio is NOT installed:**
```bash
# Download and install Istio
curl -L https://istio.io/downloadIstio | sh -
cd istio-*
export PATH=$PWD/bin:$PATH

# Install Istio with demo profile
istioctl install --set profile=demo -y

# Install monitoring addons
kubectl apply -f samples/addons/

# Wait for all components to be ready
kubectl wait --for=condition=available --timeout=600s deployment --all -n istio-system
```

---

### Step 2: Update /etc/hosts

```bash
# Add domain mapping
echo "127.0.0.1 elslms.local" | sudo tee -a /etc/hosts

# Verify the entry
cat /etc/hosts | grep elslms.local
```

---

### Step 3: Navigate to Helm Directory

```bash
cd /path/to/helm
# Or on your system:
# cd /Users/Harish.Muleva/project/experiments/m2m/dev-test-ops-pro/level1/development/helm
```

---

### Step 4: Deploy Using Automated Script

```bash
# Make sure scripts are executable
chmod +x deploy.sh test-deployment.sh cleanup.sh

# Run deployment
./deploy.sh
```

The script will:
- ✅ Check all prerequisites
- ✅ Verify Istio installation
- ✅ Update Helm dependencies
- ✅ Validate the chart
- ✅ Deploy all components
- ✅ Wait for pods to be ready

**Expected output:**
```
========================================
Deployment Complete!
========================================
```

---

### Step 5: Verify Deployment

```bash
# Check all pods are running with 2/2 containers (app + istio-proxy)
kubectl get pods -n els-lms

# Should see:
# els-lms-api-xxx      2/2   Running
# els-lms-ui-xxx       2/2   Running  
# els-lms-postgres-0   1/1   Running (no sidecar needed for DB)
```

```bash
# Check Istio resources
kubectl get gateway,virtualservice,destinationrule,peerauthentication -n els-lms

# Should see:
# gateway.networking.istio.io/els-lms-gateway
# virtualservice.networking.istio.io/els-lms-virtualservice
# destinationrule.networking.istio.io/els-lms-api-destinationrule
# destinationrule.networking.istio.io/els-lms-ui-destinationrule
# destinationrule.networking.istio.io/postgres-destinationrule
# peerauthentication.security.istio.io/default
```

```bash
# Check namespace has Istio injection enabled
kubectl get namespace els-lms --show-labels

# Should show: istio-injection=enabled
```

---

### Step 6: Port Forward Istio Ingress Gateway

**In a separate terminal (keep it running):**

```bash
kubectl port-forward -n istio-system service/istio-ingressgateway 80:80
```

**Output:**
```
Forwarding from 127.0.0.1:80 -> 8080
Forwarding from [::1]:80 -> 8080
```

⚠️ **Important:** Keep this terminal open. Open a new terminal for testing.

---

### Step 7: Test the Deployment

**Automated Testing:**
```bash
./test-deployment.sh
```

**Manual Testing:**
```bash
# Test UI
curl -I http://elslms.local/lmsclient

# Test API health
curl http://elslms.local/lmsserver/_health

# Test root path
curl -I http://elslms.local/

# Load test
for i in {1..20}; do
  curl -s http://elslms.local/lmsserver/_health > /dev/null
  echo "Request $i completed"
  sleep 0.5
done
```

---

### Step 8: Access in Browser

Open your browser and navigate to:

**Application URLs:**
- 🌐 **Main UI**: http://elslms.local/lmsclient
- 🌐 **API Server**: http://elslms.local/lmsserver
- 🌐 **Root**: http://elslms.local/

**Monitoring URLs** (if Istio addons are exposed via Gateway):
- 📊 **Kiali**: http://elslms.local/kiali
- 📈 **Prometheus**: http://elslms.local/prometheus
- 📉 **Grafana**: http://elslms.local/grafana
- 🔍 **Jaeger**: http://elslms.local/jaeger

**Alternatively, port-forward to access monitoring:**
```bash
# Kiali
kubectl port-forward -n istio-system service/kiali 20001:20001
# Access: http://localhost:20001

# Grafana
kubectl port-forward -n istio-system service/grafana 3000:3000
# Access: http://localhost:3000

# Prometheus
kubectl port-forward -n istio-system service/prometheus 9090:9090
# Access: http://localhost:9090

# Jaeger
kubectl port-forward -n istio-system service/tracing 16686:16686
# Access: http://localhost:16686
```

---

## 🔍 Verification Checklist

### ✅ Pod Status
```bash
kubectl get pods -n els-lms
```
**Expected:**
- All pods show `Running` status
- API and UI pods show `2/2` containers (app + istio-proxy sidecar)
- Postgres shows `1/1` container

### ✅ Services
```bash
kubectl get svc -n els-lms
```
**Expected:**
- els-lms-api (ClusterIP, port 1337)
- els-lms-ui (ClusterIP, port 80)
- els-lms-postgres (ClusterIP, port 5432)

### ✅ Istio Resources
```bash
kubectl get gateway,virtualservice,destinationrule -n els-lms
```
**Expected:**
- 1 Gateway (els-lms-gateway)
- 1 VirtualService (els-lms-virtualservice)
- 3 DestinationRules (api, ui, postgres)

### ✅ Istio Sidecar Injection
```bash
kubectl get namespace els-lms --show-labels
```
**Expected:** Label `istio-injection=enabled`

### ✅ HTTP Responses
```bash
curl -I http://elslms.local/lmsclient
```
**Expected:** HTTP 200 or HTTP 302 (NOT 308/301 redirect to HTTPS)

---

## 📊 View Service Mesh in Kiali

1. Access Kiali dashboard
2. Navigate to **Graph** section
3. Select namespace: `els-lms`
4. Generate some traffic:
   ```bash
   for i in {1..100}; do
     curl -s http://elslms.local/lmsserver/_health > /dev/null
     sleep 1
   done
   ```
5. Watch the service mesh graph update in real-time
6. Explore:
   - Traffic flow between services
   - Request rates and error rates
   - Response times
   - Circuit breaker status

---

## 🔧 Troubleshooting

### Issue: Pods stuck in Pending/ContainerCreating
```bash
# Check pod events
kubectl describe pod <pod-name> -n els-lms

# Check node resources
kubectl top nodes
```

### Issue: Pods show 1/2 containers (sidecar not injected)
```bash
# Check namespace label
kubectl get namespace els-lms --show-labels

# If missing, add it:
kubectl label namespace els-lms istio-injection=enabled

# Restart deployments
kubectl rollout restart deployment -n els-lms
```

### Issue: HTTP 308/301 redirects to HTTPS
This means the Istio ingress gateway is enforcing HTTPS. Check:
```bash
# Check gateway configuration
kubectl get gateway els-lms-gateway -n els-lms -o yaml

# Verify it's using HTTP only (port 80, protocol HTTP)
```

### Issue: Connection refused or timeout
```bash
# Check port-forward is running
ps aux | grep port-forward

# Restart port-forward
kubectl port-forward -n istio-system service/istio-ingressgateway 80:80
```

### Issue: Can't resolve elslms.local
```bash
# Verify /etc/hosts entry
cat /etc/hosts | grep elslms.local

# Test DNS resolution
ping elslms.local

# If ping doesn't work, try:
curl -H "Host: elslms.local" http://localhost/lmsclient
```

### View Logs
```bash
# Application logs
kubectl logs -n els-lms -l app=els-lms-api -c els-lms-api --tail=50
kubectl logs -n els-lms -l app=els-lms-ui -c els-lms-ui --tail=50

# Istio proxy logs
kubectl logs -n els-lms -l app=els-lms-api -c istio-proxy --tail=50

# Istio ingress gateway logs
kubectl logs -n istio-system -l app=istio-ingressgateway --tail=100
```

---

## 🧹 Cleanup (if needed)

```bash
# Run cleanup script
./cleanup.sh

# Or manually:
helm uninstall els-lms -n els-lms
kubectl delete namespace els-lms
```

---

## 📁 File Structure

Your helm directory should contain:

```
helm/
├── deploy.sh                    # Automated deployment script
├── test-deployment.sh           # Automated testing script
├── cleanup.sh                   # Cleanup script
├── values.yaml                  # Parent chart values
├── QUICK-START.md               # Quick reference
├── DEPLOYMENT-COMMANDS.md       # All commands reference
├── ISTIO-DEPLOYMENT.md          # Detailed Istio guide
├── ISTIO-SUMMARY.md             # Configuration summary
├── FRESH-DEPLOYMENT-GUIDE.md    # This file
└── els-lms-stack/               # Main chart
    ├── Chart.yaml
    ├── values.yaml              # Chart-specific values
    ├── templates/               # Istio templates
    │   ├── istio-gateway.yaml
    │   ├── istio-virtualservice.yaml
    │   ├── istio-destinationrules.yaml
    │   ├── istio-peerauthentication.yaml
    │   └── NOTES.txt
    └── charts/                  # Sub-charts
        ├── els-lms-api/
        ├── els-lms-ui/
        └── postgres/
```

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ All 3 pods are `Running` with correct container counts
2. ✅ Istio resources (Gateway, VirtualService, DestinationRules) exist in `els-lms` namespace
3. ✅ Namespace has `istio-injection=enabled` label
4. ✅ HTTP requests to `http://elslms.local/lmsclient` return HTTP 200 (not 308/301)
5. ✅ API health check returns success: `curl http://elslms.local/lmsserver/_health`
6. ✅ Browser can access `http://elslms.local/lmsclient`
7. ✅ Kiali shows service mesh topology with els-lms services
8. ✅ Test script passes all checks

---

## 🎯 Expected Test Results

When you run `./test-deployment.sh`, you should see:

```
=== 1. Testing Application Endpoints ===
Testing Root Path (/)... ✅ PASS
Testing LMS Client (/lmsclient)... ✅ PASS
Testing LMS Server Health (/lmsserver/_health)... ✅ PASS (HTTP 200)
Testing LMS Server Base (/lmsserver/)... ✅ PASS (HTTP 200 or 404)

=== 2. Testing Monitoring Endpoints ===
Testing Kiali (/kiali)... ✅ PASS
Testing Prometheus (/prometheus)... ✅ PASS
Testing Grafana (/grafana)... ✅ PASS
Testing Jaeger (/jaeger)... ✅ PASS

=== 3. Checking Kubernetes Resources ===
Pod Status: All pods Running with correct container counts
Services: All 3 services available
Istio Resources: Gateway, VirtualService, DestinationRules present

=== 4. Checking Pod Health ===
✅ All pods are ready

=== 5. Load Test (10 requests) ===
Success: 10/10, Failed: 0/10
✅ Load test passed
```

---

## 📞 Quick Command Reference

| Task | Command |
|------|---------|
| **Deploy** | `./deploy.sh` |
| **Test** | `./test-deployment.sh` |
| **Cleanup** | `./cleanup.sh` |
| **Port Forward** | `kubectl port-forward -n istio-system svc/istio-ingressgateway 80:80` |
| **Check Pods** | `kubectl get pods -n els-lms` |
| **Check Istio** | `kubectl get gateway,virtualservice,destinationrule -n els-lms` |
| **View Logs** | `kubectl logs -n els-lms <pod> -c <container>` |
| **Restart Pods** | `kubectl rollout restart deployment -n els-lms` |

---

## 🎉 You're Ready!

Follow these steps on your HTTP-enabled laptop and you should have a fully functional ELS-LMS stack with Istio service mesh!

For questions or issues, refer to:
- `DEPLOYMENT-COMMANDS.md` for detailed command reference
- `ISTIO-DEPLOYMENT.md` for Istio-specific information
- `QUICK-START.md` for quick deployment steps

**Happy Deploying! 🚀**
