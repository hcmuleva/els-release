# Iteration 1.3: Expose with a Service

**Duration**: ~1-2 hours  
**Difficulty**: ⭐⭐ Intermediate

## 🎯 Learning Objectives

By the end of this iteration, you will:
- ✅ Understand what Services are and why they're needed
- ✅ Create different types of Services (ClusterIP, NodePort, LoadBalancer)
- ✅ Expose Deployments to internal and external traffic
- ✅ Understand Kubernetes DNS
- ✅ Use labels and selectors for service discovery
- ✅ Debug service connectivity issues

## 📚 Background

### What is a Service?

Pods are ephemeral - they come and go. Their IP addresses change. How do other applications reliably connect to them?

**Enter Services** - stable endpoints to access Pods.

**Problems Services Solve**:
- 🔄 **Stable IP** - Service IP doesn't change even if pods restart
- 🎯 **Load Balancing** - Distributes traffic across multiple pod replicas
- 🔍 **Service Discovery** - DNS-based discovery (`my-service.namespace.svc.cluster.local`)
- 🌐 **External Access** - Expose apps outside the cluster

### Service Types

| Type | Use Case | Access |
|------|----------|--------|
| **ClusterIP** | Internal only | Within cluster |
| **NodePort** | Development/Testing | Node IP:Port |
| **LoadBalancer** | Production external | Cloud load balancer |
| **ExternalName** | External service alias | DNS CNAME |

## 📋 Prerequisites

- Completed [Iteration 1.2](../1.2-deployment/README.md)
- Running deployment from 1.2
- Level 1 namespace created

## 🎓 Theory

### Service YAML Structure

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: ClusterIP        # ClusterIP, NodePort, LoadBalancer
  selector:
    app: my-app          # Matches pod labels
  ports:
  - protocol: TCP
    port: 80             # Service port
    targetPort: 8080     # Container port
```

### How Services Work

```
Service (stable IP)
    ↓ selects pods by labels
Pods with matching labels
    ↓ traffic routed via
Endpoints (pod IPs)
```

### DNS in Kubernetes

Services get DNS names:
```
<service-name>.<namespace>.svc.cluster.local
```

Example:
```
nginx-service.level1.svc.cluster.local
```

Within the same namespace, you can use just:
```
nginx-service
```

## 🛠️ Hands-On Exercise

### Task 1: Create a ClusterIP Service

**ClusterIP** is the default - only accessible within the cluster.

1. First, ensure you have a deployment:

```bash
# Create deployment if you don't have one from 1.2
kubectl create deployment nginx --image=nginx:1.21 --replicas=3
```

2. Create `nginx-clusterip-service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: level1
spec:
  type: ClusterIP
  selector:
    app: nginx           # Must match deployment pod labels
  ports:
  - protocol: TCP
    port: 80            # Service port
    targetPort: 80      # Container port
```

3. Apply it:

```bash
kubectl apply -f nginx-clusterip-service.yaml
```

4. Verify:

```bash
# Get service
kubectl get svc nginx-service

# Should show:
# NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
# nginx-service   ClusterIP   10.96.100.123   <none>        80/TCP    10s

# Describe for details
kubectl describe svc nginx-service

# Check endpoints (pod IPs)
kubectl get endpoints nginx-service
```

### Task 2: Test ClusterIP Service

ClusterIP is only accessible from within the cluster. Let's test:

```bash
# Run a temporary pod to test
kubectl run test-pod --image=busybox:1.35 --rm -it -- sh

# Inside the pod:
wget -qO- nginx-service
# Should see nginx HTML

# Test DNS
wget -qO- nginx-service.level1.svc.cluster.local
# Should also work

# Exit the pod
exit
```

### Task 3: Create a NodePort Service

**NodePort** exposes the service on each Node's IP at a static port (30000-32767).

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
  namespace: level1
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80          # Service port
    targetPort: 80    # Container port
    nodePort: 30080   # Node port (optional, auto-assigned if omitted)
```

Apply and test:

```bash
kubectl apply -f nginx-nodeport-service.yaml

# Get service
kubectl get svc nginx-nodeport

# Should show:
# NAME             TYPE       CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
# nginx-nodeport   NodePort   10.96.50.10   <none>        80:30080/TCP   5s

# Access from your machine (Docker Desktop)
curl http://localhost:30080
# Should see nginx HTML
```

### Task 4: Create LoadBalancer Service

**LoadBalancer** creates an external load balancer (works in cloud, Docker Desktop).

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-loadbalancer
  namespace: level1
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```

Apply and check:

```bash
kubectl apply -f nginx-loadbalancer-service.yaml

# Get service
kubectl get svc nginx-loadbalancer

# Docker Desktop will assign localhost
# NAME                  TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
# nginx-loadbalancer    LoadBalancer   10.96.200.50    localhost     80:31234/TCP   10s

# Access it
curl http://localhost
# Should see nginx HTML
```

### Task 5: Understanding Selectors and Endpoints

Services use **selectors** to find pods:

```bash
# Check service selector
kubectl get svc nginx-service -o yaml | grep -A2 selector

