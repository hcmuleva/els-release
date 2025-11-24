# Grafana Setup and Performance Testing Guide

## Step 1: Enable Istio Injection

First, enable Istio sidecar injection for your namespace:

```bash
# Label the default namespace for Istio injection
kubectl label namespace default istio-injection=enabled --overwrite

# Verify the label
kubectl get namespace default --show-labels
```

## Step 2: Restart Your Deployments

Restart your application deployments to inject Istio sidecars:

```bash
# Restart all deployments in default namespace
kubectl rollout restart deployment -n default

# Wait for rollout to complete
kubectl rollout status deployment -n default

# Verify pods now have 2 containers (app + istio-proxy)
kubectl get pods -n default
```

You should see `2/2` in the READY column for each pod.

## Step 3: Access Grafana

Grafana is already running! Access it at: **http://localhost:3000**

### Default Credentials
- **Username**: `admin`
- **Password**: `admin` (you'll be prompted to change it)

## Step 4: View Istio Dashboards

Istio includes pre-configured Grafana dashboards. To view them:

1. Open Grafana: http://localhost:3000
2. Click on **☰ Menu** (top left)
3. Go to **Dashboards**
4. Look for these Istio dashboards:
   - **Istio Mesh Dashboard** - Overall service mesh metrics
   - **Istio Service Dashboard** - Per-service metrics
   - **Istio Workload Dashboard** - Per-workload metrics
   - **Istio Performance Dashboard** - Performance metrics
   - **Istio Control Plane Dashboard** - Istio system metrics

## Step 5: Generate Test Traffic

Before running performance tests, generate some baseline traffic:

```bash
# Make some requests to your application
for i in {1..20}; do
  curl http://els-api.local/api/ 
  sleep 1
done
```

Or if using the k8s service directly:
```bash
# Get the service
kubectl get svc -n default

# Port-forward to your app
kubectl port-forward svc/your-service-name 8080:80 -n default

# Make requests
for i in {1..20}; do
  curl http://localhost:8080/api/
  sleep 1
done
```

## Step 6: Run Performance Tests

Now run your k6 performance tests:

```bash
cd /Users/harishmuleva/projects/els-demo/release/testing/level-3/performance
k6 run script.js
```

## Step 7: View Metrics in Grafana

While/after the test runs:

1. Go to **Istio Service Dashboard** in Grafana
2. Select your service from the dropdown
3. You'll see:
   - **Request Rate** (requests per second)
   - **Success Rate** (% successful requests)
   - **Request Duration** (p50, p90, p99 latencies)
   - **Request Size** and **Response Size**
   - **TCP Traffic**

### Key Metrics to Watch

- **Client Request Volume**: Total requests/sec
- **Client Success Rate**: % of successful requests (200-299 status codes)
- **Client Request Duration**: Latency percentiles
- **Client Request Size**: Average request size
- **Client Response Size**: Average response size

## Step 8: View in Kiali

Access Kiali at: **http://localhost:20001**

Kiali shows:
- **Service Graph**: Visual topology of your services
- **Traffic Flow**: Real-time request rates between services
- **Health Status**: Error rates and response times
- **Metrics**: Request volume, duration, size, TCP traffic

### Using Kiali

1. Go to **Graph** tab
2. Select **Namespace**: default
3. Display: **Versioned app graph**
4. Traffic Animation: Enable to see live traffic flow
5. Click on edges/nodes to see detailed metrics

## Step 9: View Traces in Jaeger

Access Jaeger at: **http://localhost:16686**

1. Select your service from the **Service** dropdown
2. Click **Find Traces**
3. Click on a trace to see:
   - Request timeline
   - Span details (each service call)
   - Latency breakdown
   - Tags and logs

## Troubleshooting

### No Metrics Showing?

1. **Verify Istio sidecars are injected**:
   ```bash
   kubectl get pods -n default -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[*].name}{"\n"}{end}'
   ```
   You should see `istio-proxy` alongside your container.

2. **Check if pods are running**:
   ```bash
   kubectl get pods -n default
   kubectl get pods -n istio-system
   ```

3. **Verify Prometheus is scraping**:
   Open Prometheus (http://localhost:9090) and query:
   ```
   istio_requests_total
   ```

### Need to Point k6 to Kubernetes Service?

Update your k6 script to use:
```javascript
const BASE_URL = 'http://els-api.local/api';
```

Or use port-forward and change to `http://localhost:8080`.

## What to Look For During Performance Testing

1. **Baseline Metrics** (before load):
   - Note normal request rate
   - Note normal latency (p50, p95, p99)

2. **During Load**:
   - Watch request rate increase
   - Monitor latency percentiles
   - Check error rate (should stay low)
   - Watch CPU/Memory in Grafana

3. **After Load**:
   - Verify system returns to normal
   - Check for any spikes or anomalies
   - Review traces in Jaeger for slow requests

## Next Steps

1. Enable Istio injection ✓
2. Restart deployments ✓
3. Access Grafana and explore dashboards ✓
4. Generate baseline traffic ✓
5. Run k6 tests ✓
6. Analyze results in Grafana, Kiali, and Jaeger ✓
