#!/bin/bash

echo '# interfaces(5) file used by ifup(8) and ifdown(8)\n\n# Please note that this file is written to be used with dhcpcd\n# For static IP, consult /etc/dhcpcd.conf and 'man dhcpcd.conf'\n\n# Include files from /etc/network/interfaces.d:\nsource-directory /etc/network/interfaces.d\n\n#auto lo\niface lo inet loopback\n\nauto wlan0\nallow-hotplug wlan0\niface wlan0 inet manual\n    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf\n#allow-hotplug wlan1\n#iface wlan1 inet manual\n#    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf\niface eth0 inet static\n        address 169.254.66.228\n        netmask 255.255.255.0' > interfaces
sudo rm /etc/network/interfaces
sudo mv interfaces /etc/network
sudo /etc/init.d/networking restart
sudo apt install git -y
git clone https://github.com/dev1lmini/Home-KIT.git
wget https://nodejs.org/dist/v7.4.0/node-v7.4.0-linux-armv7l.tar.xz
tar -xvf node-v7.4.0-linux-armv7l.tar.xz
sudo cp -r node-v7.4.0-linux-armv7l/lib /usr/local
sudo cp -r node-v7.4.0-linux-armv7l/bin /usr/local
sudo cp -r node-v7.4.0-linux-armv7l/share /usr/local
sudo npm install pm2@latest -g
sudo apt install mosquitto -y
echo 'pm2 /home/pi/Home-KIT/example3/raspberry/index.js' > pi
sudo mv pi /var/spool/cron/crontabs/
cd Home-KIT/example3/raspberry/
npm i
npm run start