# Check pod labels
kubectl get pods --show-labels

# Check endpoints (actual pod IPs)
kubectl get endpoints nginx-service

# Endpoints should match pod IPs
kubectl get pods -o wide
```

**Experiment**: Change pod labels and watch endpoints update:

```bash
# Remove label from one pod
kubectl label pod <pod-name> app-

# Check endpoints
kubectl get endpoints nginx-service
# One pod IP should be gone!

# Add label back
kubectl label pod <pod-name> app=nginx

# Endpoint returns
kubectl get endpoints nginx-service
```

### Task 6: Test Load Balancing

Services load balance across pods:

```bash
# Scale deployment
kubectl scale deployment nginx --replicas=3

# Check endpoints
kubectl get endpoints nginx-service
# Should see 3 pod IPs

# Test load balancing (from test pod)
kubectl run test --image=busybox:1.35 --rm -it -- sh

# Inside pod, make multiple requests
for i in $(seq 1 10); do
  wget -qO- nginx-service | grep hostname
done

# You should see requests distributed across different pods
exit
```

### Task 7: Service Discovery with DNS

```bash
# Run a test pod
kubectl run dns-test --image=busybox:1.35 --rm -it -- sh

# Test DNS resolution
nslookup nginx-service
# Should resolve to service ClusterIP

# Full DNS name
nslookup nginx-service.level1.svc.cluster.local

# Access service by name
wget -qO- http://nginx-service
# Works!

exit
```

## 🎯 Practice Exercises

### Exercise 1: Multi-Port Service

Create a service exposing multiple ports:
- Port 80 → container port 8080
- Port 443 → container port 8443

<details>
<summary>Solution</summary>

See `./solution/multi-port-service.yaml`

</details>

### Exercise 2: Headless Service

Create a headless service (clusterIP: None) for direct pod access.

<details>
<summary>Solution</summary>

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-headless
spec:
  clusterIP: None  # Headless!
  selector:
    app: nginx
  ports:
  - port: 80
```

Use case: StatefulSets, direct pod discovery

</details>

### Exercise 3: Service Without Selector

Create a service pointing to an external endpoint (e.g., external database).

<details>
<summary>Hint</summary>

Services can exist without selectors. You manually create Endpoints.

</details>

## ✅ Validation

Check your understanding:

**Questions**:
1. What's the difference between ClusterIP, NodePort, and LoadBalancer?
2. How do services find pods?
3. What is the DNS name format for services?
4. What are Endpoints?
5. When would you use a headless service?

**Practical Check**:

```bash
# Create a deployment
kubectl create deployment test-app --image=nginx:alpine --replicas=3

# Expose it with ClusterIP
kubectl expose deployment test-app --port=80 --target-port=80

# Verify service
kubectl get svc test-app

# Test from within cluster
kubectl run curl --image=curlimages/curl --rm -it -- curl test-app

# Create NodePort
kubectl expose deployment test-app --name=test-nodeport --type=NodePort --port=80

# Access from localhost
curl http://localhost:<node-port>

# Check endpoints match pods
kubectl get endpoints test-app
kubectl get pods -o wide
# IPs should match
```

## 📚 Key Takeaways

- 📌 **Services** provide stable networking for ephemeral pods
- 📌 **ClusterIP** - internal only (default)
- 📌 **NodePort** - exposes on node IP:port (development)
- 📌 **LoadBalancer** - external load balancer (production)
- 📌 Services use **selectors** to find pods via labels
- 📌 **Endpoints** are the actual pod IPs behind a service
- 📌 **DNS** enables service discovery by name
- 📌 Services **load balance** traffic across pod replicas

## 🐛 Common Issues

### Service not routing traffic

```bash
# Check selector matches pod labels
kubectl get svc <service> -o yaml | grep -A2 selector
kubectl get pods --show-labels

# Check endpoints exist
kubectl get endpoints <service>
# Should show pod IPs
```

### Endpoints empty

```bash
# No matching pods - check labels
kubectl get pods --show-labels
kubectl describe svc <service>

# Pods not ready - check pod status
kubectl get pods
kubectl describe pod <pod-name>
```

### Can't access NodePort

```bash
# Check NodePort range (30000-32767)
kubectl get svc

# For Docker Desktop, use localhost
curl http://localhost:<node-port>

# Check firewall rules on actual nodes
```

### DNS not resolving

```bash
# Check CoreDNS is running
kubectl get pods -n kube-system -l k8s-app=kube-dns

# Test DNS
kubectl run test --image=busybox:1.35 --rm -it -- nslookup kubernetes.default
```

## 🎯 Next Steps

**Completed Iteration 1.3?** Excellent! 🎉

You now know how to expose applications with Services. But what if pods crash or misbehave?

**Next**: [Iteration 1.4: Health Checks and Probes](../1.4-health-checks/README.md)

In 1.4, you'll learn to:
- Configure liveness probes
- Configure readiness probes
- Set resource limits
- Enable self-healing

---

**Pro Tip**: In production, always use ClusterIP for internal services and LoadBalancer (with Ingress) for external access! 🚀
