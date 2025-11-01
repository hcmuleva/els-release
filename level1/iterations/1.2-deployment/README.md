# Iteration 1.2: Create a Deployment

**Duration**: ~1-2 hours  
**Difficulty**: ⭐⭐ Intermediate

## 🎯 Learning Objectives

By the end of this iteration, you will:
- ✅ Understand what Deployments are and why they're better than Pods
- ✅ Create Deployments using YAML
- ✅ Scale applications up and down
- ✅ Perform rolling updates
- ✅ Rollback deployments
- ✅ Understand ReplicaSets

## 📚 Background

### What is a Deployment?

A **Deployment** provides declarative updates for Pods and ReplicaSets. Think of it as a manager for your Pods.

**Key Benefits over Bare Pods**:
- 🔄 **Self-healing** - Automatically restarts failed pods
- 📈 **Scaling** - Easily scale up/down
- 🔄 **Rolling updates** - Update without downtime
- ⏪ **Rollback** - Undo bad updates
- 📊 **Declarative** - Describe desired state, K8s makes it happen

### Deployment → ReplicaSet → Pods

```
Deployment
    ↓ manages
ReplicaSet
    ↓ manages
Pods (replicas)
```

##  📋 Prerequisites

- Completed [Iteration 1.1](../1.1-pod/README.md)
- Level 1 namespace created
- kubectl configured

## 🎓 Theory

### Deployment YAML Structure

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3                    # Number of pod replicas
  selector:                      # How to find pods to manage
    matchLabels:
      app: nginx
  template:                      # Pod template
    metadata:
      labels:
        app: nginx               # Must match selector
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
```

### Essential Commands

```bash
# Create deployment
kubectl apply -f deployment.yaml

# Get deployments
kubectl get deployments
kubectl get deploy

# Describe deployment
kubectl describe deployment <name>

# Scale
kubectl scale deployment <name> --replicas=5

# Update image
kubectl set image deployment/<name> container-name=new-image:tag

# Rollout commands
kubectl rollout status deployment/<name>
kubectl rollout history deployment/<name>
kubectl rollout undo deployment/<name>

# Delete
kubectl delete deployment <name>
```

## 🛠️ Hands-On Exercise

### Task 1: Create Your First Deployment

1. Create `nginx-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
```

2. Deploy it:

```bash
kubectl apply -f nginx-deployment.yaml
```

3. Verify:

```bash
# Check deployment
kubectl get deployments
# Should show: nginx-deployment   2/2     2            2           20s

# Check replicaset (created automatically)
kubectl get replicaset
kubectl get rs

# Check pods
kubectl get pods
# Should see 2 pods running
```

### Task 2: Understanding the Relationship

```bash
# See the hierarchy
kubectl get deployment nginx-deployment
kubectl get rs
kubectl get pods

# Notice the naming:
# deployment-name-<replicaset-hash>-<pod-hash>
# Example: nginx-deployment-5d59d67564-abc123

# Describe deployment to see controlled resources
kubectl describe deployment nginx-deployment
```

### Task 3: Scale the Deployment

**Method 1: Using kubectl scale**

```bash
# Scale up to 5 replicas
kubectl scale deployment nginx-deployment --replicas=5

# Watch it scale
kubectl get pods -w

# Verify
kubectl get deployment nginx-deployment
# Should show: 5/5
```

**Method 2: Edit the YAML**

```bash
# Edit the deployment
kubectl edit deployment nginx-deployment

# Change replicas: 2 to replicas: 3
# Save and exit

# Or update the YAML file and reapply
# Change replicas to 3 in nginx-deployment.yaml
kubectl apply -f nginx-deployment.yaml
```

**Method 3: Patch**

```bash
kubectl patch deployment nginx-deployment -p '{"spec":{"replicas":4}}'
```

### Task 4: Test Self-Healing

```bash
# Get current pods
kubectl get pods

# Delete one pod
kubectl delete pod <pod-name>

# Immediately check again
kubectl get pods

# You'll see: the deleted pod terminating AND a new one being created!
# Kubernetes maintains the desired state (replicas: X)
```

### Task 5: Perform a Rolling Update

```bash
# Update the nginx image version
kubectl set image deployment/nginx-deployment nginx=nginx:1.22

