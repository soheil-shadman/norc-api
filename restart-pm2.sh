#!/bin/bash
sudo pm2 stop lms-lingo-kido-api
sudo rm -rf dist/
sudo npm run build
sudo pm2 start dist/index.js --name lms-lingo-kido-api