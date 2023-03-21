curl -sL https://github.com/nodejs/node-gyp/raw/main/macOS_Catalina_acid_test.sh | bash
xcode-select --install
npm install -g node-gyp
npm install n8n -g