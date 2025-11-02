# Iteration 1.1: Deploy a Simple Pod

**Duration**: ~1 hour  
**Difficulty**: ⭐ Beginner

## 🎯 Learning Objectives

By the end of this iteration, you will:
- ✅ Understand what a Pod is
- ✅ Create a Pod using YAML manifests
- ✅ Deploy a Pod using kubectl
- ✅ Inspect and debug Pods
- ✅ Access Pod logs
- ✅ Delete Pods

## 📚 Background

### What is a Pod?

A **Pod** is the smallest and simplest unit in Kubernetes. Think of it as a wrapper around one or more containers.

**Key Points**:
- Pods are ephemeral (temporary)
- Each Pod gets its own IP address
- Containers in a Pod share network and storage
- Pods are scheduled on nodes by the Kubernetes scheduler

### Pod Lifecycle

```
Pending → Running → Succeeded/Failed
```

- **Pending**: Pod is accepted but not yet running
- **Running**: Pod has been bound to a node and containers are running
- **Succeeded**: All containers terminated successfully
- **Failed**: At least one container failed

## 📋 Prerequisites

- Kubernetes cluster running (Docker Desktop or Minikube)
- kubectl configured
- Level 1 namespace created:
  ```bash
  kubectl create namespace level1-tutorial
  kubectl config set-context --current --namespace=level1-tutorial
  ```

## 🎓 Theory

### Pod YAML Structure

```yaml
apiVersion: v1              # API version
kind: Pod                   # Resource type
metadata:                   # Metadata about the Pod
  name: my-pod             # Pod name
  labels:                  # Key-value pairs for organization
    app: myapp
spec:                      # Pod specification
  containers:              # List of containers in the Pod
  - name: my-container    # Container name
    image: nginx:latest   # Container image
    ports:               # Ports to expose
    - containerPort: 80
```

### Essential kubectl Commands

```bash
# Create/Apply resources
kubectl apply -f pod.yaml

# Get resources
kubectl get pods
kubectl get pods -o wide  # More details

# Describe resource (detailed info)
kubectl describe pod <pod-name>

# View logs
kubectl logs <pod-name>
kubectl logs -f <pod-name>  # Follow logs

# Execute commands in Pod
kubectl exec -it <pod-name> -- /bin/bash

# Delete resource
kubectl delete pod <pod-name>
kubectl delete -f pod.yaml
```

## 🛠️ Hands-On Exercise

### Task 1: Create Your First Pod

**Objective**: Deploy an nginx web server as a Pod

1. Create a file named `my-first-pod.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
    tier: frontend
spec:
  containers:
  - name: nginx-container
    image: nginx:1.21
    ports:
    - containerPort: 80
```

2. Deploy the Pod:

```bash
kubectl apply -f my-first-pod.yaml
```

3. Verify the Pod is running:

```bash
kubectl get pods
# Expected: nginx-pod   1/1     Running   0          10s

kubectl get pods -o wide
# Shows additional info like IP and node
```

### Task 2: Inspect the Pod

1. Get detailed information:

```bash
kubectl describe pod nginx-pod
```

**Look for**:
- Status and conditions
- IP address
- Events (especially if there are issues)

2. View Pod logs:

```bash
kubectl logs nginx-pod
```

3. Check Pod in YAML format:

```bash
kubectl get pod nginx-pod -o yaml
```

### Task 3: Access the Pod

1. Port-forward to access nginx locally:

```bash
kubectl port-forward pod/nginx-pod 8080:80
```

2. In another terminal or browser, access:

```bash
curl http://localhost:8080
# Or open in browser: http://localhost:8080
```

You should see the nginx welcome page!

3. Stop port-forward (Ctrl+C)

### Task 4: Execute Commands Inside Pod

1. Get a shell inside the Pod:

```bash
kubectl exec -it nginx-pod -- /bin/bash
```

2. Inside the Pod, run:

```bash
# Check nginx is running
ps aux | grep nginx

# Check network
hostname -i  # Pod IP

# Exit
exit
```

### Task 5: Modify and Update

