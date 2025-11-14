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
