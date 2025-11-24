#!/bin/bash

echo "🔍 Checking Istio Metrics Collection..."
echo ""

# 1. Check if pods have Istio sidecars
echo "1. Checking if Istio sidecars are injected:"
kubectl get pods -n default -o jsonpath='{range .items[*]}{.metadata.name}{"\t containers: "}{.spec.containers[*].name}{"\n"}{end}'
echo ""

# 2. Check if namespace has Istio injection enabled
echo "2. Checking namespace label:"
kubectl get namespace default -o jsonpath='{.metadata.labels}' | grep istio-injection
echo ""
echo ""

# 3. Make test requests
echo "3. Making test requests to generate metrics..."
for i in {1..5}; do
  echo "  Request $i..."
  curl -s -o /dev/null -w "Status: %{http_code}\n" http://els-api.local/api/
  sleep 1
done
echo ""

# 4. Check Prometheus for Istio metrics
echo "4. Checking if Prometheus is collecting Istio metrics..."
kubectl exec -n istio-system deploy/prometheus -c prometheus-server -- wget -q -O- 'http://localhost:9090/api/v1/query?query=istio_requests_total' | python3 -m json.tool 2>/dev/null || echo "Metrics query executed (check Grafana for visualization)"
echo ""

echo "✅ Diagnostics complete!"
echo ""
echo "📊 To view metrics:"
echo "   - Grafana: http://localhost:3000"
echo "   - Kiali: http://localhost:20001"
echo "   - Prometheus: http://localhost:9090"