Pods are immutable, but let's see what happens when we try to update.

1. Edit `my-first-pod.yaml` and change:
```yaml
image: nginx:1.21
```
to:
```yaml
image: nginx:1.22
```

2. Apply the change:

```bash
kubectl apply -f my-first-pod.yaml
```

**Observation**: Pods cannot be updated in-place! You'll need to delete and recreate.

### Task 6: Delete the Pod

```bash
kubectl delete pod nginx-pod

# Or using the file
kubectl delete -f my-first-pod.yaml

# Verify deletion
kubectl get pods
```

## 🎯 Practice Exercises

### Exercise 1: Multi-Container Pod

Create a Pod with two containers:
- nginx serving content
- busybox running as a sidecar

**Hint**: Use the solution in `./exercises/multi-container-pod.yaml`

<details>
<summary>Click for solution structure</summary>

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: multi-container-pod
spec:
  containers:
  - name: nginx
    image: nginx:1.21
  - name: sidecar
    image: busybox
    command: ['sh', '-c', 'while true; do echo Hello from sidecar; sleep 30; done']
```
</details>

### Exercise 2: Debug a Failing Pod

Create a Pod with an invalid image name and practice debugging.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: broken-pod
spec:
  containers:
  - name: app
    image: this-image-does-not-exist:latest
```

**Tasks**:
1. Apply the Pod
2. Use `kubectl describe` to find the error
3. Use `kubectl get events` to see what happened
4. Fix the image name and redeploy

### Exercise 3: Pod with Environment Variables

Create a Pod that uses environment variables:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: env-pod
spec:
  containers:
  - name: alpine
    image: alpine:3.14
    command: ['sh', '-c', 'echo "Hello $NAME from $LOCATION" && sleep 3600']
    env:
    - name: NAME
      value: "Student"
    - name: LOCATION
      value: "Kubernetes"
```

**Tasks**:
1. Deploy the Pod
2. Check logs to see the output
3. Exec into the Pod and print environment variables: `env`

## ✅ Validation

Check your understanding:

**Questions**:
1. What command shows all Pods in the current namespace?
2. How do you view logs from a Pod?
3. Can you update a running Pod's image? Why or why not?
4. What's the difference between `kubectl apply` and `kubectl create`?

**Practical Check**:

```bash
# You should be able to:
# 1. Create a Pod from YAML ✓
# 2. View Pod details ✓
# 3. Access Pod logs ✓
# 4. Execute commands in Pod ✓
# 5. Delete a Pod ✓
```

## 📚 Key Takeaways

- 📌 **Pods** are the smallest deployable units in Kubernetes
- 📌 Pods are **ephemeral** - they can be created and destroyed
- 📌 Each Pod has a **unique IP address**
- 📌 Pods are **immutable** - to update, you must recreate
- 📌 Use `kubectl describe` for debugging
- 📌 Use `kubectl logs` to view container output
- 📌 Pods alone are not ideal for production (no self-healing)

## 🐛 Common Issues

### Pod stays in Pending state
```bash
kubectl describe pod <name>
# Look for: insufficient resources, node selector issues
```

### ImagePullBackOff error
```bash
kubectl describe pod <name>
# Usually: wrong image name, no access to registry
```

### CrashLoopBackOff
```bash
kubectl logs <name>
# Container is starting but crashing, check logs
```

## 🎯 Next Steps

**Completed Iteration 1.1?** Great! 🎉

You now understand Pods, but Pods alone aren't production-ready. They don't self-heal or scale.

**Next**: [Iteration 1.2: Create a Deployment](../1.2-deployment/README.md)

In 1.2, you'll learn how to manage Pods with Deployments for:
- Automatic restarts
- Scaling
- Rolling updates
- Self-healing

---

**Need Help?**
- Check [kubectl cheatsheet](../../resources/kubectl-cheatsheet.md)
- Review [troubleshooting guide](../../resources/troubleshooting.md)
- Re-read Kubernetes official [Pod documentation](https://kubernetes.io/docs/concepts/workloads/pods/)

**Keep going!** 💪
