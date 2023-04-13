rm -rf dist/
pnpm run build
npm link

cd ~/.n8n/
mkdir -p nodes && cd nodes
npm link n8n-nodes-tdlib

DEBUG=tdl,tdl-cred EXECUTIONS_PROCESS=main n8n start
