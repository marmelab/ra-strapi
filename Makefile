.PHONY: build help

help:
	grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

seed: ## Seed the database
	cd packages/demo-strapi-server && yarn seed:example

install: ## Install the dependencies
	cp packages/demo-strapi-server/.env.example packages/demo-strapi-server/.env
	yarn
	${MAKE} seed
	cd packages/ra-strapi && yarn build

build: ## Build the package
	cd packages/ra-strapi && yarn build

start-demo: ## Start the demo
	cd ./packages/demo-react-admin && yarn dev

start-strapi-server: ## Start the fake API
	cd ./packages/demo-strapi-server && yarn develop

start: ## run the demo
	(trap 'kill 0' INT; ${MAKE} start-strapi-server & ${MAKE} start-demo)

publish: ## Publish the package
	cd packages/ra-strapi && npm publish