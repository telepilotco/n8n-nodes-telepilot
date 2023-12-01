cd ~/n8n-nodes-telepilot/deploy/n8n-dockerfile-installation
cp ~/.npmrc . && chmod 777 .npmrc
sudo docker build . --network=host --no-cache -t n8n-alpine-dockerfile-installation --progress=plain
