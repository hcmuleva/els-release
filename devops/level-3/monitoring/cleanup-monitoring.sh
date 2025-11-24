#!/bin/bash
set -e

echo "🧹 Cleaning up existing Istio installation..."

# Remove addons
echo "📦 Removing addons..."
kubectl delete -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/kiali.yaml --ignore-not-found=true
kubectl delete -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/jaeger.yaml --ignore-not-found=true
kubectl delete -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/grafana.yaml --ignore-not-found=true
kubectl delete -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/prometheus.yaml --ignore-not-found=true

# Uninstall Helm releases if they exist
echo "📦 Uninstalling Helm releases..."
helm uninstall istiod -n istio-system --ignore-not-found 2>/dev/null || true
helm uninstall istio-base -n istio-system --ignore-not-found 2>/dev/null || true

# Delete Istio CRDs (cluster-scoped resources)
echo "📦 Deleting Istio CRDs..."
kubectl get crd -o name | grep --color=never 'istio.io' | xargs -r kubectl delete --ignore-not-found=true

# Delete Istio webhook configurations (cluster-scoped resources)
echo "📦 Deleting Istio webhook configurations..."
kubectl get validatingwebhookconfiguration -o name | grep --color=never 'istio' | xargs -r kubectl delete --ignore-not-found=true
kubectl get mutatingwebhookconfiguration -o name | grep --color=never 'istio' | xargs -r kubectl delete --ignore-not-found=true

# Delete Istio ClusterRoles and ClusterRoleBindings
echo "📦 Deleting Istio ClusterRoles and ClusterRoleBindings..."
kubectl delete clusterrole -l app.kubernetes.io/part-of=istio --ignore-not-found=true
kubectl delete clusterrolebinding -l app.kubernetes.io/part-of=istio --ignore-not-found=true
kubectl delete clusterrole istiod-clusterrole-istio-system --ignore-not-found=true
kubectl delete clusterrole istiod-gateway-controller-istio-system --ignore-not-found=true
kubectl delete clusterrolebinding istiod-clusterrole-istio-system --ignore-not-found=true
kubectl delete clusterrolebinding istiod-gateway-controller-istio-system --ignore-not-found=true

# Delete the namespace (this will remove all remaining resources)
echo "📦 Deleting istio-system namespace..."
kubectl delete namespace istio-system --ignore-not-found=true

# Wait for namespace deletion
echo "⏳ Waiting for namespace deletion..."
kubectl wait --for=delete namespace/istio-system --timeout=60s 2>/dev/null || true

echo "✅ Cleanup completed!"
