#!/bin/bash
set -e

echo "🚀 Starting Monitoring Stack Setup (Istio + Addons)..."

# 1. Install Istio Base
echo "📦 Installing Istio Base..."
helm repo add istio https://istio-release.storage.googleapis.com/charts
helm repo update
helm upgrade --install istio-base istio/base -n istio-system --create-namespace

# 2. Install Istiod
echo "📦 Installing Istiod..."
helm upgrade --install istiod istio/istiod -n istio-system --wait

# 3. Install Addons (Prometheus, Grafana, Jaeger, Kiali)
# Using standard samples from Istio repository
echo "📦 Installing Addons (Prometheus, Grafana, Jaeger, Kiali)..."
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/prometheus.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/grafana.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/jaeger.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/kiali.yaml

echo "✅ Monitoring Stack Installed!"
echo ""
echo "🔍 To access the dashboards, run the following commands in separate terminals:"
echo "   istioctl dashboard kiali"
echo "   istioctl dashboard grafana"
echo "   istioctl dashboard jaeger"
echo "   istioctl dashboard prometheus"
echo ""
echo "⚠️  Note: Ensure you label your namespace for Istio injection to see metrics:"
echo "   kubectl label namespace default istio-injection=enabled"
