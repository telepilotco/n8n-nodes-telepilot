#npm install -g node-gyp
#pnpm install


rm -rf build/
rm -rf prebuilds/tdlib-bridge/
node-gyp rebuild
mkdir -p prebuilds/tdlib-bridge/
cp build/Release/bridge.node prebuilds/tdlib-bridge/`uname -s | tr '[:upper:]' '[:lower:]'`-`uname -m`.node


rm -rf build/

rm -rf prebuilds/tdlib/
cd td/
git pull

brew install gperf openssl zlib #macos-only

#see https://tdlib.github.io/td/build.html?language=JavaScript
#sudo sudo apt-get install make git zlib1g-dev libssl-dev gperf php-cli cmake g++ -y
cmake --version

mkdir -p build && cd build
cmake -DCMAKE_BUILD_TYPE=Release \
#-DOPENSSL_ROOT_DIR=/opt/homebrew/opt/openssl@1.1 \ macos-only
#-DZLIB_INCLUDE_DIR=/opt/homebrew/opt/zlib/include \ macos-only
#-DZLIB_LIBRARY=/opt/homebrew/opt/zlib/lib/libz.a \ macos-only
#-DOPENSSL_USE_STATIC_LIBS=TRUE -DZLIB_USE_STATIC_LIBS=TRUE \ macos-only
..
cmake --build . --target tdjson -- -j 3
cd ..

uname -a
/opt/homebrew/opt/openssl@1.1/bin/openssl version
otool -L build/libtdjson.dylib

cd ..
mkdir -p prebuilds/tdlib/
cp td/build/libtdjson.dylib prebuilds/tdlib/`uname -s | tr '[:upper:]' '[:lower:]'`-`uname -m`.dylib

npm pack --dry-run
