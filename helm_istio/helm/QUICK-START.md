# ELS-LMS Stack with Istio - Quick Start Guide

## 🚀 Quick Deployment (3 Steps)

### Step 1: Install Istio (First Time Only)
```bash
# Download and install Istio
curl -L https://istio.io/downloadIstio | sh -
cd istio-*
export PATH=$PWD/bin:$PATH
istioctl install --set profile=demo -y

# Install monitoring addons
kubectl apply -f samples/addons/
```

### Step 2: Update /etc/hosts
```bash
echo "127.0.0.1 elslms.local" | sudo tee -a /etc/hosts
```

### Step 3: Deploy
```bash
cd /Users/Harish.Muleva/project/experiments/m2m/dev-test-ops-pro/level1/development/helm
./deploy.sh
```

## 🔗 Access Services

### Port Forward (Required)
Open a terminal and run:
```bash
kubectl port-forward -n istio-system service/istio-ingressgateway 80:80
```
**Keep this terminal open!**

### Application URLs
- **LMS Client**: http://elslms.local/lmsclient
- **LMS Server**: http://elslms.local/lmsserver
- **Root**: http://elslms.local/

### Monitoring URLs
- **Kiali**: http://elslms.local/kiali
- **Prometheus**: http://elslms.local/prometheus
- **Grafana**: http://elslms.local/grafana
- **Jaeger**: http://elslms.local/jaeger

## ✅ Testing

Run the test script:
```bash
./test-deployment.sh
```

Or test manually:
```bash
# Test UI
curl http://elslms.local/lmsclient

# Test API
curl http://elslms.local/lmsserver/_health

# Test monitoring
curl http://elslms.local/kiali
```

## 📊 View Service Mesh

1. Open Kiali: http://elslms.local/kiali
2. Go to "Graph" → Select namespace: `els-lms`
3. Generate traffic:
```bash
for i in {1..50}; do curl -s http://elslms.local/lmsserver/_health > /dev/null; sleep 1; done
```
4. Watch the service mesh graph update in real-time

## 🔍 Check Status

```bash
# Check pods (should show 2/2 containers)
kubectl get pods -n els-lms

# Check Istio resources
kubectl get gateway,virtualservice,destinationrule -n els-lms

# Check logs
kubectl logs -n els-lms -l app=els-lms-api -c els-lms-api
kubectl logs -n els-lms -l app=els-lms-ui -c els-lms-ui
```

## 🔄 Update Deployment

```bash
# After making changes
helm upgrade els-lms els-lms-stack/ -n els-lms
```

## 🗑️ Cleanup

```bash
# Remove deployment
helm uninstall els-lms -n els-lms

# Delete namespace
kubectl delete namespace els-lms

# Remove from /etc/hosts
sudo sed -i '' '/elslms.local/d' /etc/hosts
```

## 📚 Documentation

- **Full Deployment Guide**: `ISTIO-DEPLOYMENT.md`
- **All Commands**: `DEPLOYMENT-COMMANDS.md`
- **Configuration Summary**: `ISTIO-SUMMARY.md`

## ⚠️ Troubleshooting

### Can't access elslms.local?
1. Check port-forward is running
2. Verify /etc/hosts entry: `cat /etc/hosts | grep elslms.local`
3. Check pods are ready: `kubectl get pods -n els-lms`

### Pods not ready?
```bash
# Check pod details
kubectl describe pod -n els-lms <pod-name>

# Check logs
kubectl logs -n els-lms <pod-name> -c <container-name>
```

### Istio issues?
```bash
# Verify Istio is installed
kubectl get pods -n istio-system

# Check Istio configuration
istioctl analyze -n els-lms

# Check proxy status
istioctl proxy-status
```

## 🎯 What You Get

✅ Single unified domain (`elslms.local`)
✅ Path-based routing for services
✅ Istio service mesh
✅ Automatic sidecar injection
✅ Load balancing & circuit breaking
✅ Retry policies & timeouts
✅ mTLS support
✅ Full monitoring stack (Kiali, Prometheus, Grafana, Jaeger)
✅ Service mesh visualization
✅ Distributed tracing
✅ Metrics & dashboards

## 📞 Quick Commands Reference

| Action | Command |
|--------|---------|
| Deploy | `./deploy.sh` |
| Test | `./test-deployment.sh` |
| Port Forward | `kubectl port-forward -n istio-system svc/istio-ingressgateway 80:80` |
| Check Pods | `kubectl get pods -n els-lms` |
| View Logs | `kubectl logs -n els-lms <pod-name> -c <container>` |
| Upgrade | `helm upgrade els-lms els-lms-stack/ -n els-lms` |
| Uninstall | `helm uninstall els-lms -n els-lms` |

---

**Ready to deploy?** Run `./deploy.sh` and follow the instructions! 🚀
