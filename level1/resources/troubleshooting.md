# Troubleshooting Guide - Level 1

## 🔍 Common Issues and Solutions

### Pod Issues

#### 1. Pod Stuck in Pending State

**Symptoms:**
```bash
kubectl get pods
NAME        READY   STATUS    RESTARTS   AGE
my-pod      0/1     Pending   0          2m
```

**Possible Causes & Solutions:**

**A. Insufficient Resources**
```bash
# Check the issue
kubectl describe pod my-pod

# Look for: "Insufficient cpu" or "Insufficient memory"
Events:
  Type     Reason            Message
  ----     ------            -------
  Warning  FailedScheduling  0/1 nodes available: insufficient memory

# Solution: Reduce resource requests or add more nodes
```

**B. No Nodes Available**
```bash
# Check nodes
kubectl get nodes

# If no nodes are Ready, check your cluster
```

**C. Pod Selector Mismatch**
```bash
# Check if pod has nodeSelector
kubectl get pod my-pod -o yaml | grep -A 5 nodeSelector

# Solution: Remove nodeSelector or ensure matching nodes exist
```

---

#### 2. ImagePullBackOff / ErrImagePull

**Symptoms:**
```bash
NAME        READY   STATUS             RESTARTS   AGE
my-pod      0/1     ImagePullBackOff   0          2m
```

**Causes & Solutions:**

**A. Wrong Image Name**
```bash
# Check the exact error
kubectl describe pod my-pod

Events:
  Failed to pull image "nignx:latest": rpc error: code = Unknown desc = Error response from daemon: pull access denied

# Solution: Fix the typo (nginx, not nignx)
```

**B. Image Doesn't Exist**
```bash
# Verify image exists
docker pull nginx:1.21

# Solution: Use correct image name and tag
```

**C. Private Registry Without Credentials**
```bash
# Create docker-registry secret
kubectl create secret docker-registry regcred \
  --docker-server=<your-registry-server> \
  --docker-username=<your-name> \
  --docker-password=<your-password>

# Add to pod spec:
spec:
  imagePullSecrets:
  - name: regcred
```

---

#### 3. CrashLoopBackOff

**Symptoms:**
```bash
NAME        READY   STATUS             RESTARTS   AGE
my-pod      0/1     CrashLoopBackOff   5          3m
```

**Diagnosis:**
```bash
# Check logs
kubectl logs my-pod

# Check previous logs (if container restarted)
kubectl logs my-pod --previous

# Describe for events
kubectl describe pod my-pod
```

**Common Causes:**

**A. Application Error**
```bash
# Check logs for application errors
kubectl logs my-pod

# Solution: Fix application code or configuration
```

**B. Missing Dependencies**
```bash
# Check if application needs files/config
kubectl exec my-pod -- ls /app/config

# Solution: Add ConfigMap or Volume
```

**C. Wrong Command**
```bash
# Check command in pod spec
kubectl get pod my-pod -o yaml | grep -A 5 command

# Solution: Fix command or entrypoint
```

---

#### 4. Pod Running but Not Ready

**Symptoms:**
```bash
NAME        READY   STATUS    RESTARTS   AGE
my-pod      0/1     Running   0          2m
```

**Causes:**

**A. Failed Readiness Probe**
```bash
# Check probe configuration
kubectl describe pod my-pod | grep -A 10 Readiness

# Check logs
kubectl logs my-pod

# Solution: Fix application or adjust probe settings
```

**B. Application Not Started**
```bash
# Increase initialDelaySeconds in readiness probe
readinessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30  # Increase this
  periodSeconds: 10
```

---

### Deployment Issues

#### 5. Deployment Not Creating Pods

**Diagnosis:**
```bash
# Check deployment
kubectl get deployment my-deployment

# Check replicaset
kubectl get replicaset

# Describe deployment
kubectl describe deployment my-deployment
```

**Solutions:**

**A. Check Events**
```bash
kubectl describe deployment my-deployment

# Look for errors in Events section
```

**B. Check ReplicaSet**
```bash
kubectl get rs

# If ReplicaSet exists but no pods, check RS
kubectl describe rs <replicaset-name>
```

---

#### 6. Deployment Rollout Stuck

**Symptoms:**
```bash
kubectl rollout status deployment/my-deployment
Waiting for deployment "my-deployment" rollout to finish: 1 out of 3 new replicas have been updated...
```

**Solutions:**

**A. Check Pod Status**
```bash
kubectl get pods

# If new pods are failing, check why
kubectl describe pod <new-pod-name>
```

**B. Rollback**
```bash
# Rollback to previous version
kubectl rollout undo deployment/my-deployment

# Check history
kubectl rollout history deployment/my-deployment
```

---

### Service Issues

#### 7. Service Not Accessible

