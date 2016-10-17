INSTRUCTION

This repository contains a test project, the main aim of which is to demonstrate, how to build "smart-home" system from scratch,
using such technologies and devices:
-Arduino
-Pir-sensor
-RaspberryPi
-AWS
-NodeJS

First of all, you need to prepare your working space by installation of necessary software.

1.You need Arduino IDE, to make arduino run the code you write.
You can use following link to download it:
https://www.arduino.cc/en/Main/Software

2.You also need NodeJS to be installed on your RaspberryPi device.
You can find files to dowload and installation tutorial on it`s official site:
https://nodejs.org

3.To be allowed to write JavaScript applications which access the AWS IoT Platform via MQTT or MQTT over the Secure WebSocket Protocol,
you have to install AWS IoT SDK for JavaScript.
https://github.com/aws/aws-iot-device-sdk-js
You also can find a lot of usefull examples on the page of this repository.

4.Install MQTT broker on your RaspberryPi, we use Mosquitto in our project. Here is a good tutorial how to install and test it:
http://www.switchdoc.com/2016/02/tutorial-installing-and-testing-mosquitto-mqtt-on-raspberry-pi/

5.A better part of configuration work will be done on AWS, so you need to have account.

The project is made to provide simple functionality. There are such things connected to arduino microcontroller: pir-sensor , green led, red led.
The project general work flow is next:
Pir-sensor, connected to arduino microcontroller, detects motion and emits event on mqtt topic-MQTT client running on NodeJs is subscribed on the topic
and 

There are several steps to put this stuff working together:
1.Upload the code on arduino

2.Run the MQTT server with command:
sudo mosquitto start

3.
