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

run:
	bash run.sh

publish:
	npm publish

clean:
	rm -rf dist/
	rm -rf node_modules/
