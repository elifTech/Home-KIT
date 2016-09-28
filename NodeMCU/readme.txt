Connect NodeMCU  / Arduino IDE
Run command :
esptool.py --port /dev/cu.wchusbserial1410  write_flash -fm dio -fs 32m 0x00000 node-flash.bin
Install Arduino IDE
Go to Sketch - > Add Library add link to  manager's URL : http://arduino.esp8266.com/stable/package_esp8266com_index.json
Go to Tools - > Board - > Board's Manager -> find esp8266 and add it
Go to Tools -> Board - > esp8266
Go to Tools -> Port and choose right port
open project and run it


Install luatool / Luatool
go to luatoll
run in console ./luatool.py --port /dev/cu.wchusbserial1410 --src init.lua --dest init.lua --verbose
and
./luatool.py --port /dev/cu.wchusbserial1410 --src main.lua --dest main.lua --baud 9600

open nodemcu in console
run node.restart()
