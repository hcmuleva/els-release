# Iteration 1.4: Health Checks and Probes

**Duration**: ~1-2 hours  
**Difficulty**: ⭐⭐⭐ Intermediate-Advanced

## 🎯 Learning Objectives

By the end of this iteration, you will:
- ✅ Understand liveness, readiness, and startup probes
- ✅ Configure HTTP, TCP, and exec probes
- ✅ Set resource requests and limits
- ✅ Enable self-healing applications
- ✅ Prevent bad deployments from serving traffic
- ✅ Debug probe failures

## 📚 Background

### Why Health Checks?

Your app might be running but not healthy. Kubernetes needs to know:
- **Is the app alive?** → Liveness Probe
- **Is the app ready for traffic?** → Readiness Probe
- **Did the app start successfully?** → Startup Probe

**Without health checks**:
- ❌ Broken pods continue receiving traffic
- ❌ Stuck apps never restart
- ❌ Slow startups get killed prematurely

**With health checks**:
- ✅ Broken pods are restarted automatically
- ✅ Unready pods don't receive traffic
- ✅ Slow-starting apps get time to initialize

### Three Types of Probes

| Probe | Purpose | Action on Failure |
|-------|---------|-------------------|
| **Liveness** | Is the app alive? | Restart container |
| **Readiness** | Ready for traffic? | Remove from service |
| **Startup** | Has app started? | Wait longer before liveness checks |

### Probe Methods

| Method | Use Case | Example |
|--------|----------|---------|
| **HTTP** | Web apps, APIs | GET /health returns 200 |
| **TCP** | Databases, TCP services | Connect to port 5432 |
| **Exec** | Custom logic | Run script in container |

## 📋 Prerequisites

- Completed [Iteration 1.3](../1.3-service/README.md)
- Running deployment with service
- Level 1 namespace created

## 🎓 Theory

### Probe Configuration

```yaml
livenessProbe:
  httpGet:              # HTTP probe
    path: /healthz
    port: 8080
  initialDelaySeconds: 15  # Wait before first check
  periodSeconds: 10        # Check every 10s
  timeoutSeconds: 5        # Wait 5s for response
  failureThreshold: 3      # Fail after 3 attempts
  successThreshold: 1      # Success after 1 attempt

readinessProbe:
  tcpSocket:            # TCP probe
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5

startupProbe:
  exec:                 # Exec probe
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 0
  periodSeconds: 10
  failureThreshold: 30  # Allow 300s (30 * 10s) for startup
```

### Resource Requests and Limits

```yaml
resources:
  requests:         # Minimum guaranteed
    memory: "128Mi"
    cpu: "250m"
  limits:          # Maximum allowed
    memory: "256Mi"
    cpu: "500m"
```

**CPU units**:
- `1` = 1 CPU core
- `500m` = 0.5 CPU (half a core)
- `100m` = 0.1 CPU

**Memory units**:
- `Mi` = Mebibyte (1024^2 bytes)
- `Gi` = Gibibyte (1024^3 bytes)

## 🛠️ Hands-On Exercise

### Task 1: HTTP Liveness Probe

Create a deployment with HTTP liveness probe:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-with-liveness
  namespace: level1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: liveness-demo
  template:
    metadata:
      labels:
        app: liveness-demo
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        
        # Liveness probe
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 2
          failureThreshold: 3
```

Apply and test:

```bash
kubectl apply -f app-with-liveness.yaml

# Check pod
kubectl get pods -l app=liveness-demo

# Describe to see probe config
kubectl describe pod -l app=liveness-demo

# Look for:
# Liveness: http-get http://:80/ delay=10s timeout=2s period=5s #success=1 #failure=3
```

**Simulate failure**:

```bash
# Delete nginx index to make probe fail
kubectl exec -it <pod-name> -- rm /usr/share/nginx/html/index.html

# Watch pod restart
kubectl get pods -w

