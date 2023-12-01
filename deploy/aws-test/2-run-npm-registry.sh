DIR=/home/ubuntu/n8n-nodes-telepilot/deploy; sudo chmod -R 777 $DIR/verdaccio/; screen -S verdaccio -dm bash -c "sudo docker run -it --rm --name verdaccio -v $DIR/verdaccio/storage:/verdaccio/storage -v $DIR/verdaccio/conf:/verdaccio/conf -p 4873:4873 verdaccio/verdaccio"

npm config set registry http://0.0.0.0:4873/
npm login
