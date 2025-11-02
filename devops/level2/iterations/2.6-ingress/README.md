# Iteration 2.6: Ingress Configuration

**Duration**: ~1.5-2 hours  
**Difficulty**: ⭐⭐⭐⭐ Advanced

## 🎯 Learning Objectives

- ✅ Understand Kubernetes Ingress
- ✅ Install NGINX Ingress Controller
- ✅ Configure path-based routing
- ✅ Configure host-based routing
- ✅ Enable TLS/SSL
- ✅ Configure URL rewrites

## 📚 Background

**Ingress** provides HTTP/HTTPS routing to services. Think of it as a Layer 7 load balancer.

**Why Ingress?**
- Single entry point for multiple services
- Path-based routing (`/api` → API service, `/` → UI service)
- Host-based routing (`api.example.com` → API, `www.example.com` → UI)
- TLS termination
- URL rewriting

```
Internet
    ↓
Ingress Controller (NGINX)
    ↓ routes based on rules
┌───────────┬──────────┐
│  API Svc  │  UI Svc  │
└───────────┴──────────┘
```

## 🛠️ Hands-On Exercise

### Task 1: Install NGINX Ingress Controller

```bash
# Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Wait for controller to be ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

# Verify
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx
```

### Task 2: Create Ingress for Temple Stack

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: temple-stack-ingress
  namespace: level2
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      # API routing
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: temple-api-service
            port:
              number: 1337
      
      # Admin panel routing
      - path: /admin
        pathType: Prefix
        backend:
          service:
            name: temple-api-service
            port:
              number: 1337
      
      # UI routing (default/fallback)
      - path: /
        pathType: Prefix
        backend:
          service:
            name: temple-ui-service
            port:
              number: 80
```

Apply and test:

```bash
kubectl apply -f temple-ingress.yaml

# Get ingress
kubectl get ingress -n level2

# Access application
curl http://localhost/
curl http://localhost/api
curl http://localhost/admin
```

### Task 3: Host-Based Routing

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: temple-hosts-ingress
  namespace: level2
spec:
  ingressClassName: nginx
  rules:
  # API subdomain
  - host: api.temple.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: temple-api-service
            port:
              number: 1337
  
  # UI main domain
  - host: temple.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: temple-ui-service
            port:
              number: 80
```

Update `/etc/hosts`:
```bash
sudo sh -c 'echo "127.0.0.1 temple.local api.temple.local" >> /etc/hosts'
```

Test:
```bash
curl http://temple.local
curl http://api.temple.local
```

### Task 4: Enable TLS/HTTPS

```bash
# Create self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout tls.key -out tls.crt \
  -subj "/CN=temple.local/O=temple.local"

# Create TLS secret
kubectl create secret tls temple-tls \
  --cert=tls.crt --key=tls.key \
  -n level2
```

Update Ingress:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: temple-tls-ingress
  namespace: level2
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - temple.local
    - api.temple.local
    secretName: temple-tls
  rules:
  # ... same as before
```

Test HTTPS:
```bash
curl -k https://temple.local
curl -k https://api.temple.local
```

## ✅ Validation

```bash
# Ingress controller running
kubectl get pods -n ingress-nginx

# Ingress created
kubectl get ingress -n level2

# Ingress rules
kubectl describe ingress temple-stack-ingress -n level2

# Test routing
curl http://localhost/
curl http://localhost/api/_health

# Test TLS
curl -k https://temple.local
```

## 📚 Key Takeaways

- 📌 **Ingress** provides L7 routing
- 📌 **NGINX Ingress Controller** implements Ingress
- 📌 **Path-based routing**: Different paths → different services
- 📌 **Host-based routing**: Different domains → different services
- 📌 **TLS termination**: HTTPS at Ingress level
- 📌 Annotations control Ingress behavior

## 🎯 Level 2 Complete! 🎉

**Congratulations!** You've deployed a complete 3-tier application with:
- ✅ PostgreSQL database (StatefulSet + PVC)
- ✅ Strapi API backend (Deployment)
- ✅ React UI frontend (Deployment)
- ✅ ConfigMaps for configuration
- ✅ Secrets for credentials
- ✅ Ingress for external access

**Next**: [Level 3: Helm Charts →](../../level3/README.md)

Package everything into reusable Helm charts!

---

See `./solution/` for complete examples.