# Watch the rollout
kubectl rollout status deployment/nginx-deployment

# You'll see:
# - New ReplicaSet created
# - New pods with nginx:1.22 starting
# - Old pods with nginx:1.21 terminating
# - No downtime!

# Check rollout history
kubectl rollout history deployment/nginx-deployment
```

### Task 6: Rollback a Deployment

```bash
# View history
kubectl rollout history deployment/nginx-deployment

# Rollback to previous version
kubectl rollout undo deployment/nginx-deployment

# Watch it rollback
kubectl rollout status deployment/nginx-deployment

# Rollback to specific revision
kubectl rollout undo deployment/nginx-deployment --to-revision=1

# Check current image version
kubectl describe deployment nginx-deployment | grep Image
```

### Task 7: Update with YAML

```bash
# Edit nginx-deployment.yaml
# Change image to nginx:1.22

# Apply the update
kubectl apply -f nginx-deployment.yaml

# Add --record to save the command in history
kubectl apply -f nginx-deployment.yaml --record

# Check rollout status
kubectl rollout status deployment/nginx-deployment
```

## 🎯 Practice Exercises

### Exercise 1: Create Multi-Container Deployment

Create a deployment with:
- 3 replicas
- nginx container
- busybox sidecar container logging timestamps

<details>
<summary>Solution</summary>

See `./solution/multi-container-deployment.yaml`

</details>

### Exercise 2: Controlled Rollout

Create a deployment with:
- maxSurge: 1
- maxUnavailable: 0
- Perform update and observe the rolling update strategy

<details>
<summary>Solution</summary>

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: controlled-deployment
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
```

</details>

### Exercise 3: Debug Failed Deployment

Create a deployment with an invalid image and practice debugging.

```bash
# Create deployment with wrong image
kubectl create deployment broken --image=this-does-not-exist:v1

# Debug steps:
# 1. Check deployment status
# 2. Check replicaset
# 3. Check pod errors
# 4. Fix and redeploy
```

## ✅ Validation

Check your understanding:

**Questions**:
1. What's the difference between a Pod and a Deployment?
2. What happens if you delete a pod managed by a deployment?
3. What is a ReplicaSet?
4. How do you rollback a deployment?
5. What's the benefit of rolling updates?

**Practical Check**:

```bash
# You should have:
kubectl get deployment nginx-deployment
# READY should show desired/current match

kubectl get pods
# Should show multiple nginx pods

# Test scaling
kubectl scale deployment nginx-deployment --replicas=1
kubectl get pods
# Should scale down to 1 pod

# Test update
kubectl set image deployment/nginx-deployment nginx=nginx:alpine
kubectl rollout status deployment/nginx-deployment
# Should complete successfully

# Test rollback
kubectl rollout undo deployment/nginx-deployment
kubectl rollout status deployment/nginx-deployment
# Should rollback successfully
```

## 📚 Key Takeaways

- 📌 **Deployments** manage Pods via ReplicaSets
- 📌 Deployments provide **self-healing** - pods are automatically recreated
- 📌 **Scaling** is declarative - just change replica count
- 📌 **Rolling updates** enable zero-downtime deployments
- 📌 You can **rollback** to previous versions easily
- 📌 Use Deployments, not bare Pods, in production

## 🐛 Common Issues

### Deployment not creating pods

```bash
kubectl describe deployment <name>
# Check Events section for errors
```

### Pods stuck in ImagePullBackOff

```bash
kubectl describe pod <pod-name>
# Usually wrong image name/tag
```

### Rollout stuck

```bash
kubectl rollout status deployment/<name>
kubectl describe deployment <name>
# Check if new pods are failing
```

## 🎯 Next Steps

**Completed Iteration 1.2?** Great! 🎉

You now know how to manage applications with Deployments, but they're still not accessible from outside the cluster.

**Next**: [Iteration 1.3: Expose with a Service](../1.3-service/README.md)

In 1.3, you'll learn to:
- Expose deployments with Services
- Understand different service types
- Enable networking and discovery

---

**Keep practicing!** The more you use deployments, the more natural they'll feel. 💪
