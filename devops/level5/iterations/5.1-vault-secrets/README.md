# Iteration 5.1: Secrets Management with HashiCorp Vault

**Duration**: ~3-4 hours  
**Difficulty**: ⭐⭐⭐⭐⭐ Expert

## 🎯 Learning Objectives

- ✅ Install HashiCorp Vault in Kubernetes
- ✅ Configure Vault with Kubernetes auth
- ✅ Store and retrieve secrets in Vault
- ✅ Integrate Vault with External Secrets Operator
- ✅ Migrate temple-stack to use Vault for secrets
- ✅ Implement secret rotation

## 📚 Why Vault?

**Kubernetes Secrets Limitations**:
- Base64 encoded (not encrypted at rest by default)
- No secret rotation
- No audit trail
- No centralized management

**Vault Benefits**:
- 🔒 Encrypted at rest and in transit
- 🔄 Automatic secret rotation
- 📝 Full audit logging
- 🎯 Centralized secret management
- 🔑 Dynamic secrets generation

## 🛠️ Architecture

```
┌─────────────────────────────────────────┐
│         Kubernetes Cluster              │
│                                         │
│  ┌─────────────┐    ┌──────────────┐  │
│  │   Vault     │◄───│   External   │  │
│  │   Server    │    │   Secrets    │  │
│  │             │    │   Operator   │  │
│  └─────────────┘    └──────┬───────┘  │
│                             │          │
│                             ▼          │
│                     ┌──────────────┐  │
│                     │  Kubernetes  │  │
│                     │   Secrets    │  │
│                     └──────┬───────┘  │
│                             │          │
│                             ▼          │
│                     ┌──────────────┐  │
│                     │  Temple App  │  │
│                     └──────────────┘  │
└─────────────────────────────────────────┘
```

## 🚀 Installation

### Step 1: Install Vault with Helm

```bash
# Add HashiCorp Helm repository
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update

# Create namespace
kubectl create namespace vault

# Install Vault in dev mode (for learning)
helm install vault hashicorp/vault \
  --namespace vault \
  --set "server.dev.enabled=true" \
  --set "server.dev.devRootToken=root" \
  --set "ui.enabled=true" \
  --set "ui.serviceType=LoadBalancer"

# Wait for Vault to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=vault -n vault --timeout=300s
```

### Step 2: Access Vault UI

```bash
# Get Vault UI URL
kubectl get svc -n vault vault-ui

# Port-forward to access UI
kubectl port-forward -n vault svc/vault-ui 8200:8200

# Open browser: http://localhost:8200
# Token: root
```

### Step 3: Configure Vault

```bash
# Exec into Vault pod
kubectl exec -n vault -it vault-0 -- /bin/sh

# Enable KV v2 secrets engine
vault secrets enable -path=secret kv-v2

# Create policy for Kubernetes
vault policy write temple-app - <<EOF
path "secret/data/temple/*" {
  capabilities = ["read", "list"]
}
EOF

# Enable Kubernetes auth
vault auth enable kubernetes

# Configure Kubernetes auth
vault write auth/kubernetes/config \
  kubernetes_host="https://kubernetes.default.svc:443"

# Create role for temple-app
vault write auth/kubernetes/role/temple-app \
  bound_service_account_names=temple-api \
  bound_service_account_namespaces=temple-stack \
  policies=temple-app \
  ttl=24h

# Exit pod
exit
```

### Step 4: Store Secrets in Vault

```bash
# Store database credentials
kubectl exec -n vault vault-0 -- vault kv put secret/temple/database \
  username=temple_user \
  password=super_secure_password_123 \
  database=temple_db \
  host=postgres-service

# Store API keys
kubectl exec -n vault vault-0 -- vault kv put secret/temple/api \
  admin_jwt_secret=your-jwt-secret-key \
  api_token=your-api-token

# Verify secrets
kubectl exec -n vault vault-0 -- vault kv get secret/temple/database
```

## 🔧 External Secrets Operator

### Step 1: Install External Secrets Operator

```bash
# Add repository
helm repo add external-secrets https://charts.external-secrets.io
helm repo update

# Install operator
helm install external-secrets \
  external-secrets/external-secrets \
  --namespace external-secrets-system \
  --create-namespace

# Verify installation
kubectl get pods -n external-secrets-system
```

### Step 2: Create SecretStore

```yaml
# secret-store.yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: vault-backend
  namespace: temple-stack
spec:
  provider:
    vault:
      server: "http://vault.vault:8200"
      path: "secret"
      version: "v2"
      auth:
        kubernetes:
          mountPath: "kubernetes"
          role: "temple-app"
          serviceAccountRef:
            name: "temple-api"
```

### Step 3: Create ExternalSecret

```yaml
# external-secret.yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: temple-database-secret
  namespace: temple-stack
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  
  target:
    name: postgres-secret
    creationPolicy: Owner
  
  data:
  - secretKey: username
    remoteRef:
      key: temple/database
      property: username
  
  - secretKey: password
    remoteRef:
      key: temple/database
      property: password
  
  - secretKey: database
    remoteRef:
      key: temple/database
      property: database
```

## ✅ Validation

```bash
# Check SecretStore
kubectl get secretstore -n temple-stack

# Check ExternalSecret
kubectl get externalsecret -n temple-stack

# Verify Kubernetes Secret was created
kubectl get secret postgres-secret -n temple-stack

# View secret data
kubectl get secret postgres-secret -n temple-stack -o jsonpath='{.data.username}' | base64 -d

# Check sync status
kubectl describe externalsecret temple-database-secret -n temple-stack
```

## 🎯 Practice Exercise

Update temple-stack deployment to use Vault secrets:

1. Create service account for temple-api
2. Configure Vault authentication
3. Create SecretStore and ExternalSecret
4. Update deployments to use synced secrets
5. Test secret rotation

## 🎯 Next Steps

**Next**: [Iteration 5.2: Monitoring with Prometheus & Grafana](../5.2-monitoring/README.md)

Implement comprehensive monitoring and alerting for your applications.

---

See `./solution/` for complete Vault configuration examples.
