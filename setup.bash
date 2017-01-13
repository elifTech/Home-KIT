#!/bin/bash

sudo apt install git
git clone git@github.com:dev1lmini/Home-KIT.git
wget https://nodejs.org/dist/v6.9.4/node-v6.9.4-linux-x64.tar.xz
tar -xvf node-v6.9.4-linux-x64.tar.xz
sudo cp -r node-v6.9.4-linux-x64/lib /usr/local
sudo cp -r node-v6.9.4-linux-x64/bin /usr/bin
sudo cp -r node-v6.9.4-linux-x64/share /usr/share
sudo npm install pm2@latest -g
cd Home-KIT/webapp/raspberry
npm i
pm2 index.js
cd ~
cp Home-Kit/run.bash .config/upstart