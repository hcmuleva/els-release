#!/bin/bash

################################################################################
# ELS-LMS Helm Chart - One Click Setup Script
# 
# This script generates the complete Helm chart structure with all files
# and optionally configures ArgoCD for GitOps deployment
#
# Usage:
#   ./setup-els-lms.sh
#   ./setup-els-lms.sh --with-argocd
#   ./setup-els-lms.sh --deploy-client temple
#   ./setup-els-lms.sh --deploy-server
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CHART_NAME="els-lms-stack"
GITHUB_REPO="https://github.com/hcmuleva/els-demo"
GITHUB_BRANCH="main"

# Parse arguments
WITH_ARGOCD=false
DEPLOY_CLIENT=""
DEPLOY_SERVER=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --with-argocd)
      WITH_ARGOCD=true
      shift
      ;;
    --deploy-client)
      DEPLOY_CLIENT="$2"
      shift 2
      ;;
    --deploy-server)
      DEPLOY_SERVER=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

################################################################################
# Helper Functions
################################################################################

print_header() {
  echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║          ELS-LMS Helm Chart - One Click Setup                  ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
}

print_step() {
  echo -e "${GREEN}▶ $1${NC}"
}

print_info() {
  echo -e "${YELLOW}ℹ $1${NC}"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

create_directory() {
  local dir=$1
  if [ ! -d "$dir" ]; then
    mkdir -p "$dir"
    print_info "Created directory: $dir"
  fi
}

################################################################################
# Main Setup Functions
################################################################################

create_chart_structure() {
  print_step "Creating directory structure..."
  
  # Create main directories
  create_directory "$CHART_NAME"
  create_directory "$CHART_NAME/charts"
  create_directory "$CHART_NAME/charts/postgres"
  create_directory "$CHART_NAME/charts/postgres/templates"
  create_directory "$CHART_NAME/charts/els-lms-api"
  create_directory "$CHART_NAME/charts/els-lms-api/templates"
  create_directory "$CHART_NAME/charts/els-lms-ui"
  create_directory "$CHART_NAME/charts/els-lms-ui/templates"
  create_directory "$CHART_NAME/templates"
  create_directory "$CHART_NAME/argocd"
  
  print_success "Directory structure created"
}

create_main_chart_yaml() {
  print_step "Creating main Chart.yaml..."
  
  cat > "$CHART_NAME/Chart.yaml" <<'EOF'
apiVersion: v2
name: els-lms-stack
description: ELS Learning Management System - Full Stack Deployment (Client/Server)
type: application
version: 0.1.0
appVersion: "1.0"

keywords:
  - els-lms
  - learning-management
  - strapi
  - react
  - postgres

maintainers:
  - name: DevOps Team
    email: devops@els-lms.local

dependencies:
  - name: postgres
    version: "1.0.0"
    repository: "file://./charts/postgres"
    condition: postgres.enabled
    tags:
      - database

  - name: els-lms-api
    version: "0.1.0"
    repository: "file://./charts/els-lms-api"
    condition: els-lms-api.enabled
    tags:
      - backend
      - api

  - name: els-lms-ui
    version: "0.1.0"
    repository: "file://./charts/els-lms-ui"
    condition: els-lms-ui.enabled
    tags:
      - frontend
      - ui
EOF

  print_success "Main Chart.yaml created"
}

create_values_yaml() {
  print_step "Creating values.yaml..."
  
  cat > "$CHART_NAME/values.yaml" <<'EOF'
# ============================================
# ELS-LMS Stack - Base Configuration
# ============================================

global:
  deploymentType: "client"
  client:
    name: "default"
    domain: "els-lms.local"
  imagePullPolicy: IfNotPresent
  labels:
    environment: "dev"
    managedBy: "helm"

# PostgreSQL Database
postgres:
  enabled: true
  image:
    repository: postgres
    tag: "15"
    pullPolicy: IfNotPresent
  auth:
    username: postgres
    password: postgres
    database: elsdb
    existingSecret: ""
  service:
    type: ClusterIP
    port: 5432
  persistence:
    enabled: true
    accessModes: ["ReadWriteOnce"]
    size: 2Gi
    storageClassName: "hostpath"
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi
  readinessProbe:
    initialDelaySeconds: 10
    periodSeconds: 5
  livenessProbe:
    initialDelaySeconds: 30
    periodSeconds: 10

# ELS-LMS API (Backend)
els-lms-api:
  enabled: true
  replicaCount: 1
  image:
    repository: harishdell/els-lmclient
    tag: "1.1"
    pullPolicy: IfNotPresent
  service:
    name: els-lms-api
    type: ClusterIP
    port: 1337
    targetPort: 1337
  env:
    HOST: "0.0.0.0"
    PORT: "1337"
    DATABASE_CLIENT: "postgres"
    DATABASE_HOST: "postgres-postgres"
    DATABASE_PORT: "5432"
    DATABASE_NAME: "elsdb"
    DATABASE_USERNAME: "postgres"
    DATABASE_PASSWORD: "postgres"
    NODE_ENV: "development"
  healthCheck:
    enabled: true
    path: "/_health"
    initialDelaySeconds: 30
    periodSeconds: 10
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi
  ingress:
    enabled: true
    className: nginx
    host: "els-lms-api.local"
    annotations:
      nginx.ingress.kubernetes.io/backend-protocol: "HTTP"
      nginx.ingress.kubernetes.io/rewrite-target: /

# ELS-LMS UI (Frontend)
els-lms-ui:
  enabled: true
  replicaCount: 1
  image:
    repository: harishdell/els-lmclient
    tag: "1.1"
    pullPolicy: IfNotPresent
  service:
    name: els-lms-ui
    type: ClusterIP
    port: 80
    targetPort: 80
  env:
    REACT_APP_API_URL: "http://els-lms-api.local/api"
    REACT_APP_ABLY_API_KEY: ""
    REACT_APP_MAXPAGE: "3"
  resources:
    requests:
      cpu: 50m
      memory: 128Mi
    limits:
      cpu: 200m
      memory: 256Mi
  ingress:
    enabled: true
    className: nginx
    host: "els-lms-ui.local"
    annotations:
      nginx.ingress.kubernetes.io/rewrite-target: /
EOF

  print_success "values.yaml created"
}

create_values_client_yaml() {
  print_step "Creating values-client.yaml..."
  
  cat > "$CHART_NAME/values-client.yaml" <<'EOF'
# ============================================
# ELS-LMS Client Deployment Configuration
# ============================================

global:
  deploymentType: "client"
  client:
    name: "temple"
    domain: "els-lms.local"
  imagePullPolicy: IfNotPresent
  labels:
    environment: "client"
    type: "standalone"

postgres:
  enabled: true
  auth:
    database: "elsdb"
    username: "postgres"
    password: "postgres"
  persistence:
    size: 5Gi
    storageClassName: "hostpath"
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi

els-lms-api:
  enabled: true
  replicaCount: 1
  image:
    repository: harishdell/els-lmclient
    tag: "1.1"
    pullPolicy: IfNotPresent
  env:
    HOST: "0.0.0.0"
    PORT: "1337"
    DATABASE_CLIENT: "postgres"
    DATABASE_HOST: "postgres-postgres"
    DATABASE_PORT: "5432"
    DATABASE_NAME: "elsdb"
    DATABASE_USERNAME: "postgres"
    DATABASE_PASSWORD: "postgres"
    NODE_ENV: "production"
    CENTRALIZED_SERVER: "http://els-lms-server.local"
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi
  ingress:
    enabled: true
    className: nginx
    host: "temple-api.local"

els-lms-ui:
  enabled: true
  replicaCount: 1
  image:
    repository: harishdell/els-lmclient
    tag: "1.1"
    pullPolicy: IfNotPresent
  env:
    REACT_APP_API_URL: "http://temple-api.local/api"
    REACT_APP_ABLY_API_KEY: "xul13A.CNpeww:KkS0rh8M4rJSr5r4gHNGbMijYuxvr90ybz1UQd6uKpw"
    REACT_APP_MAXPAGE: "3"
    REACT_APP_KRUTRIM_API_KEY: "5MG974Dkz5xHQ70hLzyLZQzMO57B5P9Pos1MOYe3"
    REACT_APP_GOOGLE_API_KEY: "AIzaSyDNN9LVrNB_WOGhrHG0U1CYsTWIOuaaoI8"
  resources:
    requests:
      cpu: 50m
      memory: 128Mi
    limits:
      cpu: 200m
      memory: 256Mi
  ingress:
    enabled: true
    className: nginx
    host: "temple.local"
EOF

  print_success "values-client.yaml created"
}

create_values_server_yaml() {
  print_step "Creating values-server.yaml..."
  
  cat > "$CHART_NAME/values-server.yaml" <<'EOF'
# ============================================
# ELS-LMS Server Deployment Configuration
# ============================================

global:
  deploymentType: "server"
  client:
    name: "server"
    domain: "els-lms-server.local"
  imagePullPolicy: IfNotPresent
  labels:
    environment: "server"
    type: "centralized"

postgres:
  enabled: true
  auth:
    database: "elsdb_server"
    username: "postgres"
    password: "postgres"
  persistence:
    size: 50Gi
    storageClassName: "standard"
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 2000m
      memory: 4Gi

els-lms-api:
  enabled: true
  replicaCount: 3
  image:
    repository: harishdell/els-lmsserver
    tag: "1.0"
    pullPolicy: IfNotPresent
  env:
    HOST: "0.0.0.0"
    PORT: "1337"
    DATABASE_CLIENT: "postgres"
    DATABASE_HOST: "postgres-postgres"
    DATABASE_PORT: "5432"
    DATABASE_NAME: "elsdb_server"
    DATABASE_USERNAME: "postgres"
    DATABASE_PASSWORD: "postgres"
    NODE_ENV: "production"
    APP_MODE: "server"
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 2000m
      memory: 2Gi
  ingress:
    enabled: true
    className: nginx
    host: "els-lms-server.local"

els-lms-ui:
  enabled: true
  replicaCount: 2
  image:
    repository: harishdell/els-lmsserver
    tag: "1.0"
    pullPolicy: IfNotPresent
  env:
    REACT_APP_API_URL: "http://els-lms-server.local/api"
    REACT_APP_ABLY_API_KEY: "xul13A.CNpeww:KkS0rh8M4rJSr5r4gHNGbMijYuxvr90ybz1UQd6uKpw"
    REACT_APP_MAXPAGE: "10"
    REACT_APP_MODE: "server"
  resources:
    requests:
      cpu: 200m
      memory: 512Mi
    limits:
      cpu: 1000m
      memory: 1Gi
  ingress:
    enabled: true
    className: nginx
    host: "els-lms-server-ui.local"
EOF

  print_success "values-server.yaml created"
}

create_postgres_chart() {
  print_step "Creating PostgreSQL sub-chart..."
  
  # Chart.yaml
  cat > "$CHART_NAME/charts/postgres/Chart.yaml" <<'EOF'
apiVersion: v2
name: postgres
description: PostgreSQL Database for ELS-LMS
type: application
version: 1.0.0
appVersion: "15"
EOF

  # values.yaml
  cat > "$CHART_NAME/charts/postgres/values.yaml" <<'EOF'
image:
  repository: postgres
  tag: "15"
  pullPolicy: IfNotPresent

auth:
  username: postgres
  password: postgres
  database: elsdb
  existingSecret: ""

service:
  type: ClusterIP
  port: 5432

persistence:
  enabled: true
  accessModes: ["ReadWriteOnce"]
  size: 2Gi
  storageClassName: "hostpath"

resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 512Mi

readinessProbe:
  initialDelaySeconds: 10
  periodSeconds: 5

livenessProbe:
  initialDelaySeconds: 30
  periodSeconds: 10
EOF

  # _helpers.tpl
  cat > "$CHART_NAME/charts/postgres/templates/_helpers.tpl" <<'EOF'
{{- define "postgres.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "postgres.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name (include "postgres.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "postgres.labels" -}}
helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}"
app.kubernetes.io/name: "{{ include "postgres.name" . }}"
app.kubernetes.io/instance: "{{ .Release.Name }}"
app.kubernetes.io/version: "{{ .Chart.AppVersion }}"
app.kubernetes.io/managed-by: "{{ .Release.Service }}"
{{- end -}}
EOF

  # StatefulSet
  cat > "$CHART_NAME/charts/postgres/templates/statefulset.yaml" <<'EOF'
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: {{ include "postgres.fullname" . }}
  labels:
    {{- include "postgres.labels" . | nindent 4 }}
spec:
  serviceName: {{ include "postgres.fullname" . }}
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: {{ include "postgres.name" . }}
      app.kubernetes.io/instance: {{ .Release.Name }}
  template:
    metadata:
      labels:
        app.kubernetes.io/name: {{ include "postgres.name" . }}
        app.kubernetes.io/instance: {{ .Release.Name }}
    spec:
      containers:
        - name: postgres
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: {{ .Values.service.port }}
              name: postgres
          env:
            - name: POSTGRES_USER
              value: "{{ .Values.auth.username }}"
            - name: POSTGRES_PASSWORD
              value: "{{ .Values.auth.password }}"
            - name: POSTGRES_DB
              value: "{{ .Values.auth.database }}"
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
          readinessProbe:
            tcpSocket:
              port: {{ .Values.service.port }}
            initialDelaySeconds: {{ .Values.readinessProbe.initialDelaySeconds }}
            periodSeconds: {{ .Values.readinessProbe.periodSeconds }}
          livenessProbe:
            tcpSocket:
              port: {{ .Values.service.port }}
            initialDelaySeconds: {{ .Values.livenessProbe.initialDelaySeconds }}
            periodSeconds: {{ .Values.livenessProbe.periodSeconds }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: {{ toYaml .Values.persistence.accessModes | nindent 10 }}
        storageClassName: {{ .Values.persistence.storageClassName | quote }}
        resources:
          requests:
            storage: {{ .Values.persistence.size }}
EOF

  # Service
  cat > "$CHART_NAME/charts/postgres/templates/service.yaml" <<'EOF'
apiVersion: v1
kind: Service
metadata:
  name: {{ include "postgres.fullname" . }}
  labels:
    {{- include "postgres.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: postgres
      port: {{ .Values.service.port }}
      targetPort: {{ .Values.service.port }}
  selector:
    app.kubernetes.io/name: {{ include "postgres.name" . }}
    app.kubernetes.io/instance: {{ .Release.Name }}
EOF

  print_success "PostgreSQL sub-chart created"
}

create_api_chart() {
  print_step "Creating ELS-LMS API sub-chart..."
  
  # Chart.yaml
  cat > "$CHART_NAME/charts/els-lms-api/Chart.yaml" <<'EOF'
apiVersion: v2
name: els-lms-api
description: ELS-LMS Backend API (Strapi)
version: 0.1.0
appVersion: "1.0"
type: application
EOF

  # values.yaml
  cat > "$CHART_NAME/charts/els-lms-api/values.yaml" <<'EOF'
replicaCount: 1

image:
  repository: harishdell/els-lmclient
  tag: "1.1"
  pullPolicy: IfNotPresent

service:
  name: els-lms-api
  type: ClusterIP
  port: 1337
  targetPort: 1337

env:
  HOST: "0.0.0.0"
  PORT: "1337"
  DATABASE_CLIENT: "postgres"
  DATABASE_HOST: "postgres-postgres"
  DATABASE_PORT: "5432"
  DATABASE_NAME: "elsdb"
  DATABASE_USERNAME: "postgres"
  DATABASE_PASSWORD: "postgres"

healthCheck:
  enabled: true
  path: "/_health"
  initialDelaySeconds: 30
  periodSeconds: 10

resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 512Mi

ingress:
  enabled: true
  className: nginx
  host: "els-lms-api.local"
  annotations: {}
EOF

  # Deployment
  cat > "$CHART_NAME/charts/els-lms-api/templates/deployment.yaml" <<'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Values.service.name }}
  labels:
    app: {{ .Values.service.name }}
    component: backend
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Values.service.name }}
  template:
    metadata:
      labels:
        app: {{ .Values.service.name }}
        component: backend
    spec:
      initContainers:
        - name: wait-for-postgres
          image: busybox:1.36
          command:
            - sh
            - -c
            - |
              echo "Waiting for PostgreSQL...";
              until nc -z {{ .Values.env.DATABASE_HOST }} {{ .Values.env.DATABASE_PORT }}; do
                echo "PostgreSQL not ready, waiting...";
                sleep 2;
              done;
              echo "PostgreSQL is ready!";
      containers:
        - name: {{ .Values.service.name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.service.targetPort }}
              protocol: TCP
          env:
            {{- range $key, $value := .Values.env }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
          {{- if .Values.healthCheck.enabled }}
          readinessProbe:
            httpGet:
              path: {{ .Values.healthCheck.path }}
              port: {{ .Values.service.targetPort }}
            initialDelaySeconds: {{ .Values.healthCheck.initialDelaySeconds }}
            periodSeconds: {{ .Values.healthCheck.periodSeconds }}
          livenessProbe:
            httpGet:
              path: {{ .Values.healthCheck.path }}
              port: {{ .Values.service.targetPort }}
            initialDelaySeconds: {{ add .Values.healthCheck.initialDelaySeconds 20 }}
            periodSeconds: {{ .Values.healthCheck.periodSeconds }}
          {{- end }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
EOF

  # Service
  cat > "$CHART_NAME/charts/els-lms-api/templates/service.yaml" <<'EOF'
apiVersion: v1
kind: Service
metadata:
  name: {{ .Values.service.name }}
  labels:
    app: {{ .Values.service.name }}
spec:
  type: {{ .Values.service.type }}
  selector:
    app: {{ .Values.service.name }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: {{ .Values.service.targetPort }}
      protocol: TCP
      name: http
EOF

  # Ingress
  cat > "$CHART_NAME/charts/els-lms-api/templates/ingress.yaml" <<'EOF'
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Values.service.name }}-ingress
  annotations:
    {{- range $key, $value := .Values.ingress.annotations }}
    {{ $key }}: {{ $value | quote }}
    {{- end }}
  labels:
    app: {{ .Values.service.name }}
spec:
  ingressClassName: {{ .Values.ingress.className }}
  rules:
  - host: {{ .Values.ingress.host }}
    http:
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: {{ .Values.service.name }}
              port:
                number: {{ .Values.service.port }}
{{- end }}
EOF

  print_success "ELS-LMS API sub-chart created"
}

create_ui_chart() {
  print_step "Creating ELS-LMS UI sub-chart..."
  
  # Chart.yaml
  cat > "$CHART_NAME/charts/els-lms-ui/Chart.yaml" <<'EOF'
apiVersion: v2
name: els-lms-ui
description: ELS-LMS Frontend UI (React)
version: 0.1.0
appVersion: "1.0"
type: application
EOF

  # values.yaml
  cat > "$CHART_NAME/charts/els-lms-ui/values.yaml" <<'EOF'
replicaCount: 1

image:
  repository: harishdell/els-lmclient
  tag: "1.1"
  pullPolicy: IfNotPresent

service:
  name: els-lms-ui
  type: ClusterIP
  port: 80
  targetPort: 80

env:
  REACT_APP_API_URL: "http://els-lms-api.local/api"

resources:
  requests:
    cpu: 50m
    memory: 128Mi
  limits:
    cpu: 200m
    memory: 256Mi

ingress:
  enabled: true
  className: nginx
  host: "els-lms-ui.local"
  annotations: {}
EOF

  # Deployment
  cat > "$CHART_NAME/charts/els-lms-ui/templates/deployment.yaml" <<'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Values.service.name }}
  labels:
    app: {{ .Values.service.name }}
    component: frontend
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Values.service.name }}
  template:
    metadata:
      labels:
        app: {{ .Values.service.name }}
        component: frontend
    spec:
      containers:
        - name: {{ .Values.service.name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.service.targetPort }}
              protocol: TCP
          env:
            {{- range $key, $value := .Values.env }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
EOF

  # Service
  cat > "$CHART_NAME/charts/els-lms-ui/templates/service.yaml" <<'EOF'
apiVersion: v1
kind: Service
metadata:
  name: {{ .Values.service.name }}
  labels:
    app: {{ .Values.service.name }}
spec:
  type: {{ .Values.service.type }}
  selector:
    app: {{ .Values.service.name }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: {{ .Values.service.targetPort }}
      protocol: TCP
      name: http
EOF

  # Ingress
  cat > "$CHART_NAME/charts/els-lms-ui/templates/ingress.yaml" <<'EOF'
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Values.service.name }}-ingress
  annotations:
    {{- range $key, $value := .Values.ingress.annotations }}
    {{ $key }}: {{ $value | quote }}
    {{- end }}
  labels:
    app: {{ .Values.service.name }}
spec:
  ingressClassName: {{ .Values.ingress.className }}
  rules:
  - host: {{ .Values.ingress.host }}
    http:
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: {{ .Values.service.name }}
              port:
                number: {{ .Values.service.port }}
{{- end }}
EOF

  print_success "ELS-LMS UI sub-chart created"
}

create_notes() {
  print_step "Creating NOTES.txt..."
  
  cat > "$CHART_NAME/templates/NOTES.txt" <<'EOF'
╔══════════════════════════════════════════════════════════════════════════╗
║                    ELS-LMS DEPLOYMENT SUCCESSFUL                         ║
╚══════════════════════════════════════════════════════════════════════════╝

🎉 Your ELS-LMS Stack has been deployed successfully!

📦 Deployed Components:
  ✓ PostgreSQL Database
  ✓ ELS-LMS API (Strapi)
  ✓ ELS-LMS UI (React)

🔗 Access URLs:
  {{- if eq .Values.global.deploymentType "server" }}
  Frontend UI:  http://els-lms-server-ui.local
  API Server:   http://els-lms-server.local
  Health Check: http://els-lms-server.local/_health
  {{- else }}
  Frontend UI:  http://{{ .Values.global.client.name }}.local
  API Server:   http://{{ .Values.global.client.name }}-api.local
  Health Check: http://{{ .Values.global.client.name }}-api.local/_health
  {{- end }}

📊 Check Deployment Status:
  kubectl get all -n {{ .Release.Namespace }}

⚠️  Important: Add to /etc/hosts:
  {{- if eq .Values.global.deploymentType "server" }}
  127.0.0.1 els-lms-server.local els-lms-server-ui.local
  {{- else }}
  127.0.0.1 {{ .Values.global.client.name }}.local {{ .Values.global.client.name }}-api.local
  {{- end }}

╔══════════════════════════════════════════════════════════════════════════╗
║                          Happy Learning! 📚                               ║
╚══════════════════════════════════════════════════════════════════════════╝
EOF

  print_success "NOTES.txt created"
}

create_makefile() {
  print_step "Creating Makefile..."
  
  cat > "$CHART_NAME/Makefile" <<'EOF'
# ELS-LMS Stack Makefile

.PHONY: help deps lint install-client install-server upgrade-client upgrade-server status clean

.DEFAULT_GOAL := help

CHART_DIR := .
CLIENT_NAME ?= temple
NAMESPACE ?= $(CLIENT_NAME)

BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

help: ## Show help
	@echo "$(BLUE)╔═══════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║        ELS-LMS Stack - Deployment Commands               ║$(NC)"
	@echo "$(BLUE)╚═══════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-25s$(NC) %s\n", $1, $2}'

deps: ## Update dependencies
	@echo "$(BLUE)📥 Updating dependencies...$(NC)"
	helm dependency update $(CHART_DIR)
	@echo "$(GREEN)✅ Dependencies updated$(NC)"

lint: ## Lint chart
	@echo "$(BLUE)🔍 Linting chart...$(NC)"
	helm lint $(CHART_DIR)
	@echo "$(GREEN)✅ Chart linted$(NC)"

install-client: deps lint ## Install client deployment
	@echo "$(BLUE)🚀 Installing CLIENT: $(CLIENT_NAME)$(NC)"
	helm install $(CLIENT_NAME) $(CHART_DIR) \
		-f $(CHART_DIR)/values-client.yaml \
		--set global.client.name=$(CLIENT_NAME) \
		--namespace $(NAMESPACE) \
		--create-namespace \
		--wait --timeout 10m
	@echo "$(GREEN)✅ Client deployed$(NC)"

install-server: deps lint ## Install server deployment
	@echo "$(BLUE)🚀 Installing SERVER$(NC)"
	helm install els-lms-server $(CHART_DIR) \
		-f $(CHART_DIR)/values-server.yaml \
		--namespace els-lms-server \
		--create-namespace \
		--wait --timeout 10m
	@echo "$(GREEN)✅ Server deployed$(NC)"

upgrade-client: deps ## Upgrade client
	@echo "$(BLUE)⬆️  Upgrading CLIENT: $(CLIENT_NAME)$(NC)"
	helm upgrade $(CLIENT_NAME) $(CHART_DIR) \
		-f $(CHART_DIR)/values-client.yaml \
		--set global.client.name=$(CLIENT_NAME) \
		--namespace $(NAMESPACE) \
		--wait --timeout 10m
	@echo "$(GREEN)✅ Upgrade complete$(NC)"

upgrade-server: deps ## Upgrade server
	@echo "$(BLUE)⬆️  Upgrading SERVER$(NC)"
	helm upgrade els-lms-server $(CHART_DIR) \
		-f $(CHART_DIR)/values-server.yaml \
		--namespace els-lms-server \
		--wait --timeout 10m
	@echo "$(GREEN)✅ Upgrade complete$(NC)"

status: ## Show status
	@echo "$(BLUE)Status ($(NAMESPACE)):$(NC)"
	@helm list -n $(NAMESPACE)
	@kubectl get pods -n $(NAMESPACE)

uninstall-client: ## Uninstall client
	helm uninstall $(CLIENT_NAME) -n $(NAMESPACE)

uninstall-server: ## Uninstall server
	helm uninstall els-lms-server -n els-lms-server

clean: ## Clean all resources
	helm uninstall $(CLIENT_NAME) -n $(NAMESPACE) || true
	kubectl delete pvc --all -n $(NAMESPACE) || true
EOF

  print_success "Makefile created"
}

create_argocd_applications() {
  print_step "Creating ArgoCD application manifests..."
  
  # Client Application
  cat > "$CHART_NAME/argocd/client-application.yaml" <<EOF
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: els-lms-client-temple
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  
  source:
    repoURL: ${GITHUB_REPO}
    targetRevision: ${GITHUB_BRANCH}
    path: ${CHART_NAME}
    helm:
      valueFiles:
        - values-client.yaml
      parameters:
        - name: global.client.name
          value: temple
  
  destination:
    server: https://kubernetes.default.svc
    namespace: temple
  
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
      - CreateNamespace=true
      - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
  
  revisionHistoryLimit: 3
EOF

  # Server Application
  cat > "$CHART_NAME/argocd/server-application.yaml" <<EOF
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: els-lms-server
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  
  source:
    repoURL: ${GITHUB_REPO}
    targetRevision: ${GITHUB_BRANCH}
    path: ${CHART_NAME}
    helm:
      valueFiles:
        - values-server.yaml
  
  destination:
    server: https://kubernetes.default.svc
    namespace: els-lms-server
  
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
      - CreateNamespace=true
      - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
  
  revisionHistoryLimit: 3
EOF

  # AppProject (optional)
  cat > "$CHART_NAME/argocd/appproject.yaml" <<'EOF'
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: els-lms
  namespace: argocd
spec:
  description: ELS Learning Management System Project
  
  sourceRepos:
    - '*'
  
  destinations:
    - namespace: 'els-lms-*'
      server: https://kubernetes.default.svc
    - namespace: 'temple*'
      server: https://kubernetes.default.svc
    - namespace: 'school-*'
      server: https://kubernetes.default.svc
  
  clusterResourceWhitelist:
    - group: ''
      kind: Namespace
  
  namespaceResourceWhitelist:
    - group: '*'
      kind: '*'
EOF

  print_success "ArgoCD applications created"
}

create_readme() {
  print_step "Creating README.md..."
  
  cat > "$CHART_NAME/README.md" <<'EOF'
# ELS-LMS Helm Chart

## 🚀 Quick Start

### Using Helm Directly

**Deploy Client:**
```bash
make install-client CLIENT_NAME=temple
```

**Deploy Server:**
```bash
make install-server
```

### Using ArgoCD

**Deploy Client via ArgoCD:**
```bash
kubectl apply -f argocd/client-application.yaml
```

**Deploy Server via ArgoCD:**
```bash
kubectl apply -f argocd/server-application.yaml
```

## 📦 What's Included

- **PostgreSQL 15** - Database
- **ELS-LMS API** - Strapi backend
- **ELS-LMS UI** - React frontend

## 🔧 Configuration

### Client Deployment
- Image: `harishdell/els-lmclient:1.1`
- Database: Local PostgreSQL (5Gi)
- Replicas: 1 API + 1 UI

### Server Deployment
- Image: `harishdell/els-lmsserver:1.0`
- Database: Centralized PostgreSQL (50Gi)
- Replicas: 3 API + 2 UI

## 📊 Common Commands

```bash
# Update dependencies
make deps

# Check status
make status NAMESPACE=temple

# Upgrade deployment
make upgrade-client CLIENT_NAME=temple

# Uninstall
make uninstall-client CLIENT_NAME=temple
```

## 🔗 Access

After deployment, add to `/etc/hosts`:

**Client:**
```
127.0.0.1 temple.local temple-api.local
```

**Server:**
```
127.0.0.1 els-lms-server.local els-lms-server-ui.local
```

## 📚 Documentation

See individual files:
- `values-client.yaml` - Client configuration
- `values-server.yaml` - Server configuration
- `argocd/` - ArgoCD manifests
EOF

  print_success "README.md created"
}

create_gitignore() {
  print_step "Creating .gitignore..."
  
  cat > "$CHART_NAME/.gitignore" <<'EOF'
# Helm
charts/*.tgz
*.lock
Chart.lock

# Kubernetes
*.log

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF

  print_success ".gitignore created"
}

deploy_with_argocd() {
  print_step "Deploying with ArgoCD..."
  
  # Check if ArgoCD is installed
  if ! kubectl get namespace argocd &> /dev/null; then
    print_error "ArgoCD namespace not found. Please install ArgoCD first."
    return 1
  fi
  
  print_info "Applying ArgoCD AppProject..."
  kubectl apply -f "$CHART_NAME/argocd/appproject.yaml"
  
  if [ "$DEPLOY_SERVER" = true ]; then
    print_info "Deploying ELS-LMS Server via ArgoCD..."
    kubectl apply -f "$CHART_NAME/argocd/server-application.yaml"
    print_success "Server application created in ArgoCD"
  fi
  
  if [ -n "$DEPLOY_CLIENT" ]; then
    print_info "Deploying ELS-LMS Client ($DEPLOY_CLIENT) via ArgoCD..."
    
    # Customize client application
    sed "s/temple/$DEPLOY_CLIENT/g" "$CHART_NAME/argocd/client-application.yaml" | \
    sed "s/els-lms-client-temple/els-lms-client-$DEPLOY_CLIENT/g" | \
    kubectl apply -f -
    
    print_success "Client application created in ArgoCD"
  fi
  
  print_info "Check ArgoCD UI for deployment status"
  echo ""
  echo "ArgoCD CLI commands:"
  echo "  argocd app list"
  echo "  argocd app get els-lms-server"
  echo "  argocd app sync els-lms-server"
}

deploy_with_helm() {
  if [ "$DEPLOY_SERVER" = true ]; then
    print_step "Deploying ELS-LMS Server with Helm..."
    cd "$CHART_NAME"
    make install-server
    cd ..
    print_success "Server deployed"
  fi
  
  if [ -n "$DEPLOY_CLIENT" ]; then
    print_step "Deploying ELS-LMS Client ($DEPLOY_CLIENT) with Helm..."
    cd "$CHART_NAME"
    make install-client CLIENT_NAME="$DEPLOY_CLIENT" NAMESPACE="$DEPLOY_CLIENT"
    cd ..
    print_success "Client deployed"
  fi
}

print_completion_summary() {
  echo ""
  echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║                    SETUP COMPLETED!                            ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${BLUE}📁 Chart Structure:${NC}"
  echo "  $CHART_NAME/"
  echo "  ├── Chart.yaml"
  echo "  ├── values.yaml"
  echo "  ├── values-client.yaml"
  echo "  ├── values-server.yaml"
  echo "  ├── Makefile"
  echo "  ├── README.md"
  echo "  ├── charts/"
  echo "  │   ├── postgres/"
  echo "  │   ├── els-lms-api/"
  echo "  │   └── els-lms-ui/"
  echo "  └── argocd/"
  echo ""
  
  echo -e "${YELLOW}📚 Next Steps:${NC}"
  echo ""
  
  if [ "$WITH_ARGOCD" = true ] || [ -n "$DEPLOY_CLIENT" ] || [ "$DEPLOY_SERVER" = true ]; then
    echo "✅ Deployment initiated!"
    echo ""
    if [ "$WITH_ARGOCD" = true ]; then
      echo "🔍 Check ArgoCD UI:"
      echo "   kubectl port-forward svc/argocd-server -n argocd 8080:443"
      echo "   Open: https://localhost:8080"
      echo ""
    fi
    
    if [ -n "$DEPLOY_CLIENT" ]; then
      echo "🌐 Client Access:"
      echo "   Add to /etc/hosts:"
      echo "   127.0.0.1 $DEPLOY_CLIENT.local $DEPLOY_CLIENT-api.local"
      echo ""
      echo "   UI:  http://$DEPLOY_CLIENT.local"
      echo "   API: http://$DEPLOY_CLIENT-api.local"
      echo ""
    fi
    
    if [ "$DEPLOY_SERVER" = true ]; then
      echo "🌐 Server Access:"
      echo "   Add to /etc/hosts:"
      echo "   127.0.0.1 els-lms-server.local els-lms-server-ui.local"
      echo ""
      echo "   UI:  http://els-lms-server-ui.local"
      echo "   API: http://els-lms-server.local"
      echo ""
    fi
    
    echo "📊 Check Status:"
    echo "   cd $CHART_NAME"
    if [ -n "$DEPLOY_CLIENT" ]; then
      echo "   make status NAMESPACE=$DEPLOY_CLIENT"
    fi
    if [ "$DEPLOY_SERVER" = true ]; then
      echo "   make status NAMESPACE=els-lms-server"
    fi
  else
    echo "1. Navigate to chart directory:"
    echo "   cd $CHART_NAME"
    echo ""
    echo "2. Deploy Client:"
    echo "   make install-client CLIENT_NAME=temple"
    echo ""
    echo "3. Deploy Server:"
    echo "   make install-server"
    echo ""
    echo "4. Or use ArgoCD:"
    echo "   kubectl apply -f argocd/client-application.yaml"
    echo "   kubectl apply -f argocd/server-application.yaml"
  fi
  
  echo ""
  echo -e "${BLUE}📖 Documentation:${NC}"
  echo "   cat $CHART_NAME/README.md"
  echo ""
  echo -e "${GREEN}🎉 Happy Learning!${NC}"
  echo ""
}

################################################################################
# Main Execution
################################################################################

main() {
  print_header
  
  # Create all files and directories
  create_chart_structure
  create_main_chart_yaml
  create_values_yaml
  create_values_client_yaml
  create_values_server_yaml
  create_postgres_chart
  create_api_chart
  create_ui_chart
  create_notes
  create_makefile
  create_argocd_applications
  create_readme
  create_gitignore
  
  print_success "All files created successfully!"
  
  # Deploy if requested
  if [ "$WITH_ARGOCD" = true ]; then
    deploy_with_argocd
  elif [ -n "$DEPLOY_CLIENT" ] || [ "$DEPLOY_SERVER" = true ]; then
    deploy_with_helm
  fi
  
  # Print summary
  print_completion_summary
}

# Run main function
main