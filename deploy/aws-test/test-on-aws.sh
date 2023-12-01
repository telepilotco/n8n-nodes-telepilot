# x64
sudo apt-get install make python3 gcc g++ -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc
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
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose docker-compose-plugin -y
sudo service docker start
sudo docker run hello-world

git clone https://github.com/n8n-io/n8n
cd n8n/docker/images/n8n/
#vim Dockerfile && screen
## add "RUN npm config set registry http://0.0.0.0:4873/" to Dockerfile

#screen -S verdaccio -dm bash -c "sudo docker run -it --rm --name verdaccio -v `pwd`/verdaccio/storage:/verdaccio/storage -v `pwd`/verdaccio/conf:/verdaccio/conf -p 4873:4873 verdaccio/verdaccio"

#sudo docker build -f Dockerfile -t n8n-alpine --build-arg="N8N_VERSION=1.4.0" .
sudo  docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
Ctrl+a d

npm config set registry http://npm.telepilot.co:4873/
npm config set registry http://0.0.0.0:4873/
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
cd ~/n8n-nodes-telepilot
#cd deploy
#screen -S verdaccio -dm bash -c "sudo docker run -it --rm --name verdaccio -v `pwd`/verdaccio/storage:/verdaccio/storage -v `pwd`/verdaccio/config.yaml:/verdaccio/conf/config.yaml -p 4873:4873 verdaccio/verdaccio"
#cd ..
#git checkout temp-node-gyp
npm install #pnpm install
npm publish
cd ~

## n8n-alpine (musl)
## needs to be fresh ubuntu box
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
	cd ~

## run `npm config set registry http://0.0.0.0:4873/` in n8n workflow



## n8n-ubuntu (glibc)
cd ~
mkdir ~/n8n-ubuntu
cd ~/n8n-ubuntu
N8N_HOST=0.0.0.0 N8N_PORT=5678 npx n8n

#wget https://cloudron.io/cloudron-setup
#chmod +x ./cloudron-setup
#sudo ./cloudron-setup

### need to setup DNS name, log in into Cloudron account: smoge.00@gmail.com/G..123



## Testing installation inside the Dockerfile image:
cd ~ && mkdir n8n-dockerfile-installation && cd n8n-dockerfile-installation/
cat > Dockerfile << EOL
FROM n8nio/n8n:latest
# USER root
# RUN apk add --update python3 py3-pip make npm
RUN ls -la /home/
RUN ls -la /home/node/
RUN npm config set registry http://0.0.0.0:4873/
RUN cd ~/.n8n/ && mkdir nodes && cd nodes && npm install @telepilotco/n8n-nodes-telepilot
RUN ls -la ~/.n8n/nodes/
# USER node
ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]
EOL

sudo docker build . --network=host --no-cache -t n8n-alpine-dockerfile-installation --progress=plain
mkdir data
sudo docker run -it --rm \
	--name n8n-alpine-dockerfile-installation \
	-p 5678:5678 \
	-v ./data:/home/node/.n8n \
	-e DEBUG=tdl,telepilot-cred,telepilot-node,telepilot-trigger,telepilot-cm \
	-e EXECUTIONS_PROCESS=main \
	-e N8N_LOG_LEVEL=debug \
	--net="host" \
	n8n-alpine-dockerfile-installation
	cd ~

##

