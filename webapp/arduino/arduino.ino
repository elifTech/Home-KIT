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
byte server[] = { 192, 168, 0, 62 };
bool redState = false;
bool greenState = false;
bool yellowState = false;

void mqttCallback(char* topic, byte* payload, unsigned int length) {
    Serial.println("Received from Raspberry");
  DynamicJsonBuffer jsonBuffer; // create jsno buffer
  JsonArray& list = jsonBuffer.parseArray(decode(payload)); //parse jsno array of leds
    Serial.println(list.size());
  for (int i = 0; i < list.size(); i++) {
    //JsonObject& element = list[i]["sensor"];
    char* color = list[i]["name"];
    int state = list[i]["value"];
    setLight(color, state);
    Serial.println(color); // set state of led
    Serial.println(state);
  }

}

void setLight(char* color, int state) {
    Serial.print(color);
  if (String(color) == "green") {
    if (state == 1) {
      greenState = true;
      digitalWrite(GREEN, HIGH);
    } else {
      greenState = false;
      digitalWrite(GREEN, LOW);
    }
  } else if (String(color) == "red") {
    if (state == 1) {
      redState = true;
      digitalWrite(RED, HIGH);
    } else {
      redState = false;
      digitalWrite(RED, LOW);
    }
  } else if (String(color) == "yellow") {
    if (state == 1) {
      yellowState = true;
      digitalWrite(YELLOW, HIGH);
    } else {
      yellowState = false;
      digitalWrite(YELLOW, LOW);
    }
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

   StaticJsonBuffer<200> jsonBuffer;
      JsonObject& root = jsonBuffer.createObject();
      root["red"] = redState;
      root["green"] = greenState;
      root["yellow"] = yellowState;

      char buffer[256];
      root.printTo(buffer, sizeof(buffer));

      client.publish("lights/report", encode(buffer));
   
//   strcpy(report, "{\"red\": ");
//   strcat(report, redState);
//   strcat(report, ", \"green\": ");
//   strcat(report, greenState);
//   strcat(report, ", \"yellow\": ");
//   strcat(report, yellowState);
//   strcat(report, "}");
  // client.publish("lights/report", encode(report));
   Serial.println("Sent");
}

void setup() {
    Serial.begin(9600); 
    startEthernet();
    startMqtt();
    client.subscribe("lights/change");
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