# After 3 failures (15s), pod restarts
# RESTARTS column increments
```

### Task 2: TCP Readiness Probe

Create deployment with TCP readiness probe:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-with-readiness
  namespace: level1
spec:
  replicas: 2
  selector:
    matchLabels:
      app: readiness-demo
  template:
    metadata:
      labels:
        app: readiness-demo
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        
        # Readiness probe
        readinessProbe:
          tcpSocket:
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
          failureThreshold: 3
```

Test readiness probe:

```bash
kubectl apply -f app-with-readiness.yaml

# Create service
kubectl expose deployment app-with-readiness --port=80

# Check endpoints
kubectl get endpoints app-with-readiness
# Should show 2 pod IPs (ready)

# Make one pod fail readiness check
# Stop nginx in one pod
kubectl exec <pod-name> -- nginx -s stop

# Check endpoints again
kubectl get endpoints app-with-readiness
# Now only 1 pod IP (the healthy one)

# Check pod status
kubectl get pods -l app=readiness-demo
# Pod still running but NOT READY (0/1)
```

### Task 3: Exec Probe

Create deployment with exec probe:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-with-exec-probe
  namespace: level1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: exec-demo
  template:
    metadata:
      labels:
        app: exec-demo
    spec:
      containers:
      - name: busybox
        image: busybox:1.35
        command:
        - sh
        - -c
        - |
          # Create health file after 10 seconds
          sleep 10
          touch /tmp/healthy
          # Keep running
          while true; do sleep 30; done
        
        # Liveness probe using exec
        livenessProbe:
          exec:
            command:
            - cat
            - /tmp/healthy
          initialDelaySeconds: 5
          periodSeconds: 5
```

Test:

```bash
kubectl apply -f app-with-exec-probe.yaml

# Watch pod
kubectl get pods -w

# Pod starts, but liveness probe fails initially (file doesn't exist)
# After 10 seconds, file is created and probe succeeds

# Simulate failure
kubectl exec <pod-name> -- rm /tmp/healthy

# Pod will restart after failureThreshold
```

### Task 4: Startup Probe for Slow Apps

For apps with slow initialization (databases, large apps):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: slow-startup-app
  namespace: level1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: slow-startup
  template:
    metadata:
      labels:
        app: slow-startup
    spec:
      containers:
      - name: app
        image: busybox:1.35
        command:
        - sh
        - -c
        - |
          # Simulate slow startup (60 seconds)
          echo "Starting up..."
          sleep 60
          touch /tmp/started
          echo "Started!"
          while true; do sleep 30; done
        
        # Startup probe - gives app time to start
        startupProbe:
          exec:
            command:
            - cat
            - /tmp/started
          initialDelaySeconds: 0
          periodSeconds: 10
          failureThreshold: 12  # Allow 120 seconds (12 * 10s)
        
        # Liveness probe - only starts checking after startup succeeds
        livenessProbe:
          exec:
            command:
            - cat
            - /tmp/started
          initialDelaySeconds: 0
          periodSeconds: 10
```

### Task 5: Resource Requests and Limits

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-with-resources
  namespace: level1
spec:
  replicas: 2
  selector:
    matchLabels:
      app: resource-demo
  template:
    metadata:
      labels:
        app: resource-demo
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        
        # Resource management
        resources:
          requests:         # Scheduler uses this for placement
            memory: "128Mi"
            cpu: "100m"
          limits:          # Container can't exceed these
            memory: "256Mi"
            cpu: "500m"
        
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 5
        
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
```

Test resources:

```bash
kubectl apply -f app-with-resources.yaml

# Check resource usage
kubectl top pods -l app=resource-demo

# Describe pod to see requests/limits
kubectl describe pod -l app=resource-demo | grep -A5 Requests
```

### Task 6: Combined Health Checks (Production-Ready)

Complete example with all probes:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: production-ready-app
  namespace: level1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: prod-app
  template:
    metadata:
      labels:
        app: prod-app
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        
        # Resources
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        
        # Startup probe (for initial health)
        startupProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 0
          periodSeconds: 5
          failureThreshold: 30  # Allow 150s startup
        
        # Liveness probe (restart if unhealthy)
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 0
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        
        # Readiness probe (remove from service if not ready)
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 0
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
```

