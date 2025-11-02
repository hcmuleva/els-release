# Iteration 5.2: Monitoring with Prometheus & Grafana

**Duration**: ~3-4 hours  
**Difficulty**: ⭐⭐⭐⭐ Advanced

## 🎯 Learning Objectives

- ✅ Install Prometheus and Grafana using kube-prometheus-stack
- ✅ Configure ServiceMonitors for temple-stack
- ✅ Create custom Grafana dashboards
- ✅ Set up alerting rules
- ✅ Monitor application and infrastructure metrics
- ✅ Implement custom application metrics

## 📚 Monitoring Stack

```
┌─────────────────────────────────────────────────┐
│              Kubernetes Cluster                 │
│                                                 │
│  ┌──────────┐    ┌────────────┐    ┌─────────┐ │
│  │  Apps    │───►│ Prometheus │───►│ Grafana │ │
│  │  Metrics │    │  Server    │    │  UI     │ │
│  └──────────┘    └────────────┘    └─────────┘ │
│                         │                       │
│                         ▼                       │
│                  ┌────────────┐                 │
│                  │ Alertmanager│                │
│                  └────────────┘                 │
└─────────────────────────────────────────────────┘
```

## 🚀 Installation

### Install kube-prometheus-stack

```bash
# Add Prometheus community repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Create namespace
kubectl create namespace monitoring

# Install kube-prometheus-stack
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --set grafana.adminPassword=admin \
  --wait

# Verify installation
kubectl get pods -n monitoring
```

### Access Dashboards

```bash
# Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
# http://localhost:3000 (admin/admin)

# Prometheus
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090
# http://localhost:9090

# Alertmanager
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-alertmanager 9093:9093
# http://localhost:9093
```

## 📊 ServiceMonitor Configuration

### Temple API ServiceMonitor

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: temple-api-monitor
  namespace: temple-stack
  labels:
    app: temple-api
spec:
  selector:
    matchLabels:
      app: temple-api
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
```

### PostgreSQL Exporter

```yaml
# Deploy postgres-exporter
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-exporter
  namespace: temple-stack
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres-exporter
  template:
    metadata:
      labels:
        app: postgres-exporter
    spec:
      containers:
      - name: postgres-exporter
        image: prometheuscommunity/postgres-exporter:v0.15.0
        env:
        - name: DATA_SOURCE_NAME
          value: "postgresql://temple_user:temple_password@postgres-service:5432/temple_db?sslmode=disable"
        ports:
        - containerPort: 9187
          name: metrics
```

## 🎨 Custom Grafana Dashboard

Create dashboard for temple-stack:

**Panels**:
1. **API Request Rate** - HTTP requests per second
2. **API Response Time** - p50, p95, p99 latencies
3. **Database Connections** - Active connections
4. **Pod CPU/Memory** - Resource usage
5. **Error Rate** - 4xx/5xx errors

## 🚨 Alerting Rules

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: temple-alerts
  namespace: monitoring
spec:
  groups:
  - name: temple-stack
    interval: 30s
    rules:
    - alert: HighErrorRate
      expr: |
        sum(rate(http_requests_total{status=~"5.."}[5m])) 
        / sum(rate(http_requests_total[5m])) > 0.05
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "High error rate detected"
        description: "Error rate is {{ $value | humanizePercentage }}"
    
    - alert: PodCrashLooping
      expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "Pod is crash looping"
```

## ✅ Validation

```bash
# Check ServiceMonitors
kubectl get servicemonitor -n temple-stack

# Check Prometheus targets
# Open http://localhost:9090/targets

# Check Grafana dashboards
# Open http://localhost:3000

# Verify metrics
curl http://localhost:9090/api/v1/query?query=up
```

## 🎯 Next Steps

**Next**: [Iteration 5.3: Service Mesh with Istio](../5.3-istio/README.md)

Deploy Istio for advanced traffic management and observability.
