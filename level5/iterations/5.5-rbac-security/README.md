# Iteration 5.5: RBAC and Security Policies

**Duration**: ~2-3 hours  
**Difficulty**: ⭐⭐⭐⭐ Advanced

## 🎯 Learning Objectives

- ✅ Implement Role-Based Access Control (RBAC)
- ✅ Create ServiceAccounts, Roles, and RoleBindings
- ✅ Configure Pod Security Standards
- ✅ Implement least privilege principle
- ✅ Audit RBAC permissions

## 🔐 RBAC Components

```
ServiceAccount → RoleBinding → Role → Resources
      │              │           │
      │              └───────────┘
      └──────────────────────────────► Pod
```

## 👤 ServiceAccount Creation

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: temple-api
  namespace: temple-stack
automountServiceAccountToken: true
```

## 📜 Role for Application

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: temple-api-role
  namespace: temple-stack
rules:
- apiGroups: [""]
  resources: ["configmaps", "secrets"]
  verbs: ["get", "list"]
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]
```

## 🔗 RoleBinding

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: temple-api-binding
  namespace: temple-stack
subjects:
- kind: ServiceAccount
  name: temple-api
  namespace: temple-stack
roleRef:
  kind: Role
  name: temple-api-role
  apiGroup: rbac.authorization.k8s.io
```

## 🌐 ClusterRole for Cross-Namespace Access

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: temple-cluster-reader
rules:
- apiGroups: [""]
  resources: ["namespaces", "nodes"]
  verbs: ["get", "list"]
- apiGroups: ["apps"]
  resources: ["deployments", "statefulsets"]
  verbs: ["get", "list"]
```

## 🛡️ Pod Security Standards

### Restricted Policy

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: temple-stack
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

### Security Context for Pods

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: temple-api-secure
spec:
  template:
    spec:
      serviceAccountName: temple-api
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 2000
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: api
        image: temple-api:latest
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
        volumeMounts:
        - name: tmp
          mountPath: /tmp
      volumes:
      - name: tmp
        emptyDir: {}
```

## 👨‍💼 Developer Role (Limited Access)

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer
  namespace: temple-stack
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "update", "patch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: developer-binding
  namespace: temple-stack
subjects:
- kind: User
  name: developer@example.com
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: developer
  apiGroup: rbac.authorization.k8s.io
```

## 🔍 RBAC Audit

```bash
# Check if user can perform action
kubectl auth can-i create pods --namespace temple-stack --as developer@example.com

# List all permissions for a user
kubectl auth can-i --list --namespace temple-stack --as developer@example.com

# Check ServiceAccount permissions
kubectl auth can-i --list --as system:serviceaccount:temple-stack:temple-api
```

## ✅ Validation

```bash
# Verify ServiceAccount
kubectl get sa temple-api -n temple-stack

# Verify Role
kubectl get role temple-api-role -n temple-stack

# Verify RoleBinding
kubectl get rolebinding temple-api-binding -n temple-stack

# Test permissions
kubectl auth can-i get secrets --as system:serviceaccount:temple-stack:temple-api -n temple-stack
```

## 🎯 Next Steps

**Next**: [Iteration 5.6: Network Policies](../5.6-network-policies/README.md)
