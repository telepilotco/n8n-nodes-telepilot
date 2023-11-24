# on sshde1:
screen -S verdaccio -dm bash -c "mkdir -p /tmp/storage && sudo chmod 777 /tmp/storage && sudo docker run -it --rm --name verdaccio -v /tmp/storage:/verdaccio/storage -p 4873:4873 verdaccio/verdaccio"

sudo apt-get install make python3 gcc g++ -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc
nvm install 18.16.1
nvm use 18.16.1
npm install -g pnpm


npm config set registry http://npm.telepilot.co:4873/
npm login


GH_TOKEN="t.b.d."
cd ~ && git clone https://$GH_TOKEN@github.com/telepilotco/tdlib-binaries-prebuilt
cd tdlib-binaries-prebuilt
#npm run build
npm publish
cd ..
cd ~ && git clone https://$GH_TOKEN@github.com/telepilotco/tdlib-addon-prebuilt
cd tdlib-addon-prebuilt
npm install babel
# npm install --save-dev babel-cli ( on arm64 box???)
npm run build
npm publish
cd ..
git clone https://$GH_TOKEN@github.com/telepilotco/n8n-nodes-telepilot
cd n8n-nodes-telepilot
#git checkout temp-node-gyp
npm install #pnpm install
npm publish
cd ~