**Diagnosis:**
```bash
# Check service
kubectl get service my-service

# Check endpoints
kubectl get endpoints my-service

# Should show pod IPs, if empty = problem
```

**Solutions:**

**A. Label Selector Mismatch**
```bash
# Check service selector
kubectl get service my-service -o yaml | grep -A 5 selector

# Check pod labels
kubectl get pods --show-labels

# Solution: Ensure selectors match pod labels
```

**B. No Pods Ready**
```bash
# Check if pods are ready
kubectl get pods

# If not ready, fix pod issues first
```

**C. Wrong Port**
```bash
# Check service ports
kubectl describe service my-service

# Check container ports
kubectl describe pod <pod-name> | grep Port

# Ensure targetPort matches containerPort
```

---

#### 8. Cannot Access NodePort Service

**Diagnosis:**
```bash
# Get NodePort
kubectl get service my-service

# Try accessing
curl http://<node-ip>:<node-port>
```

**Solutions:**

**A. Using Docker Desktop**
```bash
# Use localhost
curl http://localhost:<node-port>
```

**B. Firewall Blocking**
```bash
# Check if port is accessible
telnet <node-ip> <node-port>

# Solution: Open firewall port
```

---

### General Debugging

#### 9. YAML Syntax Errors

**Error:**
```bash
error: error parsing deployment.yaml: error converting YAML to JSON
```

**Solutions:**

**A. Check Indentation**
```yaml
# YAML is whitespace-sensitive!
# Use 2 spaces for indentation, not tabs

# Wrong:
spec:
containers:  # Missing indent

# Correct:
spec:
  containers:
```

**B. Validate YAML**
```bash
# Use kubectl dry-run
kubectl apply -f deployment.yaml --dry-run=client

# Use online validators
# yamllint.com
```

---

#### 10. Resource Not Found

**Error:**
```bash
Error from server (NotFound): pods "my-pod" not found
```

**Solutions:**

**A. Check Namespace**
```bash
# List all pods in all namespaces
kubectl get pods --all-namespaces

# Specify namespace
kubectl get pods -n correct-namespace

# Check current namespace
kubectl config view --minify | grep namespace:
```

**B. Resource Name Typo**
```bash
# List all resources
kubectl get all

# Use correct name
```

---

### Quick Debugging Commands

```bash
# 1. Check pod status and events
kubectl get pods
kubectl describe pod <pod-name>

# 2. Check logs
kubectl logs <pod-name>
kubectl logs <pod-name> --previous

# 3. Check events
kubectl get events --sort-by='.lastTimestamp'
kubectl get events --field-selector involvedObject.name=<pod-name>

# 4. Check resource usage
kubectl top nodes
kubectl top pods

# 5. Execute commands in pod
kubectl exec -it <pod-name> -- /bin/bash
kubectl exec <pod-name> -- env
kubectl exec <pod-name> -- ps aux

# 6. Port forward to test locally
kubectl port-forward pod/<pod-name> 8080:80
curl http://localhost:8080

# 7. Check service endpoints
kubectl get endpoints <service-name>

# 8. Run debug container
kubectl run debug --image=busybox -it --rm --restart=Never -- sh
```

---

## 🔧 Debug Workflow

```
1. Identify the Problem
   ↓
   kubectl get pods/deployments/services
   
2. Get Detailed Information
   ↓
   kubectl describe <resource>
   
3. Check Logs
   ↓
   kubectl logs <pod-name>
   
4. Check Events
   ↓
   kubectl get events --sort-by='.lastTimestamp'
   
5. Investigate Configuration
   ↓
   kubectl get <resource> -o yaml
   
6. Test Connectivity
   ↓
   kubectl exec/port-forward
   
7. Fix and Validate
   ↓
   kubectl apply -f fixed-config.yaml
   kubectl get <resource>
```

---

## 🎯 Troubleshooting Checklist

When things don't work, check:

- [ ] Is the resource in the correct namespace?
- [ ] Are there any error events? (`kubectl describe`)
- [ ] Are the logs showing errors? (`kubectl logs`)
- [ ] Is the image name correct?
- [ ] Are labels and selectors matching?
- [ ] Are ports configured correctly?
- [ ] Are there sufficient cluster resources?
- [ ] Is the YAML syntax correct?
- [ ] Is the cluster accessible? (`kubectl cluster-info`)

---

## 📚 Additional Resources

- [Kubernetes Debugging Pods](https://kubernetes.io/docs/tasks/debug/debug-application/)
- [Kubernetes Troubleshooting](https://kubernetes.io/docs/tasks/debug/)
- [Common Pod Issues](https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/)

---

**Pro Tip**: When stuck, always start with:
```bash
kubectl describe <resource-type> <resource-name>
kubectl logs <pod-name>
kubectl get events --sort-by='.lastTimestamp'
```

These three commands solve 90% of issues!
