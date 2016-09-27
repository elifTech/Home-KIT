Connect NodeMCU
Run command :
esptool.py --port /dev/cu.wchusbserial1410  write_flash -fm dio -fs 32m 0x00000 node-flash.bin
Install Arduino IDE
Go to Sketch - > Add Library add link to  manager's URL : http://arduino.esp8266.com/stable/package_esp8266com_index.json
Go to Tools - > Board - > Board's Manager -> find esp8266 and add it
Go to Tools -> Board - > esp8266
Go to Tools -> Port and choose right port
open project and run it
