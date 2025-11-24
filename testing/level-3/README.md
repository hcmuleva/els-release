# Level 3 Testing Guide

A comprehensive guide to testing your ELS application using functional and performance tests with monitoring.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Testing Types](#testing-types)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Functional Testing](#functional-testing)
- [Performance Testing](#performance-testing)
- [Monitoring & Observability](#monitoring--observability)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This testing suite provides three types of testing for your application:

1. **Functional Tests** - Verify features work correctly
2. **Performance Tests** - Ensure application handles load
3. **Monitoring** - Observe application behavior in real-time

### Why Test?

- **Functional Testing**: Catches bugs before users do, ensures features work as expected
- **Performance Testing**: Identifies bottlenecks, validates scalability, prevents outages
- **Monitoring**: Provides visibility into production behavior, helps diagnose issues quickly

---

## 🧪 Testing Types

### 1. Functional Testing

**What**: Tests that verify individual features work correctly  
**When**: Run before every deployment, after every code change  
**Tools**: Karate (API testing), Selenium (UI testing)

#### Karate Tests
- **Purpose**: Test REST API endpoints
- **Use Case**: Verify authentication, user registration, data retrieval
- **Location**: `functional/karate/`

#### Selenium Tests
- **Purpose**: Test web UI flows
- **Use Case**: Verify login forms, user journeys, UI interactions
- **Location**: `functional/selenium/`

### 2. Performance Testing

**What**: Tests that measure how the system performs under load  
**When**: Before major releases, after infrastructure changes  
**Tools**: k6 (load testing)

#### k6 Load Tests
- **Purpose**: Simulate multiple users accessing your app
- **Use Case**: Find breaking points, measure response times, identify bottlenecks
- **Location**: `performance/`

### 3. Monitoring

**What**: Real-time observation of application metrics  
**When**: Always running in production, during performance tests  
**Tools**: Istio, Prometheus, Grafana, Kiali, Jaeger

#### Monitoring Stack
- **Prometheus**: Collects metrics (requests/sec, latency, errors)
- **Grafana**: Visualizes metrics in dashboards
- **Kiali**: Shows service topology and traffic flow
- **Jaeger**: Traces individual requests through services
- **Istio**: Service mesh that enables all of the above

---

## ✅ Prerequisites

### Required Software

- **Docker Desktop** with Kubernetes enabled
- **kubectl** configured
- **Helm 3.x**
- **k6** (for performance testing)
- **Python 3.x** (for Selenium tests)
- **Java 17+** and **Maven** (for Karate tests)

### Verify Installation

```bash
# Check versions
docker --version
kubectl version --client
helm version
k6 version
python3 --version
java -version
mvn -version
```

### Application Running

Ensure your application is deployed:

```bash
# Check if pods are running
kubectl get pods -n default

# Should show your strapi pod with 2/2 READY (app + istio-proxy)
```

---

## 🚀 Quick Start

### 1. Deploy Application

```bash
cd /Users/harishmuleva/projects/els-demo/release/devops/level-3

# Deploy via Helm
helm upgrade --install strapi-release helm/

# Wait for pod to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=strapi-chart --timeout=120s
```

### 2. Setup Monitoring

```bash
cd monitoring/

# Install Istio and monitoring tools
./setup-monitoring.sh

# Enable Istio for your namespace
kubectl label namespace default istio-injection=enabled --overwrite

# Restart deployments to inject Istio sidecars
kubectl rollout restart deployment -n default

# Open dashboards (keeps running in background)
./open-dashboards.sh
```

### 3. Run Tests

```bash
# Functional test (Karate)
cd ../testing/level-3/functional/karate
mvn test

# Performance test (k6)
cd ../../performance
k6 run script.js

# UI test (Selenium)
cd ../functional/selenium
python test_auth.py
```

---

## 🧩 Functional Testing

### Karate API Tests

**What it does**: Tests your REST API endpoints with automatic dynamic user data generation.

#### Setup

```bash
cd functional/karate

# Install dependencies (first time only)
mvn clean install -DskipTests
```

#### Run Tests

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dkarate.options="--tags @register"
```

#### What's Being Tested

- ✅ User registration with unique data
- ✅ User login with valid credentials
- ✅ JWT token generation
- ✅ Authenticated API calls

#### View Results

Results are in `target/karate-reports/karate-summary.html`

```bash
# Open report (macOS)
open target/karate-reports/karate-summary.html
```

---

### Selenium UI Tests

**What it does**: Automates browser interactions to test the web UI.

#### Setup

```bash
cd functional/selenium

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Run Tests

```bash
# Activate virtual environment (if not already)
source venv/bin/activate

# Run tests
python test_auth.py
```

#### What's Being Tested

- ✅ Registration form with dynamic user data
- ✅ Login form functionality
- ✅ Page navigation after authentication
- ✅ Error message handling

#### Troubleshooting

- **Browser doesn't open**: ChromeDriver is auto-managed via `webdriver-manager`
- **Test fails**: Ensure app is running at configured URL
- **Slow tests**: Normal - browser automation takes time

---

## ⚡ Performance Testing

### k6 Load Tests

**What it does**: Simulates multiple users hitting your API to measure performance under load.

#### Why Run Performance Tests?

- **Find breaking points**: How many users can your app handle?
- **Measure latency**: Are responses fast enough?
- **Identify bottlenecks**: Where does your app slow down?
- **Prevent outages**: Catch issues before production

#### Setup

```bash
cd performance

# k6 should already be installed, verify:
k6 version
```

#### Run Tests

```bash
# Run the test
k6 run script.js

# Run with more load (edit script.js first)
k6 run script.js
```

#### Understanding Results

```
http_req_duration..: avg=167ms p(95)=300ms
http_req_failed....: 0.00%
http_reqs..........: 12
```

- **avg**: Average response time (lower is better)
- **p(95)**: 95% of requests were faster than this (target: <500ms)
- **http_req_failed**: Error rate (target: <1%)
- **http_reqs**: Total requests made

#### Customize Load

Edit `script.js`:

```javascript
stages: [
  { duration: '30s', target: 10 },  // Ramp to 10 users
  { duration: '1m', target: 50 },   // Ramp to 50 users
  { duration: '30s', target: 0 },   // Ramp down
],
```

---

## 📊 Monitoring & Observability

### Overview

Monitoring helps you understand:
- **Performance**: Is my app fast?
- **Reliability**: Is my app working?
- **Capacity**: Can my app handle the load?

### Access Dashboards

After running `./open-dashboards.sh`, access:

- **Kiali**: http://localhost:20001 (Service topology, real-time traffic)
- **Grafana**: http://localhost:3000 (Metrics dashboards)
- **Jaeger**: http://localhost:16686 (Distributed tracing)
- **Prometheus**: http://localhost:9090 (Raw metrics queries)

---

### Using Kiali

**Best for**: Visualizing service traffic flow

1. Open http://localhost:20001
2. Go to **Graph** tab
3. Select namespace: **default**
4. Display: **Versioned app graph**
5. Enable **Traffic Animation**

**What to look for**:
- Green lines = healthy traffic
- Request rates on edges
- Error rates (red indicators)
- Service health status

---

### Using Grafana

**Best for**: Detailed performance metrics

1. Open http://localhost:3000
   - Username: `admin`
   - Password: `admin`

2. Navigate: **Dashboards** → Search "Istio"

3. Open **Istio Service Dashboard**

4. Select your service from dropdown

**Key Metrics**:
- **Client Request Volume**: Requests per second
- **Client Success Rate**: % successful (target: >99%)
- **Client Request Duration**: Latency (p50, p90, p95, p99)
- **Request Size / Response Size**: Bandwidth usage

**Time Range**: Set to "Last 5 minutes" for recent data

---

### Using Jaeger

**Best for**: Debugging slow requests

1. Open http://localhost:16686

2. Select your service from dropdown

3. Click **Find Traces**

4. Click on a trace to see:
   - Timeline of the request
   - Each service call (span)
   - Where time was spent
   - Any errors

**Use Case**: Find why a specific request was slow

---

### Using Prometheus

**Best for**: Custom queries and raw data

1. Open http://localhost:9090

2. Go to **Graph** tab

3. Try these queries:

**Total requests**:
```promql
istio_requests_total{destination_service_name="strapi-release-strapi-chart"}
```

**Request rate (per second)**:
```promql
rate(istio_requests_total[1m])
```

**95th percentile latency**:
```promql
histogram_quantile(0.95, rate(istio_request_duration_milliseconds_bucket[1m]))
```

---

## 🔄 Complete Testing Workflow

### Step 1: Deploy Application

```bash
cd /Users/harishmuleva/projects/els-demo/release/devops/level-3
helm upgrade --install strapi-release helm/
kubectl get pods -n default  # Verify 2/2 READY
```

### Step 2: Start Monitoring

```bash
cd monitoring/
./open-dashboards.sh  # Leave this running
```

### Step 3: Run Functional Tests

```bash
# Karate
cd ../testing/level-3/functional/karate
mvn test

# Selenium
cd ../selenium
source venv/bin/activate
python test_auth.py
```

### Step 4: Run Performance Tests

```bash
cd ../../performance
k6 run script.js
```

### Step 5: Check Metrics (While k6 is Running)

- **Kiali**: http://localhost:20001 - See traffic flow
- **Grafana**: http://localhost:3000 - View dashboards
- **Prometheus**: http://localhost:9090 - Query metrics

---

## 🐛 Troubleshooting

### No Metrics in Grafana/Kiali

**Problem**: Dashboards are empty, no data showing

**Solution**:
```bash
# 1. Verify Istio sidecars are injected
kubectl get pods -n default
# Should show 2/2 READY

# 2. If showing 1/1, enable Istio injection
kubectl label namespace default istio-injection=enabled --overwrite
kubectl rollout restart deployment -n default

# 3. Verify pods restarted with 2 containers
kubectl get pods -n default -o jsonpath='{.items[*].spec.containers[*].name}'
# Should show: strapi-chart istio-proxy

# 4. Generate traffic and refresh dashboards
for i in {1..20}; do curl http://els-api.local/api/; sleep 1; done
```

### k6 Test Fails

**Problem**: Connection refused or timeouts

**Solution**:
```bash
# 1. Verify ingress is working
curl http://els-api.local/api/

# 2. Check /etc/hosts has entry
grep els-api.local /etc/hosts
# Should show: 127.0.0.1 els-api.local

# 3. Verify service is running
kubectl get svc -n default
kubectl get pods -n default
```

### Karate Tests Fail

**Problem**: Tests timeout or fail to connect

**Solution**:

1. Check `src/test/resources/karate-config.js`:
   ```javascript
   config.baseUrl = 'http://localhost:1337/api';
   ```

2. Verify Strapi is accessible:
   ```bash
   curl http://localhost:1337/api/
   ```

3. If using with Kubernetes, port-forward:
   ```bash
   kubectl port-forward svc/strapi-release-strapi-chart 1337:80 -n default
   ```

### Selenium Browser Won't Open

**Problem**: Chrome/driver errors

**Solution**:
```bash
# Reinstall webdriver-manager
pip uninstall selenium webdriver-manager
pip install selenium webdriver-manager

# Update Chrome  browser to latest version
```

### Monitoring Stack Won't Install

**Problem**: Cleanup or installation errors

**Solution**:
```bash
cd /Users/harishmuleva/projects/els-demo/release/devops/level-3/monitoring

# Full cleanup
./cleanup-monitoring.sh

# Wait 30 seconds, then reinstall
sleep 30
./setup-monitoring.sh
```

---

## 📚 Further Reading

### Learn More

- **Karate**: https://github.com/karatelabs/karate
- **k6**: https://k6.io/docs/
- **Selenium**: https://www.selenium.dev/documentation/
- **Istio**: https://istio.io/latest/docs/
- **Grafana**: https://grafana.com/docs/
- **Prometheus**: https://prometheus.io/docs/

### Next Steps

1. **Add more Karate tests** for your API endpoints
2. **Increase k6 load** to find your limits
3. **Set up alerts** in Grafana for high latency/errors
4. **Create custom dashboards** for your specific metrics
5. **Integrate tests into CI/CD** pipeline

---

## ✅ Success Checklist

- [ ] Application deployed and running (2/2 pods)
- [ ] Monitoring stack installed (Grafana, Kiali accessible)
- [ ] Istio sidecars injected
- [ ] Karate tests passing
- [ ] Selenium tests passing
- [ ] k6 performance test completes successfully
- [ ] Metrics visible in Grafana during k6 test
- [ ] Traffic visible in Kiali during k6 test

---

## 💡 Tips

1. **Always enable Istio injection** before performance testing to see metrics
2. **Run k6 tests while watching Grafana** to see real-time impact
3. **Use Kiali for quick health checks** - it's the fastest way to see if traffic is flowing
4. **Check Jaeger when debugging** slow requests - it shows exactly where time is spent
5. **Start with small load in k6** (1-5 VUs) and gradually increase

---

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Verify all prerequisites are installed
3. Ensure Docker Desktop has sufficient resources (8GB+ RAM recommended)
4. Check pod logs: `kubectl logs -n default <pod-name> -c strapi-chart`
5. Check Istio logs: `kubectl logs -n default <pod-name> -c istio-proxy`

---

**Happy Testing! 🎉**
