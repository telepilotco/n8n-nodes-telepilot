FROM n8nio/n8n:1.21.0
ARG KEY
# USER root
# RUN apk add --update python3 py3-pip make npm
RUN ls -la /home/
RUN ls -la /home/node/
RUN npm config set registry http://npm.telepilot.co:4873/
COPY .npmrc /home/node/.npmrc

COPY ../test-n8n-imports/workflows/Telepilot_getMe.json /home/node/Telepilot_getMe.json
COPY ../test-n8n-imports/credentials/credential-dummy.json /home/node/credential-dummy.json

RUN cat /home/node/.npmrc

RUN cd ~/.n8n/ && mkdir nodes && cd nodes && \
    npm pack @telepilotco/n8n-nodes-telepilot@0.2.0-22 && \
    npm install telepilotco-n8n-nodes-telepilot-0.2.0-22.tgz

#RUN cd ~/.n8n/ && mkdir nodes && cd nodes && npm install @telepilotco/tdl@7.4.0
#RUN ls -la ~/.n8n/nodes/

RUN cat /docker-entrypoint.sh
#RUN #cat /home/node/.n8n/config

RUN N8N_ENCRYPTION_KEY=$KEY n8n import:credentials -i /home/node/credential-dummy.json
RUN n8n import:workflow -i /home/node/Telepilot_getMe.json
RUN cat /home/node/.n8n/config

#RUN sh /docker-entrypoint.sh execute --id 59daebf5-fd8d-4264-ae16-095923dd0eaf
# USER node
ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]
