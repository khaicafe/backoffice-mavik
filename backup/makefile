# Makefile

# Variables
REPO_URL = github.com/thanhcnn2000/icecream-manager
GITHUB_TOKEN = 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
REPO_BRANCH = main
BUILD_DIR = ~/tmp/build
BACKEND_IMAGE = your-backend-image
FRONTEND_IMAGE = your-frontend-image

# Define the path to the pack CLI
PACK_CMD = /usr/local/bin/pack

.PHONY: install-pack
install-pack:
	@echo "Checking for pack CLI..."
	@if ! command -v $(PACK_CMD) &> /dev/null; then \
		echo "pack could not be found, detecting OS..."; \
		OS=$(shell uname | tr '[:upper:]' '[:lower:]'); \
		echo "Operating System: $$OS"; \
		if [ "$$OS" = "linux" ]; then \
			PACK_URL="https://github.com/buildpacks/pack/releases/download/v0.28.0/pack-v0.28.0-linux.tgz"; \
		elif [ "$$OS" = "darwin" ]; then \
			ARCH=$$(uname -m); \
			if [ "$$ARCH" = "arm64" ]; then \
				PACK_URL="https://github.com/buildpacks/pack/releases/download/v0.28.0/pack-v0.28.0-macos-arm64.tgz"; \
			elif [ "$$ARCH" = "x86_64" ]; then \
				PACK_URL="https://github.com/buildpacks/pack/releases/download/v0.28.0/pack-v0.28.0-macos.tgz"; \
			else \
				echo "Unsupported macOS architecture: $$ARCH"; exit 1; \
			fi; \
		elif [ "$$OS" = "windows" ]; then \
			PACK_URL="https://github.com/buildpacks/pack/releases/download/v0.28.0/pack-v0.28.0-windows.zip"; \
		else \
			echo "Unsupported OS: $$OS"; exit 1; \
		fi; \
		echo "Downloading pack from $$PACK_URL..."; \
		if [ "$$OS" = "windows" ]; then \
			curl -sSL "$$PACK_URL" -o pack.zip && unzip pack.zip -d /usr/local/bin/; \
		else \
			curl -sSL "$$PACK_URL" | sudo tar -C /usr/local/bin/ -xzv pack; \
		fi; \
		echo "pack installed."; \
	else \
		echo "pack is already installed."; \
	fi


.PHONY: clone-backend
clone-backend:
	@echo "Cloning backend repository..."
	@rm -rf $(BUILD_DIR)
	@mkdir -p $(BUILD_DIR)
	@git clone --branch $(REPO_BRANCH) https://$(GITHUB_TOKEN)@$(REPO_URL) $(BUILD_DIR)

.PHONY: build-backend
build-backend: install-pack clone-backend
	@echo "Building backend Docker image with Buildpacks..."
	@$(PACK_CMD) build $(BACKEND_IMAGE) --path $(BUILD_DIR)/backend --builder paketobuildpacks/builder:base

.PHONY: build-frontend
build-frontend: install-pack clone-backend
	@echo "Building frontend Docker image with Buildpacks..."
	@$(PACK_CMD) build $(FRONTEND_IMAGE) --path $(BUILD_DIR)/frontend --builder paketobuildpacks/builder:base

.PHONY: build
build: build-backend build-frontend

.PHONY: up
up:
	@docker-compose up --build

.PHONY: down
down:
	@docker-compose down

.PHONY: clean
clean:
	@rm -rf $(BUILD_DIR)
	@docker-compose down --rmi all --volumes --remove-orphans
