#!/bin/bash

# Install and configure HashiCorp Vault for Kubernetes
# This script sets up Vault in development mode for learning purposes

set -e

echo "🚀 Installing HashiCorp Vault..."

# Add HashiCorp Helm repository
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update

# Create namespace
kubectl create namespace vault --dry-run=client -o yaml | kubectl apply -f -

# Install Vault in dev mode
echo "📦 Installing Vault in development mode..."
helm upgrade --install vault hashicorp/vault \
  --namespace vault \
  --set "server.dev.enabled=true" \
  --set "server.dev.devRootToken=root" \
  --set "ui.enabled=true" \
  --set "ui.serviceType=ClusterIP" \
  --wait

echo "⏳ Waiting for Vault to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=vault -n vault --timeout=300s

echo "🔧 Configuring Vault..."

# Enable KV v2 secrets engine
kubectl exec -n vault vault-0 -- vault secrets enable -path=secret kv-v2 2>/dev/null || true

# Create policy for temple-app
kubectl exec -n vault vault-0 -- vault policy write temple-app - <<EOF
path "secret/data/temple/*" {
  capabilities = ["read", "list"]
}
path "secret/metadata/temple/*" {
  capabilities = ["read", "list"]
}
EOF

# Enable Kubernetes auth
kubectl exec -n vault vault-0 -- vault auth enable kubernetes 2>/dev/null || true

# Configure Kubernetes auth
kubectl exec -n vault vault-0 -- vault write auth/kubernetes/config \
  kubernetes_host="https://kubernetes.default.svc:443"

# Create role for temple-app
kubectl exec -n vault vault-0 -- vault write auth/kubernetes/role/temple-app \
  bound_service_account_names=temple-api,default \
  bound_service_account_namespaces=temple-stack \
  policies=temple-app \
  ttl=24h

# Store sample secrets
echo "🔐 Storing sample secrets..."

kubectl exec -n vault vault-0 -- vault kv put secret/temple/database \
  username=temple_user \
  password=SecurePassword123! \
  database=temple_db \
  host=postgres-service \
  port=5432

kubectl exec -n vault vault-0 -- vault kv put secret/temple/api \
  admin_jwt_secret=your-super-secret-jwt-key-change-in-production \
  api_token_salt=random-salt-value

echo "✅ Vault installation complete!"
echo ""
echo "📊 Vault Status:"
kubectl get pods -n vault
echo ""
echo "🔑 Vault Root Token: root"
echo "🌐 Access Vault UI:"
echo "   kubectl port-forward -n vault svc/vault 8200:8200"
echo "   Then open: http://localhost:8200"
echo ""
echo "🧪 Verify secrets:"
echo "   kubectl exec -n vault vault-0 -- vault kv get secret/temple/database"
