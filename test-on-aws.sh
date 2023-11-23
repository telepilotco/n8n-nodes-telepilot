# x64


sudo apt-get install make python3 gcc g++ -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

nvm install 18.16.1
nvm use 18.16.1
npm install -g pnpm


sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
sudo service docker start
sudo docker run hello-world


git clone https://github.com/n8n-io/n8n
cd n8n/docker/images/n8n/
vim Dockerfile && screen
## add RUN npm config set registry http://0.0.0.0:4873/ to Dockerfile

sudo docker build -f Dockerfile -t n8n-alpine --build-arg="N8N_VERSION=1.4.0" .
sudo        docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
Ctrl+a d

npm config set registry http://0.0.0.0:4873/
npm login


cd ~ && git clone https://github.com/telepilotco/tdlib-binaries-prebuilt
cd tdlib-binaries-prebuilt
npm run build
npm publish
cd ..
cd ~ && git clone https://github.com/telepilotco/tdlib-addon-prebuilt
cd tdlib-addon-prebuilt
npm install babel
npm run build
npm publish
cd ..
git clone https://github.com/telepilotco/n8n-nodes-telepilot
cd n8n-nodes-telepilot
git checkout temp-node-gyp
pnpm install
npm publish

cd ~
mkdir n8n-alpine
cd n8n-alpine/
mkdir data
sudo docker run -it --rm \
	--name n8n_alpine \
	-p 5678:5678 \
	-v ./data:/home/node/.n8n \
	-e DEBUG=tdl,telepilot-cred,telepilot-node,telepilot-trigger,telepilot-cm \
	-e EXECUTIONS_PROCESS=main \
	-e N8N_LOG_LEVEL=debug \
	--net="host" \
	n8n-alpine



## Ubuntu
mkdir ~/n8n-ubuntu
cd ~/n8n-ubuntu

wget https://cloudron.io/cloudron-setup
chmod +x ./cloudron-setup
sudo ./cloudron-setup

