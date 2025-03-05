install: package.json ## install dependencies
	@if [ "$(CI)" != "true" ]; then \
		echo "Full install..."; \
		yarn; \
	fi
	@if [ "$(CI)" = "true" ]; then \
		echo "Frozen install..."; \
		yarn --frozen-lockfile; \
	fi

start-demo: ## Start the demo
	@cd ./packages/demo-react-admin && yarn dev

start-strapi-server: ## Start the fake API
	@cd ./packages/demo-strapi-server && yarn develop

start: ## run the demo
	@(trap 'kill 0' INT; ${MAKE} start-strapi-server & ${MAKE} start-demo)