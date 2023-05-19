#npm install -g node-gyp
#pnpm install


rm -rf build/
node-gyp rebuild
mkdir -p prebuilds/tdlib-bridge/
cp build/Release/bridge.node prebuilds/tdlib-bridge/`uname -s | tr '[:upper:]' '[:lower:]'`-`uname -m`.node


rm -rf build/
cd td/
git pull

brew install gperf openssl zlib
#sudo apt-get install install gperf openssl zlib
cmake --version

mkdir -p build && cd build
cmake -DCMAKE_BUILD_TYPE=Release \
-DOPENSSL_ROOT_DIR=/opt/homebrew/opt/openssl@1.1 \
-DZLIB_INCLUDE_DIR=/opt/homebrew/opt/zlib/include \
-DZLIB_LIBRARY=/opt/homebrew/opt/zlib/lib/libz.a \
-DOPENSSL_USE_STATIC_LIBS=TRUE -DZLIB_USE_STATIC_LIBS=TRUE ..
cmake --build . --target tdjson -- -j 3
cd ..

uname -a
/opt/homebrew/opt/openssl@1.1/bin/openssl version
otool -L build/libtdjson.dylib

mkdir -p prebuilds/tdlib/
cp build/libtdjson.dylib prebuilds/tdlib/`uname -s | tr '[:upper:]' '[:lower:]'`-`uname -m`.node

