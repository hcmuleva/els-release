# Transfer Checklist for Fresh Deployment

## 📦 Files to Transfer to Your Other Laptop

Transfer the entire `helm/` directory to your HTTP-enabled laptop.

### ✅ Required Files Checklist

#### Root Level Scripts & Documentation
- ✅ `deploy.sh` - Automated deployment script
- ✅ `test-deployment.sh` - Automated testing script
- ✅ `cleanup.sh` - Cleanup script
- ✅ `values.yaml` - Parent chart values
- ✅ `Chart.yaml` - Parent chart metadata
- ✅ `FRESH-DEPLOYMENT-GUIDE.md` - **START HERE** on new laptop
- ✅ `QUICK-START.md` - Quick reference guide
- ✅ `DEPLOYMENT-COMMANDS.md` - Complete command reference
- ✅ `ISTIO-DEPLOYMENT.md` - Detailed Istio guide
- ✅ `ISTIO-SUMMARY.md` - Configuration summary

#### Chart Directory (els-lms-stack/)
- ✅ `els-lms-stack/Chart.yaml` - Chart metadata
- ✅ `els-lms-stack/values.yaml` - Chart values with Istio config
- ✅ `els-lms-stack/Chart.lock` - Dependency lock file
- ✅ `els-lms-stack/README.md` - Chart readme

#### Istio Templates (els-lms-stack/templates/)
- ✅ `istio-gateway.yaml` - Istio Gateway configuration
- ✅ `istio-virtualservice.yaml` - Path-based routing rules
- ✅ `istio-destinationrules.yaml` - Traffic policies
- ✅ `istio-peerauthentication.yaml` - mTLS configuration
- ✅ `NOTES.txt` - Post-deployment notes

#### Sub-Charts (els-lms-stack/charts/)
- ✅ `els-lms-api/` - API server chart
- ✅ `els-lms-ui/` - UI client chart
- ✅ `postgres/` - PostgreSQL database chart

---

## 🚀 On Your HTTP-Enabled Laptop

### Step 1: Verify Prerequisites

```bash
# Check kubectl
kubectl version --client

# Check helm
helm version

# Check Kubernetes cluster
kubectl cluster-info

# Check Istio (should be installed)
kubectl get namespace istio-system
kubectl get pods -n istio-system
```

### Step 2: Navigate to Transferred Directory

```bash
cd /path/to/transferred/helm
```

### Step 3: Make Scripts Executable

```bash
chmod +x deploy.sh test-deployment.sh cleanup.sh
```

### Step 4: Add Domain to /etc/hosts

```bash
echo "127.0.0.1 elslms.local" | sudo tee -a /etc/hosts
```

### Step 5: Deploy

```bash
# Read the guide first
cat FRESH-DEPLOYMENT-GUIDE.md

# Then deploy
./deploy.sh
```

### Step 6: Port Forward

**In a separate terminal:**
```bash
kubectl port-forward -n istio-system service/istio-ingressgateway 80:80
```

### Step 7: Test

```bash
./test-deployment.sh
```

### Step 8: Access in Browser

Open: http://elslms.local/lmsclient

---

## 🔍 What to Verify After Deployment

### 1. Pods Status
```bash
kubectl get pods -n els-lms
```
**Expected:**
```
NAME                           READY   STATUS    RESTARTS   AGE
els-lms-api-xxx                2/2     Running   0          2m
els-lms-postgres-0             1/1     Running   0          2m
els-lms-ui-xxx                 2/2     Running   0          2m
```

### 2. Istio Resources
```bash
kubectl get gateway,virtualservice,destinationrule -n els-lms
```
**Expected:**
```
NAME                                          AGE
gateway.networking.istio.io/els-lms-gateway   2m

NAME                                                        GATEWAYS              HOSTS              AGE
virtualservice.networking.istio.io/els-lms-virtualservice   ["els-lms-gateway"]   ["elslms.local"]   2m

NAME                                                              HOST                                         AGE
destinationrule.networking.istio.io/els-lms-api-destinationrule   els-lms-api.els-lms.svc.cluster.local        2m
destinationrule.networking.istio.io/els-lms-ui-destinationrule    els-lms-ui.els-lms.svc.cluster.local         2m
destinationrule.networking.istio.io/postgres-destinationrule      els-lms-postgres.els-lms.svc.cluster.local   2m
```

