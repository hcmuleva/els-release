#!/bin/bash
# Deploy complete PostgreSQL stack

echo "🚀 Deploying PostgreSQL to Kubernetes..."

# Create namespace
echo "📦 Creating namespace..."
kubectl create namespace level2 --dry-run=client -o yaml | kubectl apply -f -

# Apply resources in order
echo "🔐 Creating Secret..."
kubectl apply -f postgres-secret.yaml

echo "💾 Creating PersistentVolumeClaim..."
kubectl apply -f postgres-pvc.yaml

echo "⏳ Waiting for PVC to be bound..."
kubectl wait --for=jsonpath='{.status.phase}'=Bound pvc/postgres-data -n level2 --timeout=60s

echo "🗄️  Creating StatefulSet..."
kubectl apply -f postgres-statefulset.yaml

echo "⏳ Waiting for StatefulSet to be ready..."
kubectl wait --for=condition=ready pod/postgres-0 -n level2 --timeout=120s

echo "🌐 Creating Service..."
kubectl apply -f postgres-service.yaml

echo ""
echo "✅ PostgreSQL deployed successfully!"
echo ""
echo "📊 Resources:"
kubectl get all,pvc,secret -n level2

echo ""
echo "🔍 Test connection:"
echo "kubectl exec -it postgres-0 -n level2 -- psql -U templeadmin -d templedb"

echo ""
echo "📝 Create sample data:"
cat << 'EOF'
kubectl exec -it postgres-0 -n level2 -- psql -U templeadmin -d templedb << SQL
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users (name, email) VALUES 
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com');
SELECT * FROM users;
SQL
EOF
