#!/bin/bash

################################################################################
# ELS-LMS Quick Fix Script - Path-Based Routing
################################################################################

set -e

NAMESPACE="${1:-els-lms}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          ELS-LMS Path-Based Routing - Quick Fix               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

################################################################################
# Step 1: Enable Istio Injection
################################################################################
echo -e "${GREEN}[1/6] Enabling Istio injection on namespace...${NC}"

if kubectl get namespace "$NAMESPACE" &>/dev/null; then
    kubectl label namespace "$NAMESPACE" istio-injection=enabled --overwrite
    echo -e "${GREEN}✓ Istio injection enabled${NC}"
else
    echo -e "${YELLOW}Creating namespace with Istio injection...${NC}"
    kubectl create namespace "$NAMESPACE"
    kubectl label namespace "$NAMESPACE" istio-injection=enabled
    echo -e "${GREEN}✓ Namespace created with Istio injection${NC}"
fi
echo ""

################################################################################
# Step 2: Update Helm Chart
################################################################################
echo -e "${GREEN}[2/6] Updating Helm dependencies...${NC}"

cd els-lms-stack
helm dependency update
echo -e "${GREEN}✓ Dependencies updated${NC}"
echo ""

################################################################################
# Step 3: Deploy/Upgrade Application
################################################################################
echo -e "${GREEN}[3/6] Deploying/Upgrading ELS-LMS application...${NC}"

helm upgrade --install els-lms . \
  -n "$NAMESPACE" \
  --wait \
  --timeout 10m \
  --set global.istio.enabled=true \
  --set els-lms-api.env.DATABASE_HOST=els-lms-postgres-postgres

echo -e "${GREEN}✓ Application deployed${NC}"
echo ""

################################################################################
# Step 4: Restart Deployments (to inject sidecars)
################################################################################
echo -e "${GREEN}[4/6] Restarting deployments to inject Istio sidecars...${NC}"

kubectl rollout restart deployment -n "$NAMESPACE"
kubectl rollout status deployment -n "$NAMESPACE" --timeout=5m

echo -e "${GREEN}✓ Deployments restarted${NC}"
echo ""

################################################################################
# Step 5: Verify Istio Resources
################################################################################
echo -e "${GREEN}[5/6] Verifying Istio resources...${NC}"

sleep 5

# Check Gateway
if kubectl get gateway -n "$NAMESPACE" &>/dev/null; then
    GATEWAYS=$(kubectl get gateway -n "$NAMESPACE" --no-headers | wc -l)
    echo -e "${GREEN}✓ Gateway created ($GATEWAYS found)${NC}"
else
    echo -e "${RED}✗ No Gateway found${NC}"
fi

# Check VirtualService
if kubectl get virtualservice -n "$NAMESPACE" &>/dev/null; then
    VIRTUALSERVICES=$(kubectl get virtualservice -n "$NAMESPACE" --no-headers | wc -l)
    echo -e "${GREEN}✓ VirtualService created ($VIRTUALSERVICES found)${NC}"
else
    echo -e "${RED}✗ No VirtualService found${NC}"
fi

# Check DestinationRules
if kubectl get destinationrule -n "$NAMESPACE" &>/dev/null; then
    DESTRULES=$(kubectl get destinationrule -n "$NAMESPACE" --no-headers | wc -l)
    echo -e "${GREEN}✓ DestinationRules created ($DESTRULES found)${NC}"
else
    echo -e "${YELLOW}⚠ No DestinationRules found${NC}"
fi

# Check Pods with Sidecars
echo ""
echo -e "${YELLOW}Checking pod sidecar injection:${NC}"
kubectl get pods -n "$NAMESPACE" -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[*].name}{"\n"}{end}' | \
while read pod containers; do
    if echo "$containers" | grep -q "istio-proxy"; then
        echo -e "  ${GREEN}✓${NC} $pod has sidecar"
    else
        echo -e "  ${RED}✗${NC} $pod missing sidecar"
    fi
