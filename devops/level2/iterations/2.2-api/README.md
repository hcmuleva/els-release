# Iteration 2.2: Deploy Strapi API Backend

**Duration**: ~2-2.5 hours  
**Difficulty**: ⭐⭐⭐ Intermediate-Advanced

## 🎯 Learning Objectives

By the end of this iteration, you will:
- ✅ Deploy Strapi API connected to PostgreSQL
- ✅ Use environment variables for configuration
- ✅ Configure database connection strings
- ✅ Create ClusterIP service for API
- ✅ Test API endpoints
- ✅ Understand init containers

## 📚 Background

### What is Strapi?

**Strapi** is an open-source headless CMS (Content Management System). It provides:
- 🔧 RESTful API auto-generated from content models
- 📊 Admin panel for content management
- 🔐 Authentication and permissions
- 📦 Plugin system

Perfect for learning Kubernetes application deployment!

### Application Architecture

```
Temple UI (React)
       ↓ HTTP
Temple API (Strapi) ← You are here
       ↓ TCP
PostgreSQL Database
```

## 📋 Prerequisites

- Completed [Iteration 2.1: PostgreSQL](../2.1-database/README.md)
- PostgreSQL running in `level2` namespace
- Understanding of environment variables

## 🎓 Theory

### Environment Variables for Configuration

Instead of hardcoding configuration, use environment variables:

```yaml
env:
- name: DATABASE_HOST
  value: postgres-service
- name: DATABASE_PASSWORD
  valueFrom:
    secretKeyRef:
      name: postgres-secret
      key: POSTGRES_PASSWORD
```

### Init Containers

**Init containers** run before main containers and are useful for:
- Waiting for dependencies (database to be ready)
- Running database migrations
- Downloading configuration

```yaml
initContainers:
- name: wait-for-db
  image: busybox
  command: ['sh', '-c', 'until nc -z postgres-service 5432; do sleep 2; done']
```

## 🛠️ Hands-On Exercise

### Task 1: Create API ConfigMap

Create `api-configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
  namespace: level2
data:
  # Database configuration
  DATABASE_CLIENT: "postgres"
  DATABASE_HOST: "postgres-service"
  DATABASE_PORT: "5432"
  DATABASE_NAME: "templedb"
  
  # Strapi configuration
  NODE_ENV: "production"
  HOST: "0.0.0.0"
  PORT: "1337"
```

Apply it:

```bash
kubectl apply -f api-configmap.yaml

# Verify
kubectl get configmap api-config -n level2
kubectl describe configmap api-config -n level2
```

### Task 2: Build or Use Temple API Image

**Option 1**: Use pre-built image (if available)
```bash
# If you have the image from earlier work
docker images | grep temple-api
```

**Option 2**: Build from source (if you have the code)
```bash
cd /path/to/temple-api
docker build -t temple-api:1.0 .
```

**Option 3**: Use a generic Strapi image
```yaml
image: strapi/strapi:4.15-alpine
```

For this tutorial, we'll assume you have `temple-api:1.0` from your project.

### Task 3: Create API Deployment

Create `api-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: temple-api
  namespace: level2
  labels:
    app: temple-api
    tier: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: temple-api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: temple-api
        tier: backend
    spec:
      # Init container - wait for database
      initContainers:
      - name: wait-for-postgres
        image: busybox:1.35
        command:
        - sh
        - -c
        - |
          echo "Waiting for PostgreSQL..."
          until nc -z postgres-service 5432; do
            echo "PostgreSQL not ready, waiting..."
            sleep 2
          done
          echo "PostgreSQL is ready!"
      
      containers:
      - name: api
        image: temple-api:1.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 1337
          name: http
          protocol: TCP
        
        # Environment from ConfigMap
        envFrom:
        - configMapRef:
            name: api-config
        
        # Environment from Secret
        env:
        - name: DATABASE_USERNAME
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: POSTGRES_USER
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: POSTGRES_PASSWORD
        - name: APP_KEYS
          value: "toBeModified1,toBeModified2"
        - name: API_TOKEN_SALT
          value: "toBeModified"
        - name: ADMIN_JWT_SECRET
          value: "toBeModified"
        - name: JWT_SECRET
          value: "toBeModified"
        
        # Resource management
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        
        # Readiness probe
        readinessProbe:
          httpGet:
            path: /_health
            port: 1337
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        
        # Liveness probe
        livenessProbe:
          httpGet:
            path: /_health
            port: 1337
          initialDelaySeconds: 60
          periodSeconds: 20
          timeoutSeconds: 5
          failureThreshold: 3
```

**Note**: In production, move APP_KEYS, JWT_SECRET, etc. to Secrets!

Apply it:

```bash
kubectl apply -f api-deployment.yaml

# Watch deployment
kubectl get deployments -n level2 -w

# Check pods
kubectl get pods -n level2 -l app=temple-api

# Check logs
kubectl logs -f deployment/temple-api -n level2
```

### Task 4: Create API Service

Create `api-service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: temple-api-service
  namespace: level2
  labels:
    app: temple-api
spec:
  type: ClusterIP
  selector:
    app: temple-api
  ports:
  - name: http
    port: 1337
    targetPort: 1337
    protocol: TCP
```

Apply it:

