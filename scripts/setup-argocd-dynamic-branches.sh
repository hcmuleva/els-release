#!/bin/bash

# Setup Script for ArgoCD Dynamic Branch Discovery
# This script sets up the SCM Provider ApplicationSet for automatic branch discovery

set -e

echo "🚀 Setting up ArgoCD Dynamic Branch Discovery"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed. Please install it first."
    exit 1
fi

# Check if ArgoCD namespace exists
if ! kubectl get namespace argocd &> /dev/null; then
    print_error "ArgoCD namespace not found. Please install ArgoCD first."
    exit 1
fi

print_success "Prerequisites checked"
echo ""

# Step 1: Prompt for GitHub token
echo "📝 Step 1: GitHub Token Setup"
echo "------------------------------"
echo "You need a GitHub Personal Access Token with 'repo' scope."
echo "Create one at: https://github.com/settings/tokens"
echo ""
read -p "Do you have a GitHub token? (y/n): " has_token

if [[ "$has_token" =~ ^[Yy]$ ]]; then
    read -sp "Enter your GitHub token (ghp_...): " github_token
    echo ""
    
    if [[ -z "$github_token" ]]; then
        print_error "Token cannot be empty"
        exit 1
    fi
    
    # Check if secret already exists
    if kubectl get secret github-token -n argocd &> /dev/null; then
        print_warning "Secret 'github-token' already exists. Deleting it..."
        kubectl delete secret github-token -n argocd
    fi
    
    # Create the secret
    kubectl create secret generic github-token \
        --from-literal=token="$github_token" \
        -n argocd
    
    print_success "GitHub token secret created"
    
    # Uncomment tokenRef in ApplicationSet
    UNCOMMENT_TOKEN=true
else
    print_warning "Skipping token setup. The ApplicationSet will work for public repos but may hit rate limits."
    UNCOMMENT_TOKEN=false
fi

echo ""

# Step 2: Clean up old configurations
echo "🧹 Step 2: Cleaning up old configurations"
echo "----------------------------------------"

# Delete old list-based ApplicationSet if exists
if kubectl get applicationset els-lmsserver-feature-branches -n argocd &> /dev/null; then
    print_warning "Deleting old list-based ApplicationSet..."
    kubectl delete applicationset els-lmsserver-feature-branches -n argocd
    print_success "Old ApplicationSet deleted"
else
    print_success "No old ApplicationSet found"
fi

echo ""

# Step 3: Apply the SCM Provider ApplicationSet
echo "🎯 Step 3: Applying SCM Provider ApplicationSet"
echo "----------------------------------------------"

APPLICATIONSET_FILE="../helm/charts/argocd/applicationset/els-lmsserver-scm-branches.yaml"

if [[ ! -f "$APPLICATIONSET_FILE" ]]; then
    print_error "ApplicationSet file not found: $APPLICATIONSET_FILE"
    exit 1
fi

# If token is provided, uncomment the tokenRef section
if [[ "$UNCOMMENT_TOKEN" == "true" ]]; then
    print_warning "Enabling token authentication in ApplicationSet..."
    
    # Create a temporary file with tokenRef uncommented
    TEMP_FILE=$(mktemp)
    sed 's/^        # tokenRef:/        tokenRef:/g; s/^        #   secretName:/          secretName:/g; s/^        #   key:/          key:/g' "$APPLICATIONSET_FILE" > "$TEMP_FILE"
    
    kubectl apply -f "$TEMP_FILE"
    rm "$TEMP_FILE"
else
    kubectl apply -f "$APPLICATIONSET_FILE"
fi

print_success "ApplicationSet applied"
echo ""

# Step 4: Verify ApplicationSet
echo "🔍 Step 4: Verifying ApplicationSet"
echo "----------------------------------"

if kubectl get applicationset els-lmsserver-scm-branches -n argocd &> /dev/null; then
    print_success "ApplicationSet 'els-lmsserver-scm-branches' is running"
    
    # Show ApplicationSet details
    echo ""
    echo "ApplicationSet Status:"
    kubectl get applicationset els-lmsserver-scm-branches -n argocd
else
    print_error "ApplicationSet not found"
    exit 1
fi

echo ""

# Step 5: Wait for branch discovery
echo "⏳ Step 5: Waiting for branch discovery (3 minutes)..."
echo "----------------------------------------------------"
echo "The ApplicationSet will query GitHub every 3 minutes to discover branches."
echo "Waiting for initial discovery..."

for i in {1..6}; do
    echo -n "."
    sleep 30
done

echo ""
echo ""

# Step 6: Check generated applications
echo "📊 Step 6: Checking generated applications"
echo "-----------------------------------------"

APPS=$(kubectl get applications -n argocd -o name | grep els-lmsserver || true)

if [[ -z "$APPS" ]]; then
    print_warning "No applications found yet. It may take up to 3 minutes for initial discovery."
    print_warning "Run this command to check later:"
    echo "  kubectl get applications -n argocd | grep els-lmsserver"
else
    print_success "Found applications:"
    kubectl get applications -n argocd | grep els-lmsserver
fi

echo ""

# Step 7: Show branch patterns
echo "🎨 Step 7: Branch Pattern Configuration"
echo "--------------------------------------"
echo "The ApplicationSet will discover branches matching these patterns:"
echo "  - feature/*"
echo "  - bug/*"
echo "  - bugfix/*"
echo "  - patch/*"
echo "  - minor/*"
echo "  - major/*"
echo ""

# Step 8: Testing instructions
echo "🧪 Step 8: Testing the Setup"
echo "---------------------------"
echo "To test the dynamic branch discovery:"
echo ""
echo "1. Create a new feature branch:"
echo "   git checkout -b feature/test-dynamic"
echo "   echo '// test' >> developer/lmsserver/src/index.ts"
echo "   git add . && git commit -m 'feat: test dynamic discovery'"
echo "   git push origin feature/test-dynamic"
echo ""
echo "2. Wait 3 minutes for ArgoCD to discover the branch"
echo ""
echo "3. Check if application was created:"
echo "   kubectl get applications -n argocd | grep feature-test-dynamic"
echo ""
echo "4. View application details:"
echo "   argocd app get els-lmsserver-feature-test-dynamic"
echo ""

# Summary
echo "✨ Setup Complete!"
echo "=================="
echo ""
print_success "Dynamic branch discovery is now configured!"
echo ""
echo "Monitoring commands:"
echo "  - List all apps:           kubectl get applications -n argocd | grep els-lmsserver"
echo "  - ApplicationSet status:   kubectl describe applicationset els-lmsserver-scm-branches -n argocd"
echo "  - Watch for new apps:      watch kubectl get applications -n argocd | grep els-lmsserver"
echo ""
echo "Documentation: See ARGOCD_DYNAMIC_BRANCHES.md for detailed information"
