# Iteration 5.7: Backup and Disaster Recovery

**Duration**: ~2-3 hours  
**Difficulty**: ⭐⭐⭐⭐ Advanced

## 🎯 Learning Objectives

- ✅ Install Velero for backup and restore
- ✅ Configure backup storage (S3, MinIO)
- ✅ Create backup schedules
- ✅ Perform disaster recovery
- ✅ Backup persistent volumes
- ✅ Test restore procedures

## 💾 Install Velero

```bash
# Install Velero CLI
brew install velero

# Install MinIO for local testing
kubectl create namespace minio
helm install minio bitnami/minio \
  --namespace minio \
  --set auth.rootUser=admin \
  --set auth.rootPassword=password123 \
  --set defaultBuckets=velero

# Install Velero server
velero install \
  --provider aws \
  --plugins velero/velero-plugin-for-aws:v1.8.0 \
  --bucket velero \
  --secret-file ./credentials-velero \
  --use-volume-snapshots=false \
  --backup-location-config \
region=minio,s3ForcePathStyle="true",s3Url=http://minio.minio:9000
```

## 📦 Create Backup

### Manual Backup

```bash
# Backup entire namespace
velero backup create temple-stack-backup \
  --include-namespaces temple-stack

# Backup specific resources
velero backup create temple-db-backup \
  --include-namespaces temple-stack \
  --include-resources persistentvolumeclaims,persistentvolumes

# Check backup status
velero backup describe temple-stack-backup
velero backup logs temple-stack-backup
```

### Scheduled Backup

```yaml
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: temple-stack-daily
  namespace: velero
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  template:
    includedNamespaces:
    - temple-stack
    ttl: 720h  # 30 days retention
```

## 🔄 Restore from Backup

```bash
# List backups
velero backup get

# Restore entire backup
velero restore create --from-backup temple-stack-backup

# Restore to different namespace
velero restore create --from-backup temple-stack-backup \
  --namespace-mappings temple-stack:temple-stack-restored

# Check restore status
velero restore describe <restore-name>
```

## 🗄️ Database Backup with CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: temple-stack
spec:
  schedule: "0 1 * * *"  # Daily at 1 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: postgres-backup
            image: postgres:14
            command:
            - /bin/sh
            - -c
            - |
              pg_dump -h postgres-service -U $POSTGRES_USER $POSTGRES_DB \
              | gzip > /backup/temple_db_$(date +%Y%m%d_%H%M%S).sql.gz
              
              # Keep only last 7 backups
              ls -t /backup/*.sql.gz | tail -n +8 | xargs rm -f
            env:
            - name: POSTGRES_USER
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: username
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: password
            - name: POSTGRES_DB
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: database
            volumeMounts:
            - name: backup
              mountPath: /backup
          volumes:
          - name: backup
            persistentVolumeClaim:
              claimName: postgres-backup-pvc
          restartPolicy: OnFailure
```

## 🧪 Disaster Recovery Test

```bash
# 1. Create test data
kubectl exec -n temple-stack postgres-0 -- psql -U temple_user -d temple_db -c "CREATE TABLE test (id INT, data TEXT);"

# 2. Create backup
velero backup create dr-test --include-namespaces temple-stack

# 3. Simulate disaster (delete namespace)
kubectl delete namespace temple-stack

# 4. Restore from backup
velero restore create --from-backup dr-test

# 5. Verify data
kubectl exec -n temple-stack postgres-0 -- psql -U temple_user -d temple_db -c "SELECT * FROM test;"
```

## ✅ Validation

```bash
# List all backups
velero backup get

# Verify backup completed
velero backup describe temple-stack-backup

# Test restore (dry-run)
velero restore create --from-backup temple-stack-backup --dry-run -o yaml
```

## 🎯 Next Steps

**Next**: [Iteration 5.8: Multi-Cluster Management](../5.8-multi-cluster/README.md)
