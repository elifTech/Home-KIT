#include <Thread.h>
#include <ThreadController.h>
#include <Keypad.h>
#include "DHT.h";
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
Thread keypadThread = Thread();
Thread gasThread = Thread();
Thread photoThread = Thread();

const int gasPin = A0;
const int photocellPin = A1;
const byte numRows = 4; //number of rows on the keypad
const byte numCols = 4; //number of columns on the keypad

byte mac[]    = {  0x00, 0x01, 0x02, 0x03, 0x04, 0x05D };
byte server[] = { 169, 254, 66, 228 };
bool redState = false;
bool greenState = false;
bool yellowState = false;

char keymap[numRows][numCols] =
{
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

//Code that shows the the keypad connections to the arduino terminals
byte rowPins[numRows] = {9, 8, 7, 6}; //Rows 0 to 3
byte colPins[numCols] = {5, 4, 3, 2}; //Columns 0 to 3

//initializes an instance of the Keypad class
Keypad myKeypad = Keypad(makeKeymap(keymap), rowPins, colPins, numRows, numCols);

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
  Serial.println("Connecting to MQTT server");
  if (!client.connected()) {
    while (!client.connected()) {
      client.connect("arduino");
  Serial.print(".");
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
   Serial.println("Sent");
}

String pressedKeys = "";

void keypadCallback() {
  char keypressed = myKeypad.getKey();
  if (keypressed != NO_KEY)
  {
    if (keypressed == '#') {
      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& root = jsonBuffer.createObject();
      root["password"] = pressedKeys;

      pressedKeys = "";

      char buffer[256];
      root.printTo(buffer, sizeof(buffer));

      client.publish("room/lock", encode(buffer));
      Serial.println("password send");

    } else if (keypressed == '*') {
      Serial.println("reset pressed keys");
      pressedKeys = "";
    } else {
      pressedKeys += keypressed;
      //Serial.print(keypressed);
      Serial.println(pressedKeys);
    }
  }
}

void gasCallback() {
    StaticJsonBuffer<200> jsonBuffer;
  int gasSensorReading = analogRead(gasPin);
  JsonObject& root = jsonBuffer.createObject();
  root["value"] = gasSensorReading;
  char buffer[256];
  root.printTo(buffer, sizeof(buffer));

  client.publish("room/gas", encode(buffer));

  root.printTo(Serial);
  Serial.println();
}

void photoCallback() {
    StaticJsonBuffer<200> jsonBuffer;
  int photocellReading = analogRead(photocellPin);
  JsonObject& root = jsonBuffer.createObject();
  root["value"] = photocellReading;
  char buffer[256];
  root.printTo(buffer, sizeof(buffer));

  client.publish("room/photo", encode(buffer));

  root.printTo(Serial);
  Serial.println();
}

void setup() {
    Serial.begin(9600); 
    startEthernet();
    startMqtt();
    client.subscribe("lights/change");
    
    thingThread.onRun(thingCallback);
    thingThread.setInterval(5000);

    keypadThread.onRun(keypadCallback);
    keypadThread.setInterval(0);

    gasThread.onRun(gasCallback);
    gasThread.setInterval(5000);

    photoThread.onRun(photoCallback);
    photoThread.setInterval(5000);

    controll.add(&thingThread); 
    controll.add(&keypadThread);   
    controll.add(&gasThread);   
    controll.add(&photoThread);   
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
