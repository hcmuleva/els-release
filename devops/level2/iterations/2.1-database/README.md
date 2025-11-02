# Iteration 2.1: Deploy PostgreSQL Database

**Duration**: ~1.5-2 hours  
**Difficulty**: ⭐⭐⭐ Intermediate-Advanced

## 🎯 Learning Objectives

By the end of this iteration, you will:
- ✅ Understand StatefulSets vs Deployments
- ✅ Deploy PostgreSQL database in Kubernetes
- ✅ Configure PersistentVolumeClaims (PVC) for data storage
- ✅ Use Secrets for database credentials
- ✅ Create a Service for database access
- ✅ Test database connectivity

## 📚 Background

### Why StatefulSet for Databases?

**Deployments** are great for stateless apps (like web servers). **StatefulSets** are designed for stateful applications (like databases).

**StatefulSet Features**:
- 🏷️ **Stable network identity** - Predictable pod names (`postgres-0`, `postgres-1`)
- 💾 **Persistent storage** - Each pod gets its own PVC
- 📦 **Ordered deployment** - Pods created/deleted in order
- 🔄 **Controlled updates** - Rolling updates with guarantees

**Use StatefulSets for**:
- Databases (PostgreSQL, MySQL, MongoDB)
- Message queues (Kafka, RabbitMQ)
- Distributed systems (Elasticsearch, Cassandra)

### Persistent Storage in Kubernetes

```
PersistentVolume (PV)     ← Physical storage
        ↓ bound to
PersistentVolumeClaim     ← Request for storage
        ↓ used by
Pod                       ← Your application
```

## 📋 Prerequisites

- Completed [Level 1](../../level1/README.md)
- Level 2 namespace created: `kubectl create namespace level2`
- Basic understanding of SQL databases

## 🎓 Theory

### PostgreSQL Configuration

**Key Components**:
1. **Secret** - Database credentials
2. **PVC** - Persistent storage for data
3. **StatefulSet** - Database pod
4. **Service** - Network access (ClusterIP for internal)

### Storage Classes

Docker Desktop provides a default `hostpath` storage class:

```bash
kubectl get storageclass
# NAME                 PROVISIONER          RECLAIMPOLICY
# hostpath (default)   docker.io/hostpath   Delete
```

## 🛠️ Hands-On Exercise

### Task 1: Create Database Secret

Create `postgres-secret.yaml`:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
  namespace: level2
type: Opaque
stringData:
  POSTGRES_USER: templeadmin
  POSTGRES_PASSWORD: temple123
  POSTGRES_DB: templedb
```

**Important**: In production, never commit secrets to Git! Use sealed-secrets, Vault, or external secret managers.

Apply it:

```bash
kubectl apply -f postgres-secret.yaml

# Verify
kubectl get secrets -n level2
kubectl describe secret postgres-secret -n level2
```

### Task 2: Create PersistentVolumeClaim

Create `postgres-pvc.yaml`:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data
  namespace: level2
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
  storageClassName: hostpath
```

**Access Modes**:
- `ReadWriteOnce` (RWO) - Single node read-write
- `ReadOnlyMany` (ROX) - Multiple nodes read-only
- `ReadWriteMany` (RWX) - Multiple nodes read-write

Apply it:

```bash
kubectl apply -f postgres-pvc.yaml

# Check PVC
kubectl get pvc -n level2
# STATUS should be Bound

# Check PV (auto-created by dynamic provisioning)
kubectl get pv
```

### Task 3: Deploy PostgreSQL StatefulSet

Create `postgres-statefulset.yaml`:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: level2
spec:
  serviceName: postgres-service
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:14-alpine
        ports:
        - containerPort: 5432
          name: postgres
        
        # Environment from Secret
        envFrom:
        - secretRef:
            name: postgres-secret
        
        # Resource limits
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        
        # Volume mount
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
          subPath: postgres
        
        # Readiness probe
        readinessProbe:
          exec:
            command:
            - sh
            - -c
            - pg_isready -U templeadmin -d templedb
          initialDelaySeconds: 15
          periodSeconds: 10
        
        # Liveness probe
        livenessProbe:
          exec:
            command:
            - sh
            - -c
            - pg_isready -U templeadmin -d templedb
          initialDelaySeconds: 30
          periodSeconds: 20
      
      # Volume claim
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-data
```

Apply it:

```bash
kubectl apply -f postgres-statefulset.yaml

# Watch pod creation
kubectl get pods -n level2 -w

# Should see: postgres-0   1/1   Running
```

### Task 4: Create Database Service

Create `postgres-service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: level2
spec:
  type: ClusterIP
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
    protocol: TCP
```

Apply it:

```bash
kubectl apply -f postgres-service.yaml

# Verify
kubectl get svc -n level2
```

### Task 5: Test Database Connectivity

**Method 1: Using psql client**

```bash
# Connect to postgres pod
kubectl exec -it postgres-0 -n level2 -- psql -U templeadmin -d templedb

