<h2>INSTRUCTION</h2>

<p>This repository contains a test project, the main aim of which is to demonstrate, how to build "smart-home" system from scratch,
using such technologies and devices:</p>
<ul>
<li>RaspberryPi</li>
<li>Arduino</li>
<li>Pir Sensor</li>
<li>AWS</li>
<li>NodeJS</li>
</ul>

<h3>First of all, you need to prepare your working space by necessary software installation</h3>
<ol>
<li>You need Arduino IDE, to make arduino run the code you write.
You can use following link to download it:
https://www.arduino.cc/en/Main/Software

<li>You also need NodeJS to be installed on your RaspberryPi device.
You can find files to download and installation tutorial on it`s official site:
https://nodejs.org</li>

<li>To be allowed to write JavaScript applications which access the AWS IoT Platform via MQTT or MQTT over the Secure WebSocket Protocol,
you have to install AWS IoT SDK for JavaScript.
https://github.com/aws/aws-iot-device-sdk-js
You also can find a lot of usefull examples on the page of this repository.</li>

<li>Install MQTT broker on your RaspberryPi, we use Mosquitto in our project. Here is a good tutorial how to install and test it:
http://www.switchdoc.com/2016/02/tutorial-installing-and-testing-mosquitto-mqtt-on-raspberry-pi/</li>

<li>A better part of configuration work will be done on AWS, so you need an AWS account.</li>

<ol>
<h3>Workflow</h3>
<p>The project provides simple functionality. We have Pir Sensor , Green Led and Red Led connected to arduino microcontroller. And our aim is to light Red Led if there is any motion detected, otherwise Green Led should be lighted</p>
<p align="center">
  <img src="images/workflow-diagram.png"/>
</p>
<p>Pir-sensor, connected to the arduino microcontroller, detects motion and emits event on mqtt topic 'sensor/motion'. MQTT client running on NodeJs is subscribed to 'sensor/motion' topic , when the event from sensor is recieved it updates Pir-Sensor shadow state on Amazon. There is a rule on AWS IOT binded to Pir-Sensor shadow updating, this rule calls AWS Lambda function, which changes lights shadow state on Amazon. When above change is done, we get event on RaspberryPi, and then update the leds state on arduino.</p>

<h3>There are several steps to put this stuff working together</h3>
<ol>
	<li>Upload the code on arduino
		<ol>
		 <li> Add library arduino_uip-master and ArduinoJson</li>
		 <li>Run project (sketch...)</li>
		 <li>Compile</li>
		 <li>Press upload button</li>
		<ol>
	</li>
	<li>Run the MQTT server with command:
	<code>sudo mosquitto start</code></li>
<ol>