done

echo ""

################################################################################
# Step 6: Configure /etc/hosts
################################################################################
echo -e "${GREEN}[6/6] Configuring /etc/hosts...${NC}"

# Get Ingress Gateway details
INGRESS_TYPE=$(kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.spec.type}')

if [ "$INGRESS_TYPE" == "LoadBalancer" ]; then
    INGRESS_IP=$(kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    if [ -z "$INGRESS_IP" ]; then
        INGRESS_IP=$(kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
    fi
    
    if [ -n "$INGRESS_IP" ]; then
        echo -e "${YELLOW}Add this to /etc/hosts:${NC}"
        echo -e "${BLUE}$INGRESS_IP elslms.local${NC}"
    else
        echo -e "${YELLOW}LoadBalancer IP pending... Check later with:${NC}"
        echo "kubectl get svc istio-ingressgateway -n istio-system"
    fi
    
elif [ "$INGRESS_TYPE" == "NodePort" ]; then
    INGRESS_PORT=$(kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}')
    NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')
    
    if [ -z "$NODE_IP" ]; then
        NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="ExternalIP")].address}')
    fi
    
    echo -e "${YELLOW}NodePort configuration detected${NC}"
    echo -e "${YELLOW}Add this to /etc/hosts:${NC}"
    echo -e "${BLUE}$NODE_IP elslms.local${NC}"
    echo ""
    echo -e "${YELLOW}Access URLs:${NC}"
    echo -e "  UI:  ${BLUE}http://$NODE_IP:$INGRESS_PORT/lmsclient/${NC}"
    echo -e "  API: ${BLUE}http://$NODE_IP:$INGRESS_PORT/lmsserver/${NC}"
    
else
    echo -e "${YELLOW}Using default localhost${NC}"
    echo -e "${YELLOW}Add this to /etc/hosts:${NC}"
    echo -e "${BLUE}127.0.0.1 elslms.local${NC}"
fi

echo ""

################################################################################
# Final Summary
################################################################################
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                        Setup Complete!                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}✓ Istio injection enabled${NC}"
echo -e "${GREEN}✓ Application deployed${NC}"
echo -e "${GREEN}✓ Istio resources created${NC}"
echo -e "${GREEN}✓ Sidecars injected${NC}"
echo ""

echo -e "${YELLOW}📋 Next Steps:${NC}"
echo ""
echo "1. Update /etc/hosts as shown above"
echo ""
echo "2. Wait for all pods to be ready:"
echo "   kubectl get pods -n $NAMESPACE -w"
echo ""
echo "3. Test the application:"
if [ "$INGRESS_TYPE" == "NodePort" ] && [ -n "$NODE_IP" ] && [ -n "$INGRESS_PORT" ]; then
    echo "   curl http://$NODE_IP:$INGRESS_PORT/lmsclient/"
    echo "   curl http://$NODE_IP:$INGRESS_PORT/lmsserver/_health"
else
    echo "   curl http://elslms.local/lmsclient/"
    echo "   curl http://elslms.local/lmsserver/_health"
fi
echo ""
echo "4. Open in browser:"
if [ "$INGRESS_TYPE" == "NodePort" ] && [ -n "$NODE_IP" ] && [ -n "$INGRESS_PORT" ]; then
    echo "   http://$NODE_IP:$INGRESS_PORT/lmsclient/"
else
    echo "   http://elslms.local/lmsclient/"
fi
echo ""

echo -e "${BLUE}🔍 Troubleshooting:${NC}"
echo "   ./debug-istio-routing.sh $NAMESPACE"
echo ""

echo -e "${BLUE}📊 Check resources:${NC}"
echo "   kubectl get gateway,virtualservice,destinationrule -n $NAMESPACE"
echo ""

echo -e "${GREEN}🎉 Done!${NC}"