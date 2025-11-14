#!/bin/bash

# ELS-LMS Stack Cleanup Script

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=========================================="
echo "ELS-LMS Stack Cleanup"
echo "=========================================="
echo ""

echo -e "${BLUE}Step 1: Stopping port-forward processes...${NC}"
pkill -f "port-forward" || true
echo -e "${GREEN}✅ Port-forward processes stopped${NC}"
echo ""

echo -e "${BLUE}Step 2: Uninstalling Helm release...${NC}"
if helm list -n els-lms | grep -q els-lms; then
    helm uninstall els-lms -n els-lms
    echo -e "${GREEN}✅ Helm release 'els-lms' uninstalled${NC}"
else
    echo -e "${YELLOW}⚠️  No Helm release 'els-lms' found${NC}"
fi
echo ""

echo -e "${BLUE}Step 3: Deleting namespace...${NC}"
if kubectl get namespace els-lms &> /dev/null; then
    kubectl delete namespace els-lms --timeout=60s
    echo -e "${GREEN}✅ Namespace 'els-lms' deleted${NC}"
else
    echo -e "${YELLOW}⚠️  Namespace 'els-lms' not found${NC}"
fi
echo ""

echo -e "${BLUE}Step 4: Cleaning up any leftover Istio resources...${NC}"
kubectl delete gateway,virtualservice,destinationrule,peerauthentication -n default -l app=els-lms 2>/dev/null || true
echo -e "${GREEN}✅ Leftover Istio resources cleaned${NC}"
echo ""

echo -e "${BLUE}Step 5: Verifying cleanup...${NC}"
echo "Checking for remaining resources..."
REMAINING_PODS=$(kubectl get pods -n els-lms 2>/dev/null | wc -l)
REMAINING_NS=$(kubectl get namespace els-lms 2>/dev/null | wc -l)

if [ "$REMAINING_PODS" -gt 0 ] || [ "$REMAINING_NS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Some resources may still be terminating...${NC}"
    echo "Waiting 10 seconds for cleanup to complete..."
    sleep 10
else
    echo -e "${GREEN}✅ All resources cleaned up${NC}"
fi
echo ""

echo "=========================================="
echo -e "${GREEN}Cleanup Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Transfer these files to your other laptop:"
echo "   - helm/ directory (entire folder)"
echo "   - All deployment scripts"
echo ""
echo "2. On the other laptop, run:"
echo "   - Add to /etc/hosts: 127.0.0.1 elslms.local"
echo "   - ./deploy.sh"
echo "   - kubectl port-forward -n istio-system service/istio-ingressgateway 80:80"
echo "   - ./test-deployment.sh"
echo ""
echo "=========================================="
