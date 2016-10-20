
//including library

#include "ArduinoJson.h";
#include "UIPEthernet.h"
#include "PubSubClient.h"
#include "./encrypt.h"
//define pins
#define GREEN 4
#define RED 5
#define YELLOW 6
#define pirPin  31
//define timer
unsigned long startTimer;
unsigned long Timer = 10000;
bool busy = false;//end timer
bool movement = false;//define moves
//define ethernet and mqqt client
EthernetClient ethClient;
PubSubClient client;

//define params for ethernet and mqtt
byte mac[]    = {  0x00, 0x01, 0x02, 0x03, 0x04, 0x05D };
byte server[] = { 192, 168, 0, 33 };
byte ip[]     = { 192, 168, 0, 37 };


//initial sensor
void setSensor() {
  pinMode(pirPin, INPUT); //set pin for sensor
  int calibrationTime = 10; //time for calibration
  Serial.print("calibrating sensor ");
  for (int i = 0; i < calibrationTime; i++) { //calibrating sensor
    Serial.print(".");
    delay(1000);
  }
  Serial.println(" done");
  Serial.println("SENSOR ACTIVE");
  delay(50);
}


//send movement to raspberry by mqtt
void sendMovement() {
  if (millis() - startTimer >= Timer) { //check if timer end
    busy = false; // set state of timer
    if (digitalRead(pirPin) == HIGH) { //read value from sensor, if is high
      Serial.print("motion detected");
      if (!busy) { // check if timer is busy
        busy = true; // set to busy timer
        startTimer = millis(); // set initial time
      }
      client.publish("sensor/motion", encode(String("{\"motions\":1}")).c_str()); // send data to raspberry
      movement = true; // set is movement
    } else { // if value from sensor is low
      if (movement) { // if was movement
        if (!busy) { //check if timer is busy
          busy = true; // set to busy timer
          startTimer = millis(); // set initial time
        }
        client.publish("sensor/motion", encode(String("{\"motions\":0}")).c_str()); movement = false; //send movement is end
      }
    }
  }
}


//set state of led
void setState(char* sensor, int state) {
  if (strcmp(sensor, "green") == 0) {
    analogWrite(GREEN, state); //set for green value from state
  }
  if (strcmp(sensor, "red") == 0) {
    analogWrite(RED, state);
  }
  if (strcmp(sensor, "yellow") == 0) {
    analogWrite(YELLOW, state);
  }
}


// Callback function
void callback(char* topic, byte* payload, unsigned int length) {
  DynamicJsonBuffer jsonBuffer; // create jsno buffer
  JsonArray& list = jsonBuffer.parseArray(decode(payload)); //parse jsno array of leds
  for (int i = 0; i < list.size(); i++) {
    JsonObject& element = list[i]["sensor"];
    char* sensor = element["name"];
    int state = element["value"];
    setState(sensor, state); // set state of led
  }

}



void startEthernet() {
  Serial.println("start");
  Ethernet.begin(mac); //start ethernet
}

void startMqtt() {
  client.setClient(ethClient); //set client for mqqt (ethernet)
  client.setServer(server, 1883); // set server for mqqt(raspberry)
  client.setCallback(callback); // set callback for subscripting

  client.connect("arduino"); //connect as arduino
  if (!client.connected()) {
    while (!client.connected()) {
      Serial.print(".");
      client.connect("arduino");
    }
  }
  Serial.println("Connected to MQTT server");
}

void subscripting() {
   client.subscribe("leds/status"); //subscribe to led
}

void getStatus() {
  client.publish("leds/get_status", "Give me my status"); //subscribe for status
}

void setup()
{
  Serial.begin(57600); //start serial
  startEthernet();
  startMqtt();
  subscripting();
  getStatus();
  setSensor();
}

void loop() {

  if (!client.connected())
  {
    // clientID, username, MD5 encoded password
    client.connect("arduino");
    subscripting();
    getStatus();
    client.loop();
  }

  // MQTT client loop processing
  client.loop();
  sendMovement();

}
