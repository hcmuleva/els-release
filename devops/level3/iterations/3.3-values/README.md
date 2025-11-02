# Iteration 3.3: Values and Environment Overrides

**Duration**: ~1-1.5 hours  
**Difficulty**: ⭐⭐⭐ Intermediate

## 🎯 Learning Objectives

- ✅ Manage environment-specific values
- ✅ Override values at install/upgrade time
- ✅ Use multiple values files
- ✅ Understand value precedence
- ✅ Create reusable value structures

## 📚 Value Precedence

From lowest to highest priority:
1. `values.yaml` (default values)
2. Values from parent chart
3. `-f custom-values.yaml` (values file)
4. `--set key=value` (command line)

```bash
# Multiple sources (last wins)
helm install my-app ./chart \
  -f values-dev.yaml \
  -f values-override.yaml \
  --set replicas=5
```

## 🛠️ Environment-Specific Values

**values.yaml** (defaults):
```yaml
environment: development

image:
  repository: myapp
  tag: "latest"
  pullPolicy: Always

replicas: 1

resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
```

**values-dev.yaml**:
```yaml
environment: development
replicas: 1
image:
  tag: "dev-latest"
  pullPolicy: Always
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
```

**values-staging.yaml**:
```yaml
environment: staging
replicas: 2
image:
  tag: "v1.2.3"
  pullPolicy: IfNotPresent
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
```

**values-prod.yaml**:
```yaml
environment: production
replicas: 3
image:
  tag: "v1.2.3"
  pullPolicy: IfNotPresent
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

## 🚀 Deployment Examples

```bash
# Development
helm install myapp ./chart -f values-dev.yaml -n dev

# Staging
helm install myapp ./chart -f values-staging.yaml -n staging

# Production
helm install myapp ./chart -f values-prod.yaml -n production

# Production with override
helm install myapp ./chart \
  -f values-prod.yaml \
  --set replicas=5 \
  -n production
```

## ✅ Best Practices

1. **Default to development** in values.yaml
2. **Explicit production** values in values-prod.yaml
3. **Secrets** should not be in values files
4. **Use conventions**: `values-{env}.yaml`
5. **Document** all values in comments

## 🎯 Next Steps

**Next**: [Iteration 3.4: Dependencies and Sub-charts](../3.4-dependencies/README.md)
