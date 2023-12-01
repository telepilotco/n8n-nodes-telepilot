cd ~/tdlib-binaries-prebuilt
npm publish

cd ~/tdlib-addon-prebuilt
npm install babel
# npm install --save-dev babel-cli ( on arm64 box???)
npm run build
npm publish

cd ~/n8n-nodes-telepilot
npm install #pnpm install
npm publish
cd ~