# Inside psql:
\l                    # List databases
\dt                   # List tables
SELECT version();     # Check version
\q                    # Quit
```

**Method 2: From another pod**

```bash
# Run a test pod with psql client
kubectl run psql-test --image=postgres:14-alpine --rm -it -n level2 -- sh

# Inside the pod:
psql -h postgres-service -U templeadmin -d templedb
# Password: temple123

# Run test query
SELECT version();
\q

# Exit pod
exit
```

**Method 3: Test connection**

```bash
# Quick connection test
kubectl exec -it postgres-0 -n level2 -- \
  pg_isready -h postgres-service -U templeadmin -d templedb

# Should show: accepting connections
```

### Task 6: Create Sample Data

```bash
# Connect to database
kubectl exec -it postgres-0 -n level2 -- psql -U templeadmin -d templedb

# Create sample table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Insert data
INSERT INTO users (name, email) VALUES 
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com');

# Query data
SELECT * FROM users;

# Exit
\q
```

### Task 7: Test Data Persistence

Test that data survives pod restarts:

```bash
# Delete the pod
kubectl delete pod postgres-0 -n level2

# Wait for recreation
kubectl get pods -n level2 -w

# Connect again
kubectl exec -it postgres-0 -n level2 -- psql -U templeadmin -d templedb

# Check data still exists
SELECT * FROM users;
# Data should still be there!

\q
```

## 🎯 Practice Exercises

### Exercise 1: Configure PostgreSQL Parameters

Create a ConfigMap with custom PostgreSQL configuration:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-config
  namespace: level2
data:
  postgresql.conf: |
    max_connections = 200
    shared_buffers = 256MB
    effective_cache_size = 1GB
```

Mount it in the StatefulSet.

<details>
<summary>Hint</summary>

Add volume and volumeMount for the ConfigMap, then reference it in the postgres command.

</details>

### Exercise 2: Backup Script

Create a CronJob to backup the database daily.

### Exercise 3: Monitoring

Add prometheus-postgres-exporter sidecar for metrics.

## ✅ Validation

Check your understanding:

**Questions**:
1. Why use StatefulSet instead of Deployment for databases?
2. What is a PersistentVolumeClaim?
3. How do Secrets work in Kubernetes?
4. What access mode should databases use?
5. Why use `subPath` in the volume mount?

**Practical Check**:

```bash
# All resources running
kubectl get all -n level2

# Secret exists
kubectl get secret postgres-secret -n level2

# PVC bound
kubectl get pvc postgres-data -n level2
# STATUS: Bound

# StatefulSet ready
kubectl get statefulset postgres -n level2
# READY: 1/1

# Service accessible
kubectl get svc postgres-service -n level2

# Database connection works
kubectl exec -it postgres-0 -n level2 -- \
  psql -U templeadmin -d templedb -c "SELECT 1"
# Should return: 1

# Data persists after pod deletion
kubectl delete pod postgres-0 -n level2
kubectl wait --for=condition=ready pod/postgres-0 -n level2 --timeout=60s
kubectl exec -it postgres-0 -n level2 -- \
  psql -U templeadmin -d templedb -c "SELECT * FROM users"
# Should show your data
```

## 📚 Key Takeaways

- 📌 **StatefulSets** provide stable identities and persistent storage
- 📌 **PVCs** request storage that survives pod restarts
- 📌 **Secrets** store sensitive data (base64 encoded, not encrypted!)
- 📌 **subPath** prevents postgres data directory issues
- 📌 Always configure **health probes** for databases
- 📌 Use **ClusterIP** service for internal database access
- 📌 Data persists across pod deletions when using PVCs

## 🐛 Common Issues

### Pod stuck in Pending

```bash
kubectl describe pod postgres-0 -n level2
# Check: PVC not bound or resource constraints
```

### PVC not binding

```bash
kubectl describe pvc postgres-data -n level2
# Check: StorageClass exists and can provision
kubectl get storageclass
```

### Database connection refused

```bash
# Check if pod is ready
kubectl get pods -n level2

# Check logs
kubectl logs postgres-0 -n level2

# Check service endpoints
kubectl get endpoints postgres-service -n level2
```

### Data directory not empty error

```bash
# Use subPath in volumeMount:
volumeMounts:
- name: postgres-storage
  mountPath: /var/lib/postgresql/data
  subPath: postgres  # This is crucial!
```

## 🎯 Next Steps

**Completed Iteration 2.1?** Excellent! 🎉

You now have a production-ready PostgreSQL database running in Kubernetes with persistent storage.

**Next**: [Iteration 2.2: Deploy Strapi API](../2.2-api/README.md)

In 2.2, you'll:
- Deploy the Strapi API backend
- Connect it to PostgreSQL
- Configure environment variables
- Test API endpoints

---

**Your database layer is ready! Let's build the API on top of it.** 🚀
