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
	clean-lib
	clean-local-n8n

build:
	build-bridge
	build-lib

run:
	bash run.sh

publish:
	npm publish

clean-bridge:
	rm -rf build/

clean-lib:
	rm -rf td/build/

clean-local-n8n:
	rm -rf ~/.n8n/nodes/

build-bridge:
	rm -rf prebuilds/bridge/
	node-gyp rebuild
	mkdir -p prebuilds/bridge/
	cp build/Release/bridge.node prebuilds/bridge/`uname -s | tr '[:upper:]' '[:lower:]'`-`uname -m`.node

test:
	cd td
	ls

build-lib:
	rm -rf prebuilds/lib/
	mkdir -p td/build
ifeq ($(UNAME), Linux)
	cd td/build ; cmake -DCMAKE_BUILD_TYPE=Release -DOPENSSL_USE_STATIC_LIBS=TRUE -DZLIB_USE_STATIC_LIBS=TRUE ..
endif
ifeq ($(UNAME), Darwin)
	cd td/build ; cmake -DCMAKE_BUILD_TYPE=Release \
-DOPENSSL_ROOT_DIR=/opt/homebrew/opt/openssl@1.1 \
-DZLIB_INCLUDE_DIR=/opt/homebrew/opt/zlib/include \
-DZLIB_LIBRARY=/opt/homebrew/opt/zlib/lib/libz.a \
-DOPENSSL_USE_STATIC_LIBS=TRUE -DZLIB_USE_STATIC_LIBS=TRUE ..
endif
	cd td/build ; cmake --build . --target tdjson -- -j 3
	cd td/ ; otool -L build/libtdjson.dylib
	mkdir -p prebuilds/lib/
ifeq ($(UNAME), Darwin)
	cp td/build/libtdjson.dylib prebuilds/lib/`uname -s | tr '[:upper:]' '[:lower:]'`-`uname -m`.dylib
endif
ifeq ($(UNAME), Linux)
	cp td/build/libtdjson.so prebuilds/lib/`uname -s | tr '[:upper:]' '[:lower:]'`-`uname -m`.so
endif
	npm pack --dry-run