### 3. HTTP Access (NOT HTTPS redirect)
```bash
curl -I http://elslms.local/lmsclient
```
**Expected:** HTTP 200 or HTTP 302 (NOT 308 or 301)

### 4. API Health Check
```bash
curl http://elslms.local/lmsserver/_health
```
**Expected:** Empty response or JSON (HTTP 200)

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     elslms.local                        │
│                          │                              │
│                          ▼                              │
│              Istio Ingress Gateway (Port 80)            │
│                          │                              │
│                          ▼                              │
│            Istio Gateway (els-lms-gateway)              │
│                          │                              │
│                          ▼                              │
│         Istio VirtualService (Path Routing)             │
│                    │            │                       │
│         ┌──────────┴────────────┴──────────┐            │
│         ▼                                  ▼            │
│  /lmsclient (/UI)                    /lmsserver (API)   │
│         │                                  │            │
│         ▼                                  ▼            │
│   els-lms-ui                          els-lms-api       │
│   (Port 80)                           (Port 1337)       │
│   [2/2 containers]                    [2/2 containers]  │
│   - nginx                             - strapi          │
│   - istio-proxy                       - istio-proxy     │
│                                            │            │
│                                            ▼            │
│                                      els-lms-postgres   │
│                                      (Port 5432)        │
│                                      [1/1 container]    │
│                                      - postgres         │
└─────────────────────────────────────────────────────────┘

Monitoring (existing Istio installation):
- Kiali (Service Mesh Dashboard)
- Prometheus (Metrics)
- Grafana (Visualization)
- Jaeger (Tracing)
```

---

## 🎯 Success Indicators

✅ **Deployment Successful If:**

1. All pods show `Running` status
2. API and UI pods have `2/2` containers (with Istio sidecar)
3. Istio Gateway, VirtualService, and DestinationRules exist
4. Namespace `els-lms` has label `istio-injection=enabled`
5. HTTP requests (not HTTPS) return 200/302 responses
6. Browser can access http://elslms.local/lmsclient
7. Test script passes all checks
8. Kiali dashboard shows els-lms services in topology

---

## 🐛 Common Issues & Solutions

### Issue: HTTP 308 Redirect to HTTPS

**Cause:** Istio ingress gateway is enforcing HTTPS
**Solution:** This is an Istio gateway configuration issue. Your deployment is correct.

To test directly:
```bash
kubectl port-forward -n els-lms service/els-lms-ui 8080:80
curl http://localhost:8080
```

### Issue: Pods Stuck at 1/2 Containers

**Cause:** Istio sidecar not injected
**Solution:**
```bash
kubectl label namespace els-lms istio-injection=enabled --overwrite
kubectl rollout restart deployment -n els-lms
```

### Issue: Can't Reach elslms.local

**Cause:** /etc/hosts not configured or port-forward not running
**Solution:**
```bash
# Check /etc/hosts
cat /etc/hosts | grep elslms.local

# Check port-forward
ps aux | grep "port-forward"

# Restart port-forward
kubectl port-forward -n istio-system service/istio-ingressgateway 80:80
```

---

## 📝 Important Notes

1. **Istio Must Be Installed First** - The deployment assumes Istio is already installed with monitoring addons
2. **Keep Port-Forward Running** - The port-forward terminal must stay open
3. **HTTP Support Required** - This laptop (where you're deploying) must support HTTP connections
4. **Namespace Isolation** - All resources are deployed in the `els-lms` namespace
5. **Monitoring Access** - Use existing Istio monitoring tools via port-forward if needed

---

## 🔄 If You Need to Redeploy

```bash
# Clean up
./cleanup.sh

# Wait a few seconds
sleep 5

# Deploy again
./deploy.sh
```

---

## 📞 Quick Help

**Start Here:** `FRESH-DEPLOYMENT-GUIDE.md`
**Commands:** `DEPLOYMENT-COMMANDS.md`
**Quick Ref:** `QUICK-START.md`
**Istio Info:** `ISTIO-DEPLOYMENT.md`

---

## ✅ Verification Commands Summary

```bash
# All in one check
kubectl get pods,svc,gateway,virtualservice,destinationrule -n els-lms

# Namespace label
kubectl get namespace els-lms --show-labels

# Test endpoints
curl -I http://elslms.local/lmsclient
curl http://elslms.local/lmsserver/_health

# Run full test
./test-deployment.sh
```

---

**You're all set! Transfer the helm/ directory and follow FRESH-DEPLOYMENT-GUIDE.md on your other laptop. Good luck! 🚀**
