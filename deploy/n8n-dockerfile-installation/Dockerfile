FROM n8nio/n8n:1.19.3
# USER root
# RUN apk add --update python3 py3-pip make npm
RUN ls -la /home/
RUN ls -la /home/node/
#RUN npm config set registry http://npm.telepilot.co:4873/
#COPY .npmrc /home/node/.npmrc
#RUN cat /home/node/.npmrc
RUN cd ~/.n8n/ && mkdir nodes && cd nodes && npm install @telepilotco/n8n-nodes-telepilot
RUN ls -la ~/.n8n/nodes/
# USER node
ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]
