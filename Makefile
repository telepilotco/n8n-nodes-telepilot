UNAME := $(shell uname)

init:
	npm install -g node-gyp
	npm install n8n -g
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
	rm -rf prebuilds/tdlib-bridge/
	node-gyp rebuild
	mkdir -p prebuilds/tdlib-bridge/
	cp build/Release/bridge.node prebuilds/tdlib-bridge/`uname -s | tr '[:upper:]' '[:lower:]'`-`uname -m`.node


build-lib:
	rm -rf prebuilds/tdlib/
	cd td/
	mkdir -p build && cd build
ifeq ($(UNAME), Linux)
	cmake -DCMAKE_BUILD_TYPE=Release ..
endif
ifeq ($(UNAME), Darwin)
	cmake -DCMAKE_BUILD_TYPE=Release \
	-DOPENSSL_ROOT_DIR=/opt/homebrew/opt/openssl@1.1 \
  -DZLIB_INCLUDE_DIR=/opt/homebrew/opt/zlib/include \
  -DZLIB_LIBRARY=/opt/homebrew/opt/zlib/lib/libz.a \
  -DOPENSSL_USE_STATIC_LIBS=TRUE -DZLIB_USE_STATIC_LIBS=TRUE \
  ..
endif
	cmake --build . --target tdjson -- -j 3
	cd ..
	otool -L build/libtdjson.dylib
	cd ..
	mkdir -p prebuilds/tdlib/
	cp td/build/libtdjson.dylib prebuilds/tdlib/`uname -s | tr '[:upper:]' '[:lower:]'`-`uname -m`.dylib
	npm pack --dry-run
