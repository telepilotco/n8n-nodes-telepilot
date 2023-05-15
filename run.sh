rm -rf dist/
pnpm run build
npm link

cd ~/.n8n/
mkdir -p nodes && cd nodes
npm link n8n-nodes-tdlib

DEBUG=tdl,tdl-cred,tdl-node,tdl-trigger,tdl-cm EXECUTIONS_PROCESS=main n8n start
