UNAME := $(shell uname)

.ONESHELL:

init:
	npm install n8n -g
	npm install --save-dev babel-cli
	pnpm install

run-local:	build unlink link

publish:
	npm publish

build:
	npm run build

clean:
	rm -rf dist/
	rm -rf node_modules/

unlink:
	cd ~/.n8n/nodes/ &&	npm unlink @telepilotco/n8n-nodes-telepilot
link:
	npm link
	cd ~/.n8n/ && mkdir -p nodes && cd nodes && npm link @telepilotco/n8n-nodes-telepilot
