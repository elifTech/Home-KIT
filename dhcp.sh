#!/usr/bin/env bash

#sudo sed -i '$ a interface eth0\n\nstatic ip_address=169.254.66.228\nstatic routers=192.168.0.2\nstatic domain_name_servers=192.168.0.1' /etc/dhcpcd.conf
#sudo apt install isc-dhcp-server
#sudo sed -i '$ a subnet 169.254.66.0 netmask 255.255.255.0 {\n        range 169.254.66.229 169.254.66.254;\n                option subnet-mask              255.255.255.0;\n                option broadcast-address        169.254.66.255;\n                option routers                  169.254.66.228;\n                option domain-name              "vsem-ziga.yo";\n                option domain-name-servers      169.254.66.228;\n        default-lease-time 21600;\n        max-lease-time 43200;\n        option time-offset -18000;\n}' /etc/dhcp/dhcpd.conf
#sudo sed -i '$ a auto eth0\niface eth0 inet dhcp\n  gateway 192.168.0.2'  /etc/network/interfaces
echo '# interfaces(5) file used by ifup(8) and ifdown(8)\n\n# Please note that this file is written to be used with dhcpcd\n# For static IP, consult /etc/dhcpcd.conf and 'man dhcpcd.conf'\n\n# Include files from /etc/network/interfaces.d:\nsource-directory /etc/network/interfaces.d\n\n#auto lo\niface lo inet loopback\n\nauto wlan0\nallow-hotplug wlan0\niface wlan0 inet manual\n    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf\n#allow-hotplug wlan1\n#iface wlan1 inet manual\n#    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf\niface eth0 inet static\n        address 169.254.66.228\n        netmask 255.255.255.0' > interfaces
sudo rm /etc/network/interfaces
sudo mv interfaces /etc/network
sudo /etc/init.d/networking restart