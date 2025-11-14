#!/bin/bash

# ELS-LMS Stack Deployment Script with Istio

set -e

echo "=========================================="
echo "ELS-LMS Stack Deployment with Istio"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo "Step 1: Checking Prerequisites..."

# Check kubectl
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl not found. Please install kubectl.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ kubectl found${NC}"

# Check helm
if ! command -v helm &> /dev/null; then
    echo -e "${RED}❌ helm not found. Please install helm.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ helm found${NC}"

# Check Kubernetes cluster
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}❌ Cannot connect to Kubernetes cluster.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Kubernetes cluster accessible${NC}"

# Check Istio
if ! kubectl get namespace istio-system &> /dev/null; then
    echo -e "${YELLOW}⚠️  Istio not found. Please install Istio first.${NC}"
    echo "Run: istioctl install --set profile=demo -y"
    exit 1
fi
echo -e "${GREEN}✅ Istio is installed${NC}"

echo ""
echo "Step 2: Checking /etc/hosts..."
if grep -q "elslms.local" /etc/hosts; then
    echo -e "${GREEN}✅ elslms.local found in /etc/hosts${NC}"
else
    echo -e "${YELLOW}⚠️  elslms.local not found in /etc/hosts${NC}"
    echo "Please add: 127.0.0.1 elslms.local"
    echo "Run: echo '127.0.0.1 elslms.local' | sudo tee -a /etc/hosts"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "Step 3: Updating Helm Dependencies..."
cd els-lms-stack
helm dependency update
cd ..
echo -e "${GREEN}✅ Dependencies updated${NC}"

echo ""
echo "Step 4: Validating Helm Chart..."
helm lint els-lms-stack/
echo -e "${GREEN}✅ Chart validated${NC}"

echo ""
echo "Step 5: Deploying Helm Chart..."
helm upgrade --install els-lms els-lms-stack/ \
  -n els-lms \
  --create-namespace \
  --timeout 10m \
  --wait

echo -e "${GREEN}✅ Helm chart deployed${NC}"

echo ""
echo "Step 6: Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/managed-by=Helm -n els-lms --timeout=300s || true

echo ""
echo "Step 7: Checking Deployment Status..."
echo ""
kubectl get pods -n els-lms
echo ""
kubectl get svc -n els-lms
echo ""
kubectl get gateway,virtualservice,destinationrule -n els-lms

echo ""
echo "=========================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "Next Steps:"
echo ""
echo "1. Port forward the Istio Ingress Gateway:"
echo "   kubectl port-forward -n istio-system service/istio-ingressgateway 80:80"
echo ""
echo "2. Access the application:"
echo "   - LMS Client: http://elslms.local/lmsclient"
echo "   - LMS Server: http://elslms.local/lmsserver"
echo "   - Root Path:  http://elslms.local/"
echo ""
echo "3. Access monitoring tools:"
echo "   - Kiali:      http://elslms.local/kiali"
echo "   - Prometheus: http://elslms.local/prometheus"
echo "   - Grafana:    http://elslms.local/grafana"
echo "   - Jaeger:     http://elslms.local/jaeger"
echo ""
echo "4. Run tests:"
echo "   ./test-deployment.sh"
echo ""
echo "For detailed documentation, see:"
echo "   - ISTIO-DEPLOYMENT.md"
echo "   - DEPLOYMENT-COMMANDS.md"
echo "=========================================="
