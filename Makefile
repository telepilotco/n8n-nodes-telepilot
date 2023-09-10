UNAME := $(shell uname)

.ONESHELL:

init:
	npm install -g node-gyp
	npm install n8n -g
	npm install --save-dev babel-cli
	pnpm install
ifeq ($(UNAME), Darwin)
	curl -sL https://github.com/nodejs/node-gyp/raw/main/macOS_Catalina_acid_test.sh | bash
	xcode-select --install
	brew install gperf openssl zlib #macos-only
endif
ifeq ($(UNAME), Linux)
#see https://tdlib.github.io/td/build.html?language=JavaScript
	sudo sudo apt-get install make git zlib1g-dev libssl-dev gperf php-cli cmake g++ -y
endif

clean:
	clean-bridge
	clean-local-n8n

build:
	build-bridge

run:
	bash run.sh

publish:
	npm publish

clean-bridge:
	rm -rf build/

clean-local-n8n:
	rm -rf ~/.n8n/nodes/

build-bridge:
	rm -rf prebuilds/bridge/
	node-gyp rebuild
	mkdir -p prebuilds/bridge/
	cp build/Release/bridge.node prebuilds/bridge/`uname -s | tr '[:upper:]' '[:lower:]'`-`uname -m`.node

build-bridge-musl:
	sudo docker build -t build_bridge .
	sudo docker create --name dummy build_bridge
	sudo docker cp -L dummy:/bridge/prebuilds/bridge/linux-x64.node linux-x64.node
	cp linux-x64.node prebuilds-musl/bridge/
	cp linux-x64.node /var/data/n8n/nodes/node_modules/n8n-nodes-telepilot/prebuilds/bridge/linux-x64.node
	cp linux-x64.node ../tdl/linux-x64.node

test:
	cd td
	ls

add-n8n-credentials:
	#tbd curl

add-n8n-workflows:
	#tbd curl