```bash
kubectl apply -f api-service.yaml

# Verify
kubectl get svc temple-api-service -n level2

# Check endpoints
kubectl get endpoints temple-api-service -n level2
```

### Task 5: Test API Connectivity

**Method 1: Port-forward to test locally**

```bash
# Forward API port to localhost
kubectl port-forward -n level2 svc/temple-api-service 1337:1337

# In another terminal, test API
curl http://localhost:1337/_health
# Should return health status

curl http://localhost:1337/api
# Should return API info

# Access admin panel
open http://localhost:1337/admin
```

**Method 2: From within cluster**

```bash
# Run test pod
kubectl run curl-test --image=curlimages/curl --rm -it -n level2 -- sh

# Inside pod:
curl http://temple-api-service:1337/_health
curl http://temple-api-service:1337/api

exit
```

### Task 6: Verify Database Connection

Check that Strapi connected to PostgreSQL:

```bash
# Check API logs for database connection
kubectl logs -n level2 -l app=temple-api | grep -i database

# Connect to postgres and check for Strapi tables
kubectl exec -it postgres-0 -n level2 -- psql -U templeadmin -d templedb

# Inside psql:
\dt
# Should see Strapi tables (strapi_*, admin_*, etc.)

\q
```

### Task 7: Create Admin User (Optional)

If using real Strapi:

```bash
# Port-forward
kubectl port-forward -n level2 svc/temple-api-service 1337:1337

# Open browser
open http://localhost:1337/admin

# Create first admin user through the web interface
```

## 🎯 Practice Exercises

### Exercise 1: Add API Secret

Move hardcoded secrets (APP_KEYS, JWT_SECRET) to a Kubernetes Secret.

<details>
<summary>Solution</summary>

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-secrets
  namespace: level2
type: Opaque
stringData:
  APP_KEYS: "random-key-1,random-key-2"
  API_TOKEN_SALT: "random-salt"
  ADMIN_JWT_SECRET: "random-admin-secret"
  JWT_SECRET: "random-jwt-secret"
```

Then reference in deployment:
```yaml
envFrom:
- secretRef:
    name: api-secrets
```

</details>

### Exercise 2: Configure Resource Limits

Adjust CPU/memory based on actual usage:

```bash
# Check actual usage
kubectl top pods -n level2

# Adjust resources accordingly
```

### Exercise 3: Add Horizontal Pod Autoscaler

Scale API based on CPU usage:

```bash
kubectl autoscale deployment temple-api \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n level2
```

## ✅ Validation

Check your understanding:

**Questions**:
1. Why use ConfigMaps for configuration?
2. What's the purpose of init containers?
3. How do you reference Secrets in environment variables?
4. Why use ClusterIP for the API service?
5. What happens if the database is not ready when API starts?

**Practical Check**:

```bash
# Deployment ready
kubectl get deployment temple-api -n level2
# READY should show 2/2

# Pods running
kubectl get pods -n level2 -l app=temple-api
# All pods Running and Ready

# Service has endpoints
kubectl get endpoints temple-api-service -n level2
# Should show 2 pod IPs

# Health check works
kubectl run curl --image=curlimages/curl --rm -it -n level2 -- \
  curl -s temple-api-service:1337/_health
# Should return success

# Database connection verified
kubectl exec -it postgres-0 -n level2 -- \
  psql -U templeadmin -d templedb -c "\dt" | grep strapi
# Should show Strapi tables

# Logs show no errors
kubectl logs -n level2 -l app=temple-api --tail=50
# No ERROR messages
```

## 📚 Key Takeaways

- 📌 **ConfigMaps** store non-sensitive configuration
- 📌 **Init containers** handle dependencies and setup
- 📌 Use **environment variables** for flexible configuration
- 📌 **Health probes** ensure API is ready before serving traffic
- 📌 **ClusterIP** services for internal communication
- 📌 Always wait for dependencies (database) before starting app
- 📌 Check logs to verify successful startup

## 🐛 Common Issues

### API pods stuck in Init

```bash
kubectl describe pod <api-pod> -n level2
# Check init container logs
kubectl logs <api-pod> -n level2 -c wait-for-postgres
```

### API can't connect to database

```bash
# Check database is running
kubectl get pods -n level2 -l app=postgres

# Check service name matches
kubectl get svc -n level2

# Check environment variables
kubectl exec <api-pod> -n level2 -- env | grep DATABASE
```

### ImagePullBackOff

```bash
# If using local image
kubectl describe pod <api-pod> -n level2

# Ensure imagePullPolicy: IfNotPresent
# Ensure image exists locally: docker images | grep temple-api
```

### Readiness probe failing

```bash
# Check if health endpoint exists
kubectl port-forward svc/temple-api-service -n level2 1337:1337
curl http://localhost:1337/_health

# Increase initialDelaySeconds if app is slow to start
```

## 🎯 Next Steps

**Completed Iteration 2.2?** Great! 🎉

You now have a Strapi API running and connected to PostgreSQL.

**Next**: [Iteration 2.3: Deploy React UI](../2.3-ui/README.md)

In 2.3, you'll:
- Deploy the React frontend
- Configure API connection
- Test UI-API-Database flow
- Expose UI via LoadBalancer

---

**Your backend is running! Time to add the frontend.** 🚀
