# npm install n8n -g
npm run build
npm link

cd ~/.n8n/
mkdir -p nodes && cd nodes
npm link n8n-nodes-tdlib

n8n start
