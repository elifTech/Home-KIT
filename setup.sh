#!/bin/bash

sudo apt install git -y
git clone https://github.com/dev1lmini/Home-KIT.git
wget https://nodejs.org/dist/v7.4.0/node-v7.4.0-linux-armv7l.tar.xz
tar -xvf node-v7.4.0-linux-armv7l.tar.xz
sudo cp -r node-v7.4.0-linux-armv7l/lib /usr/local
sudo cp -r node-v7.4.0-linux-armv7l/bin /usr/local
sudo cp -r node-v7.4.0-linux-armv7l/share /usr/local
sudo npm install pm2@latest -g
cd Home-KIT/webapp/raspberryp
npm i
pm2 index.js
echo 'pm2 /home/pi/Home-KIT/webapp/raspberry/index.js' > pi
sudo mv pi /var/spool/cron/crontabs/