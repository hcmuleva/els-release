# 🌐 Istio Integration and Monitoring Access for temple-stack

This guide automates **Istio Service Mesh** enablement and exposes observability tools like **Grafana**, **Prometheus**, **Kiali**, and **Jaeger** via **Istio Ingress Gateway**, so you can monitor your workloads without using `kubectl port-forward`.

---

## 🧭 Overview

With this setup, you’ll get:

- 🔀 **Traffic Management:** Smart routing and load balancing  
- 🔒 **Security:** Mutual TLS (mTLS), authorization policies  
- 📊 **Observability:** Metrics, traces, and logs with Grafana, Prometheus, Jaeger, and Kiali  
- 🛡️ **Resilience:** Circuit breakers, retries, timeouts  

Your application:  
- Namespace: `temple-stack`  
- Managed by: **Helm + ArgoCD**  
- Mesh: **Istio**

---

## ⚙️ Prerequisites

Ensure the following are already installed and running in your cluster:

| Component | Namespace | Command to verify |
|------------|------------|-------------------|
| Istio | `istio-system` | `kubectl get pods -n istio-system` |
| ArgoCD | `argocd` | `kubectl get pods -n argocd` |
| temple-stack app | `temple-stack` | `kubectl get pods -n temple-stack` |

Expected Istio pods:


istiod, istio-ingressgateway, istio-egressgateway, kiali, grafana, prometheus, jaeger


---

## 1️⃣ Enable Istio Sidecar Injection

Enable automatic sidecar injection in your application namespace:

```bash
kubectl label namespace temple-stack istio-injection=enabled --overwrite


Verify:

kubectl get namespace temple-stack --show-labels


Output:

istio-injection=enabled


Restart all deployments to attach Istio sidecars:

kubectl rollout restart deployment -n temple-stack


Check sidecar presence:

kubectl get pods -n temple-stack
kubectl describe pod <your-pod-name> -n temple-stack | grep istio-proxy


Pods with 2/2 containers indicate successful injection.

2️⃣ Configure Local or Cluster DNS

To access monitoring dashboards by friendly URLs, add these entries to /etc/hosts (for local clusters like minikube, kind, or docker-desktop):

127.0.0.1 grafana.temple.local
127.0.0.1 prometheus.temple.local
127.0.0.1 kiali.temple.local
127.0.0.1 jaeger.temple.local


🧠 For cloud clusters, replace 127.0.0.1 with your Ingress LoadBalancer IP.

3️⃣ Create Istio Gateway for Monitoring

Create a file named monitoring-gateway.yaml:

apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: monitoring-gateway
  namespace: istio-system
spec:
  selector:
    istio: ingressgateway
  servers:
    - port:
        number: 80
        name: http
        protocol: HTTP
      hosts:
        - grafana.temple.local
        - prometheus.temple.local
        - kiali.temple.local
        - jaeger.temple.local


Apply the gateway:

kubectl apply -f monitoring-gateway.yaml

4️⃣ Create VirtualServices for Monitoring Tools
🟣 Grafana

Save as grafana-virtualservice.yaml:

apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: grafana-vs
  namespace: istio-system
spec:
  hosts:
    - grafana.temple.local
  gateways:
    - monitoring-gateway
  http:
    - route:
        - destination:
            host: grafana.istio-system.svc.cluster.local
            port:
              number: 3000

🔵 Prometheus

Save as prometheus-virtualservice.yaml:

apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: prometheus-vs
  namespace: istio-system
spec:
  hosts:
    - prometheus.temple.local
  gateways:
    - monitoring-gateway
  http:
    - route:
        - destination:
            host: prometheus.istio-system.svc.cluster.local
            port:
              number: 9090

🟢 Kiali

Save as kiali-virtualservice.yaml:

apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: kiali-vs
  namespace: istio-system
spec:
  hosts:
    - kiali.temple.local
  gateways:
    - monitoring-gateway
  http:
    - route:
        - destination:
            host: kiali.istio-system.svc.cluster.local
            port:
              number: 20001

🟠 Jaeger

Save as jaeger-virtualservice.yaml:

apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: jaeger-vs
  namespace: istio-system
spec:
  hosts:
    - jaeger.temple.local
  gateways:
    - monitoring-gateway
  http:
    - route:
        - destination:
            host: jaeger.istio-system.svc.cluster.local
            port:
              number: 16686


Apply all VirtualServices:

kubectl apply -f grafana-virtualservice.yaml
kubectl apply -f prometheus-virtualservice.yaml
kubectl apply -f kiali-virtualservice.yaml
kubectl apply -f jaeger-virtualservice.yaml

5️⃣ Verify the Setup

Check that your routes are correctly configured:

kubectl get gateway,virtualservice -n istio-system


You should see:

NAME                                   AGE
gateway.networking.istio.io/monitoring-gateway   <age>

NAME                                        AGE
virtualservice.networking.istio.io/grafana-vs     <age>
virtualservice.networking.istio.io/prometheus-vs  <age>
virtualservice.networking.istio.io/kiali-vs       <age>
virtualservice.networking.istio.io/jaeger-vs      <age>

6️⃣ Access Dashboards

Once applied, you can open the monitoring dashboards directly via browser:

Service	URL
Grafana	http://grafana.temple.local

Prometheus	http://prometheus.temple.local

Kiali	http://kiali.temple.local

Jaeger	http://jaeger.temple.local

💡 Tip: Use these in your developer machine browser if /etc/hosts is configured.

7️⃣ (Optional) Integrate Gateway via Helm Chart

If you use a central Umbrella Helm chart, add these YAML manifests under a subchart like templates/istio-monitoring.yaml and apply via:

helm upgrade --install temple-stack ./chart-path -n temple-stack


This ensures Istio sidecars and monitoring gateways deploy automatically.

✅ Result

After applying all steps:

✅ All temple-stack pods include istio-proxy

✅ Monitoring tools are accessible via friendly URLs

✅ No need for port-forwarding

✅ Fully observable service mesh

🧹 Cleanup (Optional)

If you want to remove monitoring routes:

kubectl delete gateway monitoring-gateway -n istio-system
kubectl delete virtualservice grafana-vs prometheus-vs kiali-vs jaeger-vs -n istio-system

🏁 Done!

Your temple-stack app is now mesh-enabled with:

🔐 mTLS and secure routing

📊 Full observability (Grafana, Prometheus, Kiali, Jaeger)

🧠 Easy web access via Istio Gateway