# kubectl Cheat Sheet - Level 1

## 🎯 Essential Commands for Beginners

### Cluster Information

```bash
# Get cluster info
kubectl cluster-info

# View cluster details
kubectl cluster-info dump

# Get nodes
kubectl get nodes
kubectl get nodes -o wide

# Check kubectl version
kubectl version --client
```

### Working with Namespaces

```bash
# List all namespaces
kubectl get namespaces
kubectl get ns

# Create namespace
kubectl create namespace my-namespace

# Set default namespace
kubectl config set-context --current --namespace=my-namespace

# View current namespace
kubectl config view --minify | grep namespace:

# Delete namespace
kubectl delete namespace my-namespace
```

### Pod Operations

```bash
# Create pod from YAML
kubectl apply -f pod.yaml

# Get pods
kubectl get pods
kubectl get pods -o wide              # More details
kubectl get pods --all-namespaces     # All namespaces
kubectl get pods -n namespace-name    # Specific namespace
kubectl get pods -w                   # Watch mode

# Describe pod (detailed info)
kubectl describe pod pod-name

# Get pod logs
kubectl logs pod-name
kubectl logs pod-name -f              # Follow logs
kubectl logs pod-name --tail=50       # Last 50 lines
kubectl logs pod-name -c container    # Specific container

# Execute command in pod
kubectl exec pod-name -- ls /
kubectl exec -it pod-name -- /bin/bash

# Port forward
kubectl port-forward pod/pod-name 8080:80

# Delete pod
kubectl delete pod pod-name
kubectl delete -f pod.yaml
```

### Deployment Operations

```bash
# Create deployment
kubectl create deployment nginx --image=nginx:1.21
kubectl apply -f deployment.yaml

# Get deployments
kubectl get deployments
kubectl get deploy

# Describe deployment
kubectl describe deployment deployment-name

# Scale deployment
kubectl scale deployment deployment-name --replicas=5

# Update image
kubectl set image deployment/deployment-name container-name=nginx:1.22

# Rollout status
kubectl rollout status deployment/deployment-name

# Rollout history
kubectl rollout history deployment/deployment-name

# Rollback
kubectl rollout undo deployment/deployment-name
kubectl rollout undo deployment/deployment-name --to-revision=2

# Delete deployment
kubectl delete deployment deployment-name
```

### Service Operations

```bash
# Create service
kubectl expose deployment deployment-name --port=80 --target-port=8080
kubectl apply -f service.yaml

# Get services
kubectl get services
kubectl get svc

# Describe service
kubectl describe service service-name

# Get service endpoints
kubectl get endpoints service-name

# Delete service
kubectl delete service service-name
```

### Common Patterns

```bash
# Get all resources
kubectl get all
kubectl get all -n namespace-name

# Get events
kubectl get events
kubectl get events --sort-by='.lastTimestamp'

# Get resource YAML
kubectl get pod pod-name -o yaml
kubectl get deployment deployment-name -o yaml

# Get resource JSON
kubectl get pod pod-name -o json

# Explain resources
kubectl explain pod
kubectl explain pod.spec
kubectl explain pod.spec.containers

# Apply multiple files
kubectl apply -f folder/
kubectl apply -f file1.yaml -f file2.yaml

# Delete multiple resources
kubectl delete -f folder/
kubectl delete pod pod1 pod2 pod3
```

### Debugging

```bash
# Describe for troubleshooting
kubectl describe pod pod-name

# View logs
kubectl logs pod-name
kubectl logs pod-name --previous      # Previous container logs

# Check events
kubectl get events --sort-by='.lastTimestamp'

# Run debug pod
kubectl run debug --image=busybox -it --rm --restart=Never -- sh

# Check resource usage (requires metrics-server)
kubectl top nodes
kubectl top pods
```

### Labels and Selectors

```bash
# Show labels
kubectl get pods --show-labels

# Filter by label
kubectl get pods -l app=nginx
kubectl get pods -l environment=production

# Add label
kubectl label pod pod-name env=dev

# Remove label
kubectl label pod pod-name env-

# Update label
kubectl label pod pod-name env=prod --overwrite
```

