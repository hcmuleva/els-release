#!/bin/bash
# Complete Helm basics tutorial script

set -e

echo "🎓 Helm Basics Tutorial"
echo "======================="
echo ""

# Create namespace
echo "📦 Creating namespace level3..."
kubectl create namespace level3 --dry-run=client -o yaml | kubectl apply -f -

# Create the chart
echo ""
echo "📝 Creating nginx-chart..."
cd "$(dirname "$0")"

if [ ! -d "nginx-chart" ]; then
    echo "Error: nginx-chart directory not found!"
    echo "Make sure you're in the solution directory"
    exit 1
fi

# Lint the chart
echo ""
echo "🔍 Linting chart..."
helm lint nginx-chart

# Dry-run
echo ""
echo "🧪 Dry-run installation..."
helm install --dry-run --debug my-nginx ./nginx-chart -n level3 | head -50

# Install
echo ""
echo "🚀 Installing chart..."
helm install my-nginx ./nginx-chart -n level3

# Wait for deployment
echo ""
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=60s deployment/my-nginx-nginx -n level3

# Show results
echo ""
echo "✅ Installation complete!"
echo ""
echo "📊 Deployed resources:"
kubectl get all -n level3 -l release=my-nginx

echo ""
echo "📄 Release information:"
helm list -n level3

echo ""
echo "🔍 Test the deployment:"
echo "kubectl port-forward -n level3 svc/my-nginx-nginx 8080:80"
echo "curl http://localhost:8080"

echo ""
echo "📚 Common commands:"
echo "helm get all my-nginx -n level3        # Get all release info"
echo "helm get values my-nginx -n level3     # Get values"
echo "helm get manifest my-nginx -n level3   # Get manifest"
echo "helm history my-nginx -n level3        # Show history"
echo ""
echo "helm upgrade my-nginx ./nginx-chart --set replicaCount=3 -n level3"
echo "helm rollback my-nginx -n level3"
echo "helm uninstall my-nginx -n level3"
