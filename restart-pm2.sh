#!/bin/bash
sudo pm2 stop norc-api
sudo rm -rf dist/
sudo npm run build
sudo pm2 start dist/index.js --name norc-api