sudo docker run -it --rm \
	--name n8n-alpine-dockerfile-installation \
	-p 5678:5678 \
	-e DEBUG=tdl,telepilot-cred,telepilot-node,telepilot-trigger,telepilot-cm \
	-e EXECUTIONS_PROCESS=main \
	-e N8N_LOG_LEVEL=debug \
	--net="host" \
	n8n-alpine-dockerfile-installation
