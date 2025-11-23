#!/bin/bash

echo "🌐 Starting port-forwards for monitoring dashboards..."
echo ""
echo "Opening dashboards:"
echo "  - Kiali:      http://localhost:20001"
echo "  - Grafana:    http://localhost:3000"
echo "  - Jaeger:     http://localhost:16686"
echo "  - Prometheus: http://localhost:9090"
echo ""
echo "Press Ctrl+C to stop all port-forwards"
echo ""

# Start port-forwards in background
kubectl port-forward -n istio-system svc/kiali 20001:20001 &
KIALI_PID=$!

kubectl port-forward -n istio-system svc/grafana 3000:3000 &
GRAFANA_PID=$!

kubectl port-forward -n istio-system svc/tracing 16686:80 &
JAEGER_PID=$!

kubectl port-forward -n istio-system svc/prometheus 9090:9090 &
PROMETHEUS_PID=$!

# Trap Ctrl+C to kill all port-forwards
trap "kill $KIALI_PID $GRAFANA_PID $JAEGER_PID $PROMETHEUS_PID 2>/dev/null; exit" INT TERM

# Wait for all processes
wait
