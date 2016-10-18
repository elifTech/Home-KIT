INSTRUCTION

This repository contains a test project, the main aim of which is to demonstrate, how to build "smart-home" system from scratch,
using such technologies and devices:
-Arduino
-Pir-sensor1.Add library arduino_uip-master and ArduinoJson
2.Run project (sketch...)
3.Compile
-RaspberryPi
-AWS
-NodeJS

First of all, you need to prepare your working space by necessary software installation .

1.You need Arduino IDE, to make arduino run the code you write.
You can use following link to download it:
https://www.arduino.cc/en/Main/Software

2.You also need NodeJS to be installed on your RaspberryPi device.
You can find files to download and installation tutorial on it`s official site:
https://nodejs.org

3.To be allowed to write JavaScript applications which access the AWS IoT Platform via MQTT or MQTT over the Secure WebSocket Protocol,
you have to install AWS IoT SDK for JavaScript.
https://github.com/aws/aws-iot-device-sdk-js
You also can find a lot of usefull examples on the page of this repository.

4.Install MQTT broker on your RaspberryPi, we use Mosquitto in our project. Here is a good tutorial how to install and test it:
http://www.switchdoc.com/2016/02/tutorial-installing-and-testing-mosquitto-mqtt-on-raspberry-pi/

5.A better part of configuration work will be done on AWS, so you need an AWS account.

The project provides simple functionality. We have Pir-Sensor , Green-Led and Red-Led connected to arduino microcontroller.

The system has next workflow:
<p align="center">
  <img src="images/workflow.png"/>
</p>
Pir-sensor, connected to the arduino microcontroller, detects motion and emits event on mqtt topic 'sensor/motion'. MQTT client running on NodeJs is subscribed to 'sensor/motion' topic , when event from sensor is recieved it updates Pir-Sensor shadow state on Amazon. There is a rule on AWS IOT binded to Pir-Sensor shadow updating
event, this rule calls AWS Lambda function, this function changes lights shadow state on Amazon. There is another MQTT client on NodeJs, which is notified about lights shadow updating

There are several steps to put this stuff working together:
1.Upload the code on arduino

2.Run the MQTT server with command:
sudo mosquitto start

3.