## 🎯 Practice Exercises

### Exercise 1: Debug Probe Failures

Create a deployment with intentionally failing probes and practice debugging.

```bash
# Check events
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>

# Check probe config
kubectl get pod <pod-name> -o yaml | grep -A10 livenessProbe
```

### Exercise 2: Custom Health Endpoint

Create a simple app with a custom `/health` endpoint and configure probes to use it.

<details>
<summary>Hint</summary>

Many apps expose `/health`, `/healthz`, or `/ready` endpoints. Use httpGet probe pointing to these.

</details>

### Exercise 3: Resource Limits Testing

Create a deployment and intentionally exceed memory limits to see OOMKilled behavior.

```yaml
# Set very low memory limit
resources:
  limits:
    memory: "10Mi"
```

## ✅ Validation

Check your understanding:

**Questions**:
1. What's the difference between liveness and readiness probes?
2. When should you use a startup probe?
3. What happens when a liveness probe fails?
4. What happens when a readiness probe fails?
5. What's the difference between requests and limits?

**Practical Check**:

```bash
# Create deployment with all probes
kubectl apply -f production-ready-app.yaml

# Verify probes configured
kubectl describe pod -l app=prod-app | grep -E "Liveness|Readiness|Startup"

# Check resources
kubectl describe pod -l app=prod-app | grep -A5 Requests

# Simulate liveness failure
kubectl exec <pod-name> -- rm /usr/share/nginx/html/index.html

# Watch restart
kubectl get pods -w

# Create service
kubectl expose deployment production-ready-app --port=80

# Simulate readiness failure in one pod
kubectl exec <pod-name> -- nginx -s stop

# Check endpoints (should have 2/3 pods)
kubectl get endpoints production-ready-app
```

## 📚 Key Takeaways

- 📌 **Liveness probes** restart unhealthy containers
- 📌 **Readiness probes** control service traffic routing
- 📌 **Startup probes** protect slow-starting apps
- 📌 Use **HTTP probes** for web apps with health endpoints
- 📌 Use **TCP probes** for services without HTTP
- 📌 Use **exec probes** for custom health logic
- 📌 **Requests** guarantee minimum resources
- 📌 **Limits** prevent resource hogging
- 📌 Always configure probes in production!

## 🐛 Common Issues

### Pod keeps restarting (CrashLoopBackOff)

```bash
# Check liveness probe settings
kubectl describe pod <pod-name>

# Probe might be too aggressive
# Increase initialDelaySeconds or failureThreshold
```

### Probe timing out

```bash
# Increase timeoutSeconds
timeoutSeconds: 10  # Instead of 5

# Or reduce periodSeconds to check less frequently
periodSeconds: 30
```

### Pod never becomes ready

```bash
# Check readiness probe
kubectl describe pod <pod-name>

# Check if app is actually ready
kubectl logs <pod-name>

# Exec into pod and test manually
kubectl exec -it <pod-name> -- curl localhost:80/health
```

### OOMKilled (Out of Memory)

```bash
# Check pod status
kubectl get pods
# STATUS: OOMKilled

# Increase memory limit
resources:
  limits:
    memory: "512Mi"  # Increase from 256Mi
```

## 🎯 Level 1 Complete! 🎉

**Congratulations!** You've completed Level 1: Kubernetes Basics.

You now understand:
- ✅ Pods (basic unit)
- ✅ Deployments (managing pods)
- ✅ Services (networking)
- ✅ Health Checks (self-healing)

**Ready for Level 2?**

**Next**: [Level 2: Multi-Service Deployment](../../level2/README.md)

In Level 2, you'll:
- Deploy a full 3-tier application (Database + API + UI)
- Use ConfigMaps and Secrets
- Configure Ingress for external access
- Learn storage with PersistentVolumeClaims

---

**You're on your way to Kubernetes mastery!** 🚀
