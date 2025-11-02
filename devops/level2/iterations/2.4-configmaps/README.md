# Iteration 2.4: ConfigMaps Deep Dive

**Duration**: ~1 hour  
**Difficulty**: ⭐⭐ Intermediate

## 🎯 Learning Objectives

- ✅ Master ConfigMap creation methods
- ✅ Use ConfigMaps for file-based configuration
- ✅ Mount ConfigMaps as volumes
- ✅ Update ConfigMaps without redeploying pods
- ✅ Environment-specific configurations

## 🛠️ Key Concepts

### Creating ConfigMaps

**Method 1: From literal values**
```bash
kubectl create configmap app-config \
  --from-literal=LOG_LEVEL=debug \
  --from-literal=MAX_CONNECTIONS=100 \
  -n level2
```

**Method 2: From file**
```bash
kubectl create configmap nginx-config \
  --from-file=nginx.conf \
  -n level2
```

**Method 3: YAML manifest**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-settings
data:
  config.json: |
    {
      "database": "postgres",
      "port": 5432
    }
```

### Using ConfigMaps

**As environment variables:**
```yaml
envFrom:
- configMapRef:
    name: app-config
```

**As volume mounts:**
```yaml
volumes:
- name: config
  configMap:
    name: nginx-config
volumeMounts:
- name: config
  mountPath: /etc/nginx/nginx.conf
  subPath: nginx.conf
```

## 🎯 Practice

Create environment-specific ConfigMaps:

```yaml
# Development
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config-dev
data:
  LOG_LEVEL: "debug"
  CACHE_ENABLED: "false"

---
# Production
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config-prod
data:
  LOG_LEVEL: "info"
  CACHE_ENABLED: "true"
```

Deploy same app with different configs:
```bash
# Dev
kubectl set env deployment/temple-api --from=configmap/app-config-dev -n level2

# Prod
kubectl set env deployment/temple-api --from=configmap/app-config-prod -n level2
```

## ✅ Validation

```bash
# Create ConfigMap from file
echo "max_connections=200" > app.properties
kubectl create configmap app-props --from-file=app.properties -n level2

# Verify
kubectl get configmap app-props -n level2 -o yaml

# Use in pod
kubectl run test --image=busybox --rm -it -n level2 -- sh
# Mount ConfigMap and verify content
```

## 🎯 Next Steps

**Next**: [Iteration 2.5: Secrets Management](../2.5-secrets/README.md)

---

See `./solution/` for examples.
