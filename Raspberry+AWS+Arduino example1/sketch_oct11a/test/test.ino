#include <Thread.h>
#include <ThreadController.h>
#include "ArduinoJson.h";
#include "UIPEthernet.h"
#include "PubSubClient.h"
#include "./encrypt.h"

//define pins
#define GREEN 12
#define RED 11
#define YELLOW 10
#define pirPin  31

//define ethernet and mqqt client
EthernetClient ethClient;
PubSubClient client;

// ThreadController that will controll all threads
ThreadController controll = ThreadController();
Thread thingThread = Thread();

byte mac[]    = {  0x00, 0x01, 0x02, 0x03, 0x04, 0x05D };
byte server[] = { 192, 168, 0, 70 };

void mqttCallback(char* topic, byte* payload, unsigned int length) {
   
    digitalWrite(RED, LOW);
    digitalWrite(GREEN, HIGH);
    Serial.println("Door&");
   // Serial.println(decode(payload));
  DynamicJsonBuffer jsonBuffer; // create jsno buffer
  JsonArray& list = jsonBuffer.parseArray(decode(payload)); //parse jsno array of leds
    Serial.println(list.size());
  for (int i = 0; i < list.size(); i++) {
    //JsonObject& element = list[i]["sensor"];
    char* sensor = list[i]["name"];
    int state = list[i]["value"];
      Serial.println(sensor); // set state of led
      Serial.println(state);
  }

}

void startEthernet() {
  Serial.println("start");
  Ethernet.begin(mac); //start ethernet
} 

void startMqtt() {
  client.setClient(ethClient); //set client for mqqt (ethernet)
  client.setServer(server, 1883); // set server for mqqt(raspberry)
  client.setCallback(mqttCallback); // set callback for subscripting

  client.connect("arduino"); //connect as arduino
  if (!client.connected()) {
    while (!client.connected()) {
      Serial.print(".");
      client.connect("arduino");
    }
  }
  Serial.println("Connected to MQTT server");
}

void thingCallback() {
  char* yo = encode("pizda");
  Serial.println(yo);
    client.publish("sensor/motion", yo);
    //free(&yo);
//   char* yo = encode(String("dvizt"));
//    Serial.println(yo);
 //   Serial.println(decode(yo));
   Serial.println("Sent");
    digitalWrite(RED, HIGH);
    digitalWrite(GREEN, LOW);
}

void setup() {
    Serial.begin(9600); 
    startEthernet();
    startMqtt();
    client.subscribe("changes/new");
    thingThread.onRun(thingCallback);
    thingThread.setInterval(5000);
    controll.add(&thingThread);
}

void loop() {
  controll.run();
   // client.subscribe("changes");
  if (!client.connected())
  {
    // clientID, username, MD5 encoded password
    client.connect("arduino");
    client.subscribe("changes/new");
    client.loop();
  }

  // MQTT client loop processing
  client.loop();

}
