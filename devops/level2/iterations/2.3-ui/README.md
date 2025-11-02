# Iteration 2.3: Deploy React UI Frontend

**Duration**: ~1.5-2 hours  
**Difficulty**: ⭐⭐⭐ Intermediate

## 🎯 Learning Objectives

- ✅ Deploy React application in Kubernetes
- ✅ Configure API backend URL
- ✅ Expose UI externally via LoadBalancer
- ✅ Test complete application stack (UI → API → Database)
- ✅ Configure nginx for React routing

## 📚 Background

The **Temple UI** is a React single-page application that connects to the Strapi API. In Kubernetes, we'll:
1. Deploy React app as a Deployment
2. Use nginx to serve static files
3. Expose via LoadBalancer for external access

## 🛠️ Hands-On Exercise

### Task 1: Create UI ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ui-config
  namespace: level2
data:
  REACT_APP_API_URL: "http://localhost:1337"  # Will access via port-forward initially
  REACT_APP_ENV: "production"
```

### Task 2: Deploy UI

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: temple-ui
  namespace: level2
spec:
  replicas: 2
  selector:
    matchLabels:
      app: temple-ui
  template:
    metadata:
      labels:
        app: temple-ui
        tier: frontend
    spec:
      containers:
      - name: ui
        image: temple-ui:1.1  # From your earlier Docker build
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 15
          periodSeconds: 10
```

### Task 3: Create LoadBalancer Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: temple-ui-service
  namespace: level2
spec:
  type: LoadBalancer
  selector:
    app: temple-ui
  ports:
  - name: http
    port: 80
    targetPort: 80
```

### Task 4: Access the Application

```bash
# Apply all resources
kubectl apply -f ui-configmap.yaml
kubectl apply -f ui-deployment.yaml
kubectl apply -f ui-service.yaml

# Get LoadBalancer URL (Docker Desktop assigns localhost)
kubectl get svc temple-ui-service -n level2

# Access in browser
open http://localhost
```

### Task 5: Test Complete Stack

```bash
# Port-forward API for testing
kubectl port-forward svc/temple-api-service -n level2 1337:1337 &

# Access UI
open http://localhost

# UI should connect to API at http://localhost:1337
# Test creating content, viewing data
```

## ✅ Validation

```bash
# All three tiers running
kubectl get pods -n level2

# Services accessible
kubectl get svc -n level2

# UI accessible externally
curl http://localhost

# Complete flow test:
# 1. Open http://localhost in browser
# 2. Navigate to admin (if Strapi configured)
# 3. Create content
# 4. Verify in database:
kubectl exec -it postgres-0 -n level2 -- \
  psql -U templeadmin -d templedb -c "SELECT * FROM users;"
```

## 🎯 Next Steps

**Next**: [Iteration 2.4: ConfigMaps Deep Dive](../2.4-configmaps/README.md)

Learn advanced ConfigMap usage for environment-specific configuration.

---

See `./solution/` for complete YAML files.
