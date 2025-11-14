#!/bin/bash

# ELS-LMS Stack Testing Script

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=========================================="
echo "ELS-LMS Stack Testing"
echo "=========================================="
echo ""

# Check if port-forward is running
if ! curl -s -f http://elslms.local/ > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Cannot reach elslms.local${NC}"
    echo "Please ensure:"
    echo "1. Port forwarding is active: kubectl port-forward -n istio-system service/istio-ingressgateway 80:80"
    echo "2. /etc/hosts has: 127.0.0.1 elslms.local"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${BLUE}=== 1. Testing Application Endpoints ===${NC}"
echo ""

# Test Root Path
echo -n "Testing Root Path (/)... "
if curl -f -s -o /dev/null -w "%{http_code}" http://elslms.local/ | grep -q "200\|302"; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

# Test LMS Client
echo -n "Testing LMS Client (/lmsclient)... "
if curl -f -s -o /dev/null -w "%{http_code}" 
 | grep -q "200\|302"; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

# Test LMS Server Health
echo -n "Testing LMS Server Health (/lmsserver/_health)... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://elslms.local/lmsserver/_health)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASS (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP $HTTP_CODE${NC}"
fi

# Test LMS Server Base
echo -n "Testing LMS Server Base (/lmsserver/)... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://elslms.local/lmsserver/)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "404" ]; then
    echo -e "${GREEN}✅ PASS (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP $HTTP_CODE${NC}"
fi

echo ""
echo -e "${BLUE}=== 2. Testing Monitoring Endpoints ===${NC}"
echo ""

# Test Kiali
echo -n "Testing Kiali (/kiali)... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://elslms.local/kiali)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP $HTTP_CODE (May need Istio addons installed)${NC}"
fi

# Test Prometheus
echo -n "Testing Prometheus (/prometheus)... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://elslms.local/prometheus)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP $HTTP_CODE (May need Istio addons installed)${NC}"
fi

# Test Grafana
echo -n "Testing Grafana (/grafana)... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://elslms.local/grafana)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP $HTTP_CODE (May need Istio addons installed)${NC}"
fi

# Test Jaeger
echo -n "Testing Jaeger (/jaeger)... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://elslms.local/jaeger)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP $HTTP_CODE (May need Istio addons installed)${NC}"
fi

echo ""
echo -e "${BLUE}=== 3. Checking Kubernetes Resources ===${NC}"
echo ""

# Check Pods
echo "Pod Status:"
kubectl get pods -n els-lms
echo ""

# Check Services
echo "Services:"
kubectl get svc -n els-lms
echo ""

# Check Istio Resources
echo "Istio Resources:"
kubectl get gateway,virtualservice,destinationrule,peerauthentication -n els-lms
echo ""

echo ""
echo -e "${BLUE}=== 4. Checking Pod Health ===${NC}"
echo ""

# Check if all pods are ready
NOT_READY=$(kubectl get pods -n els-lms --no-headers | grep -v "2/2.*Running" | wc -l)
TOTAL_PODS=$(kubectl get pods -n els-lms --no-headers | wc -l)
READY_PODS=$((TOTAL_PODS - NOT_READY))

echo "Pods Ready: $READY_PODS/$TOTAL_PODS"

if [ $NOT_READY -eq 0 ]; then
    echo -e "${GREEN}✅ All pods are ready${NC}"
else
    echo -e "${YELLOW}⚠️  $NOT_READY pod(s) not ready${NC}"
    echo ""
    echo "Pods not ready:"
    kubectl get pods -n els-lms | grep -v "2/2.*Running"
fi

echo ""
echo -e "${BLUE}=== 5. Load Test (10 requests) ===${NC}"
echo ""

SUCCESS=0
FAILED=0

for i in {1..10}; do
    if curl -f -s http://elslms.local/lmsserver/_health > /dev/null 2>&1; then
        SUCCESS=$((SUCCESS + 1))
        echo -n "."
    else
        FAILED=$((FAILED + 1))
        echo -n "x"
    fi
    sleep 0.5
done

echo ""
echo "Success: $SUCCESS/10, Failed: $FAILED/10"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Load test passed${NC}"
else
    echo -e "${YELLOW}⚠️  Some requests failed${NC}"
fi

echo ""
echo "=========================================="
echo "Testing Summary"
echo "=========================================="
echo ""
echo "Application URLs:"
echo "  • Root:       http://elslms.local/"
echo "  • LMS Client: http://elslms.local/lmsclient"
echo "  • LMS Server: http://elslms.local/lmsserver"
echo ""
echo "Monitoring URLs:"
echo "  • Kiali:      http://elslms.local/kiali"
echo "  • Prometheus: http://elslms.local/prometheus"
echo "  • Grafana:    http://elslms.local/grafana"
echo "  • Jaeger:     http://elslms.local/jaeger"
echo ""
echo "Next Steps:"
echo "  • Open http://elslms.local/lmsclient in your browser"
echo "  • View service mesh in Kiali: http://elslms.local/kiali"
echo "  • Check logs: kubectl logs -n els-lms <pod-name> -c <container>"
echo "=========================================="
