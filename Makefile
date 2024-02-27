UNAME := $(shell uname)

.ONESHELL:

init:
	npm install n8n -g
	npm install --save-dev babel-cli
	pnpm install

run:
	bash run.sh

publish:
	npm publish

clean:
	rm -rf dist/
	rm -rf node_modules/

unlink:
	cd ~/.n8n/nodes/ &&	npm unlink @telepilotco/n8n-nodes-telepilot