### Useful Output Formats

```bash
# Wide output
kubectl get pods -o wide

# YAML output
kubectl get pod pod-name -o yaml

# JSON output
kubectl get pod pod-name -o json

# Custom columns
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase

# JSONPath
kubectl get pods -o jsonpath='{.items[*].metadata.name}'
```

### Context and Configuration

```bash
# View config
kubectl config view

# Get contexts
kubectl config get-contexts

# Switch context
kubectl config use-context context-name

# Set namespace in context
kubectl config set-context --current --namespace=my-namespace
```

### Shortcuts

```bash
# Resource type shortcuts
po    = pods
deploy = deployments
svc   = services
ns    = namespaces
no    = nodes
cm    = configmaps
pv    = persistentvolumes
pvc   = persistentvolumeclaims

# Examples
kubectl get po
kubectl get deploy
kubectl get svc
```

## 🎯 Level 1 Specific Commands

### Iteration 1.1 - Pods

```bash
kubectl apply -f pod.yaml
kubectl get pods
kubectl describe pod nginx-pod
kubectl logs nginx-pod
kubectl exec -it nginx-pod -- /bin/bash
kubectl port-forward pod/nginx-pod 8080:80
kubectl delete pod nginx-pod
```

### Iteration 1.2 - Deployments

```bash
kubectl apply -f deployment.yaml
kubectl get deployments
kubectl scale deployment nginx-deployment --replicas=3
kubectl set image deployment/nginx-deployment nginx=nginx:1.22
kubectl rollout status deployment/nginx-deployment
kubectl rollout undo deployment/nginx-deployment
```

### Iteration 1.3 - Services

```bash
kubectl apply -f service.yaml
kubectl get services
kubectl describe service nginx-service
kubectl get endpoints nginx-service
```

### Iteration 1.4 - Health Checks & Resources

```bash
kubectl apply -f deployment-with-probes.yaml
kubectl describe pod <pod-name> | grep -A 10 Liveness
kubectl describe pod <pod-name> | grep -A 10 Readiness
kubectl top pod <pod-name>  # Requires metrics-server
```

## 🔥 Pro Tips

### 1. Use aliases

```bash
# Add to ~/.bashrc or ~/.zshrc
alias k='kubectl'
alias kg='kubectl get'
alias kd='kubectl describe'
alias kl='kubectl logs'
alias ka='kubectl apply -f'
alias kdel='kubectl delete'

# Now you can use:
k get pods
kg svc
kd pod nginx-pod
```

### 2. Enable kubectl autocomplete

```bash
# Bash
echo 'source <(kubectl completion bash)' >>~/.bashrc

# Zsh
echo 'source <(kubectl completion zsh)' >>~/.zshrc

# Reload shell
source ~/.bashrc  # or source ~/.zshrc
```

### 3. Use dry-run for YAML generation

```bash
# Generate pod YAML
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml

# Generate deployment YAML
kubectl create deployment nginx --image=nginx --dry-run=client -o yaml > deployment.yaml

# Generate service YAML
kubectl expose deployment nginx --port=80 --dry-run=client -o yaml > service.yaml
```

### 4. Watch resources in real-time

```bash
# Watch pods
kubectl get pods -w

# Watch events
kubectl get events -w

# Watch specific resource
watch kubectl get pods
```

### 5. Quick pod creation

```bash
# Run temporary pod
kubectl run test --image=busybox -it --rm --restart=Never -- sh

# Run nginx for testing
kubectl run nginx --image=nginx --port=80
```

## 📚 Additional Resources

- [Official kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [kubectl Quick Reference](https://kubernetes.io/docs/reference/kubectl/quick-reference/)
- [kubectl Commands](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands)

## 🎯 Practice

Try these commands daily to build muscle memory:

```bash
# Morning routine
kubectl get nodes
kubectl get pods
kubectl get all

# When debugging
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl get events --sort-by='.lastTimestamp'

# Before leaving
kubectl get all
kubectl get events | grep Error
```

---

**Remember**: The best way to learn is by doing. Use these commands regularly!
