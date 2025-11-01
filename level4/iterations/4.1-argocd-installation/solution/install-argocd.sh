#!/bin/bash
# ArgoCD Installation Script

set -e

echo "🚀 Installing ArgoCD"
echo "==================="
echo ""

# Create namespace
echo "📦 Creating argocd namespace..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -

# Install ArgoCD
echo ""
echo "📥 Installing ArgoCD (this may take a few minutes)..."
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for pods
echo ""
echo "⏳ Waiting for ArgoCD pods to be ready..."
kubectl wait --for=condition=ready pod --all -n argocd --timeout=300s

# Show installation
echo ""
echo "✅ ArgoCD installed successfully!"
echo ""
echo "📊 Installed components:"
kubectl get pods -n argocd

echo ""
echo "🌐 Services:"
kubectl get svc -n argocd

# Get admin password
echo ""
echo "🔑 Getting admin password..."
ARGOCD_PASSWORD=$(kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d)

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║   ArgoCD Installation Complete! 🎉    ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "📝 Access Information:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  Start port-forward in a new terminal:"
echo "   kubectl port-forward svc/argocd-server -n argocd 8080:443"
echo ""
echo "2️⃣  Open browser:"
echo "   https://localhost:8080"
echo ""
echo "3️⃣  Login credentials:"
echo "   Username: admin"
echo "   Password: $ARGOCD_PASSWORD"
echo ""
echo "4️⃣  Install ArgoCD CLI (macOS):"
echo "   brew install argocd"
echo ""
echo "5️⃣  Login via CLI:"
echo "   argocd login localhost:8080"
echo "   (use username: admin, password: $ARGOCD_PASSWORD)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  IMPORTANT: Change admin password after first login!"
echo "   UI: User Info → Update Password"
echo "   CLI: argocd account update-password"
echo ""
echo "📚 Next steps:"
echo "   - Access UI and explore dashboard"
echo "   - Add Git repositories: Settings → Repositories"
echo "   - Create your first application: Iteration 4.2"
echo ""
