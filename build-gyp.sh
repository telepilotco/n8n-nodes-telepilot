rm -rf build/
node-gyp rebuild
cp build/Release/bridge.node prebuilds/tdlib-bridge-arm64/bridge.node
