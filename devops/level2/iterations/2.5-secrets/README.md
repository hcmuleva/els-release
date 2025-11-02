# Iteration 2.5: Secrets Management

**Duration**: ~1 hour  
**Difficulty**: ⭐⭐⭐ Intermediate

## 🎯 Learning Objectives

- ✅ Understand Kubernetes Secrets
- ✅ Create and manage Secrets securely
- ✅ Use Secrets in pods
- ✅ Understand Secret encryption at rest
- ✅ Best practices for production secrets

## 🛠️ Key Concepts

### Creating Secrets

**Method 1: From literals**
```bash
kubectl create secret generic db-credentials \
  --from-literal=username=admin \
  --from-literal=password='MyS3cr3t!' \
  -n level2
```

**Method 2: From files**
```bash
echo -n 'admin' > username.txt
echo -n 'MyS3cr3t!' > password.txt
kubectl create secret generic db-creds \
  --from-file=username=username.txt \
  --from-file=password=password.txt \
  -n level2
```

**Method 3: YAML (base64 encoded)**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=  # base64 encoded "admin"
  password: TXlTM2NyM3Qh  # base64 encoded "MyS3cr3t!"
```

**Method 4: YAML (plain text with stringData)**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:  # Automatically base64 encoded
  username: admin
  password: MyS3cr3t!
```

### Using Secrets

**As environment variables:**
```yaml
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: db-secret
      key: password
```

**As volume mounts:**
```yaml
volumes:
- name: secrets
  secret:
    secretName: db-secret
volumeMounts:
- name: secrets
  mountPath: /etc/secrets
  readOnly: true
```

## ⚠️ Important Security Notes

**Secrets are NOT encrypted by default!**
- Base64 encoded (easily decoded)
- Stored in etcd (may be unencrypted)
- Visible to cluster admins

**Production Best Practices:**
1. **Enable encryption at rest** in etcd
2. **Use external secret managers:**
   - HashiCorp Vault
   - AWS Secrets Manager
   - Azure Key Vault
   - Google Secret Manager
3. **Use Sealed Secrets** (encrypted in Git)
4. **Limit RBAC access** to Secrets
5. **Never commit secrets to Git!**

## 🎯 Practice

### Exercise: Migrate temple-stack to use proper Secrets

Update postgres and API to use separate secrets for different concerns:

```yaml
# Database credentials
apiVersion: v1
kind: Secret
metadata:
  name: postgres-credentials
type: Opaque
stringData:
  username: templeadmin
  password: complexPassword123!

---
# API tokens
apiVersion: v1
kind: Secret
metadata:
  name: api-tokens
type: Opaque
stringData:
  jwt-secret: $(openssl rand -base64 32)
  admin-secret: $(openssl rand -base64 32)
```

## ✅ Validation

```bash
# Create secret
kubectl create secret generic test-secret \
  --from-literal=apikey=12345 \
  -n level2

# View secret (base64 encoded)
kubectl get secret test-secret -n level2 -o yaml

# Decode secret
kubectl get secret test-secret -n level2 \
  -o jsonpath='{.data.apikey}' | base64 -d

# Use in pod
kubectl run test --image=busybox --rm -it -n level2 \
  --env="API_KEY=$(kubectl get secret test-secret -n level2 -o jsonpath='{.data.apikey}' | base64 -d)" \
  -- sh -c 'echo $API_KEY'
```

## 🎯 Next Steps

**Next**: [Iteration 2.6: Ingress Configuration](../2.6-ingress/README.md)

Learn to expose services externally with Ingress and path-based routing.

---

See `./solution/` for examples.
