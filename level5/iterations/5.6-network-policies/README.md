# Iteration 5.6: Network Policies

**Duration**: ~2 hours  
**Difficulty**: ⭐⭐⭐⭐ Advanced

## 🎯 Learning Objectives

- ✅ Understand Kubernetes Network Policies
- ✅ Implement default deny policies
- ✅ Create allow policies for specific traffic
- ✅ Secure database access
- ✅ Implement namespace isolation

## 🔒 Default Deny All Traffic

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: temple-stack
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

## ✅ Allow Temple UI → Temple API

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ui-to-api
  namespace: temple-stack
spec:
  podSelector:
    matchLabels:
      app: temple-api
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: temple-ui
    ports:
    - protocol: TCP
      port: 1337
```

## 🗄️ Allow Temple API → PostgreSQL

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-postgres
  namespace: temple-stack
spec:
  podSelector:
    matchLabels:
      app: postgres
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: temple-api
    ports:
    - protocol: TCP
      port: 5432
```

## 🌐 Allow Ingress Traffic

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress-to-ui
  namespace: temple-stack
spec:
  podSelector:
    matchLabels:
      app: temple-ui
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 80
```

## 🔐 Complete Temple Stack Network Policy

```yaml
---
# Default deny all
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: temple-stack
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress

---
# Allow DNS
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns
  namespace: temple-stack
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: UDP
      port: 53

---
# Temple UI policies
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: temple-ui-policy
  namespace: temple-stack
spec:
  podSelector:
    matchLabels:
      app: temple-ui
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: temple-api
    ports:
    - protocol: TCP
      port: 1337

---
# Temple API policies
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: temple-api-policy
  namespace: temple-stack
spec:
  podSelector:
    matchLabels:
      app: temple-api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: temple-ui
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - protocol: TCP
      port: 5432

---
# PostgreSQL policies
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: postgres-policy
  namespace: temple-stack
spec:
  podSelector:
    matchLabels:
      app: postgres
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: temple-api
    ports:
    - protocol: TCP
      port: 5432
```

## ✅ Validation

```bash
# Apply policies
kubectl apply -f network-policies.yaml

# Test connectivity
kubectl run test-pod --image=busybox -n temple-stack -- sleep 3600

# Should fail (blocked by default deny)
kubectl exec -n temple-stack test-pod -- wget -qO- temple-api-service:1337

# Should succeed from temple-ui pod
kubectl exec -n temple-stack <temple-ui-pod> -- curl temple-api-service:1337
```

## 🎯 Next Steps

**Next**: [Iteration 5.7: Backup and Disaster Recovery](../5.7-backup-dr/README.md)
