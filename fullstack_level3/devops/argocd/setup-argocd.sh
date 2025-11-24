#!/bin/bash
set -e

# Check if arguments are provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <GITHUB_USER> <GITHUB_PAT> <REPO_URL>"
    echo "Example: $0 hcmuleva ghp_xxxx https://github.com/hcmuleva/els-release.git"
    exit 1
fi

GITHUB_USER=$1
GITHUB_PAT=$2
REPO_URL=$3

echo "🚀 Starting ArgoCD Setup..."

# 1. Create Namespaces
echo "📦 Creating namespaces..."
kubectl create namespace dev --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace prod --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -

# 2. Add Repository Credentials
echo "🔐 Configuring Repository Credentials..."
kubectl create secret generic repo-credentials \
  --from-literal=url="$REPO_URL" \
  --from-literal=username="$GITHUB_USER" \
  --from-literal=password="$GITHUB_PAT" \
  --from-literal=type="git" \
  -n argocd \
  --dry-run=client -o yaml | kubectl apply -f -

# Label the secret for ArgoCD to pick it up
kubectl label secret repo-credentials -n argocd "argocd.argoproj.io/secret-type=repository" --overwrite

# 3. Apply Projects
echo "📂 Applying AppProjects..."
kubectl apply -f projects/dev.yaml
kubectl apply -f projects/prod.yaml

# 4. Apply Applications
echo "🚀 Applying Applications..."
kubectl apply -f applications/client-dev.yaml
kubectl apply -f applications/client-prod.yaml
kubectl apply -f applications/server-dev.yaml
kubectl apply -f applications/server-prod.yaml

echo "✅ ArgoCD Setup Complete!"
echo "   Dev Namespace (client-dev + server-dev):"
echo "     - https://argocd.local/applications/client-dev"
echo "     - https://argocd.local/applications/server-dev"
echo "   Prod Namespace (client-prod + server-prod):"
echo "     - https://argocd.local/applications/client-prod"
echo "     - https://argocd.local/applications/server-prod"
