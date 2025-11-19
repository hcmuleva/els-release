#!/bin/bash

# Quick Fix Script for ArgoCD ApplicationSet Issue
# This script replaces the problematic SCM Provider with a simpler CI-managed approach

set -e

echo "🔧 ArgoCD ApplicationSet Quick Fix"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Check kubectl
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed"
    exit 1
fi

# Check if ArgoCD namespace exists
if ! kubectl get namespace argocd &> /dev/null; then
    print_error "ArgoCD namespace not found"
    exit 1
fi

print_success "Prerequisites checked"
echo ""

# Step 1: Delete the problematic SCM provider ApplicationSet
echo "🗑️  Step 1: Removing problematic SCM provider ApplicationSet"
echo "-----------------------------------------------------------"

if kubectl get applicationset els-lmsserver-scm-branches -n argocd &> /dev/null; then
    print_warning "Deleting els-lmsserver-scm-branches ApplicationSet..."
    kubectl delete applicationset els-lmsserver-scm-branches -n argocd
    print_success "Deleted problematic ApplicationSet"
else
    print_info "ApplicationSet els-lmsserver-scm-branches not found (already deleted)"
fi

# Also delete any other old versions
for appset in els-lmsserver-feature-branches els-lmsserver-dynamic-branches els-lmsserver-git-branches; do
    if kubectl get applicationset $appset -n argocd &> /dev/null 2>&1; then
        print_warning "Deleting old ApplicationSet: $appset"
        kubectl delete applicationset $appset -n argocd
    fi
done

echo ""

# Step 2: Delete the GitHub token secret (not needed anymore)
echo "🔐 Step 2: Removing GitHub token secret (not needed anymore)"
echo "-----------------------------------------------------------"

if kubectl get secret github-token -n argocd &> /dev/null; then
    print_warning "Deleting github-token secret..."
    kubectl delete secret github-token -n argocd
    print_success "Deleted GitHub token secret"
else
    print_info "Secret github-token not found (already deleted)"
fi

echo ""

# Step 3: Apply the new simple ApplicationSet
echo "📦 Step 3: Applying new CI-managed ApplicationSet"
echo "-------------------------------------------------"

APPLICATIONSET_FILE="../helm/charts/argocd/applicationset/els-lmsserver-simple.yaml"

if [[ ! -f "$APPLICATIONSET_FILE" ]]; then
    print_error "ApplicationSet file not found: $APPLICATIONSET_FILE"
    exit 1
fi

kubectl apply -f "$APPLICATIONSET_FILE"
print_success "Applied new ApplicationSet: els-lmsserver-branches"

echo ""

# Step 4: Verify the ApplicationSet
echo "🔍 Step 4: Verifying ApplicationSet"
echo "----------------------------------"

sleep 2

if kubectl get applicationset els-lmsserver-branches -n argocd &> /dev/null; then
    print_success "ApplicationSet is running"
    echo ""
    kubectl get applicationset els-lmsserver-branches -n argocd
else
    print_error "ApplicationSet not found"
    exit 1
fi

echo ""

# Step 5: Check current branch and register it
echo "🌿 Step 5: Checking current branch"
echo "---------------------------------"

CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

if [[ "$CURRENT_BRANCH" == "unknown" ]]; then
    print_warning "Not in a git repository or no branch checked out"
else
    print_info "Current branch: $CURRENT_BRANCH"
    
    # Check if branch matches deployment patterns
    if [[ "$CURRENT_BRANCH" =~ ^(feature|bug|bugfix|patch|minor|major)/.+ ]]; then
        print_success "Branch matches deployment pattern!"
        
        # Check if already registered
        if kubectl get applicationset els-lmsserver-branches -n argocd -o yaml | grep -q "branch: $CURRENT_BRANCH"; then
            print_info "Branch already registered in ApplicationSet"
        else
            print_warning "Branch not yet registered. It will be auto-registered on next CI run."
        fi
        
        # Check if application exists
        SAFE_BRANCH=$(echo "$CURRENT_BRANCH" | tr '/' '-')
        if kubectl get application "els-lmsserver-$SAFE_BRANCH" -n argocd &> /dev/null; then
            print_success "ArgoCD application exists: els-lmsserver-$SAFE_BRANCH"
        else
            print_info "ArgoCD application will be created after CI registers the branch"
        fi
    else
        print_warning "Branch '$CURRENT_BRANCH' doesn't match deployment patterns"
        print_info "Expected patterns: feature/*, bug/*, bugfix/*, patch/*, minor/*, major/*"
    fi
fi

echo ""

# Step 6: Show next steps
echo "📋 Next Steps"
echo "------------"
echo ""
echo "1. Make a change to trigger CI:"
echo "   ${BLUE}echo '// test' >> developer/lmsserver/src/index.ts${NC}"
echo "   ${BLUE}git add . && git commit -m 'feat: test CI-managed ArgoCD'${NC}"
echo "   ${BLUE}git push${NC}"
echo ""
echo "2. Wait 2-3 minutes for CI to complete"
echo ""
echo "3. Verify the branch was registered:"
echo "   ${BLUE}kubectl get applicationset els-lmsserver-branches -n argocd -o yaml | grep 'branch:'${NC}"
echo ""
echo "4. Check if ArgoCD application was created:"
echo "   ${BLUE}kubectl get applications -n argocd | grep els-lmsserver${NC}"
echo ""
echo "5. Monitor application status:"
echo "   ${BLUE}argocd app get els-lmsserver-$SAFE_BRANCH${NC}"
echo ""

# Summary
echo "✨ Fix Applied Successfully!"
echo "==========================="
echo ""
print_success "The problematic SCM provider approach has been replaced"
print_success "New CI-managed approach requires NO GitHub token"
print_success "Branches will be auto-registered by CI workflow"
echo ""
print_info "How it works:"
echo "  1. You push code to feature/*, bug/*, bugfix/*, patch/* branch"
echo "  2. CI builds image and updates values_dev.yaml"
echo "  3. CI automatically registers branch in ApplicationSet"
echo "  4. ArgoCD creates application and syncs deployment"
echo "  5. CD workflow runs Karate tests"
echo ""
print_info "Documentation: See ARGOCD_WORKING_SOLUTION.md for details"
echo ""
print_warning "If you have uncommitted changes, commit and push to trigger the flow"
