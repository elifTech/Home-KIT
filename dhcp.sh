#!/usr/bin/env bash

sudo sed -i '$ a interface eth0\n\nstatic ip_address=169.254.66.228\nstatic routers=192.168.0.2\nstatic domain_name_servers=192.168.0.1' /etc/dhcpcd.conf
sudo apt install isc-dhcp-server
sudo sed -i '$ a subnet 169.254.66.0 netmask 255.255.255.0 {\n        range 169.254.66.229 169.254.66.254;\n                option subnet-mask              255.255.255.0;\n                option broadcast-address        169.254.66.255;\n                option routers                  169.254.66.228;\n                option domain-name              "vsem-ziga.yo";\n                option domain-name-servers      169.254.66.228;\n        default-lease-time 21600;\n        max-lease-time 43200;\n        option time-offset -18000;\n}' /etc/dhcp/dhcpd.conf
sudo sed -i '$ a auto eth0\niface eth0 inet dhcp\n  gateway 192.168.0.2'  /etc/network/interfaces
sudo truncate -s 1M /var/spool/cron/crontabs/root
echo '*/30 * * * *   route add default wlan0\n@reboot   route add default wlan0' > root
sudo mv root /var/spool/cron/crontabs/
sudo /etc/init.d/networking restart