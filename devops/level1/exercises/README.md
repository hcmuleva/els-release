# 🧪 Lab 1 — Flask App with Docker & Helm

### 🎯 Goal
Learn how to:
- Build a simple **Flask** app with **GET** and **POST** routes.
- Dockerize the app for containerized deployment.
- Deploy it to Kubernetes using **Helm**.
- Access it via **Ingress** (`flask-lab1.local`).

---

## 🛠️ 1. Run Locally (Optional)

```bash
cd app
pip install -r requirements.txt
python main.py
Test the endpoints:

curl http://localhost:5000/
curl -X POST http://localhost:5000/echo -H "Content-Type: application/json" -d '{"name":"Harish"}'

🐳 2. Build Docker Image
cd app
docker build -t flask-lab1:latest .
docker run -p 5000:5000 flask-lab1


Verify:

curl http://localhost:5000

☸️ 3. Deploy via Helm

From project root:

helm install flask-lab1 ./helm


Check resources:

kubectl get all


Access the app:
If using local NGINX ingress + /etc/hosts entry:

127.0.0.1 flask-lab1.local


Then visit:
👉 http://flask-lab1.local/

🧹 4. Cleanup
helm uninstall flask-lab1

✅ Outcome

You’ve built and deployed a working Flask app using Docker + Helm — all in the default namespace.

Next: In Lab 2, you’ll enhance it with namespace isolation, config maps, and secret integration.


---
