#include <Thread.h>
#include <ThreadController.h>
#include <Keypad.h>
#include "DHT.h";
#include "UIPEthernet.h";

#include "PubSubClient.h";
#include "ArduinoJson.h";

EthernetClient ethClient;
PubSubClient client;

ThreadController controll = ThreadController();
Thread lightSensorThread = Thread();
Thread pirSensorThread = Thread();
Thread temperatureSensorThread = Thread();
Thread keypadThread = Thread();

const int lightSensorPin = A0;
const int temperatureSensorPin = 30;
const int pirSensorPin = 31;

const int doorLedPin = 11;
const int alarmPin = 22;

const int curtainPin = 28;
const int keypadPin = 24;
const int conditionerPin = 26;
DHT dht(temperatureSensorPin, DHT11);

const byte numRows = 4; //number of rows on the keypad
const byte numCols = 4; //number of columns on the keypad

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

byte mac[]    = {  0x00, 0x01, 0x02, 0x03, 0x04, 0x05D };
byte server[] = { 192, 168, 0, 68 };


//the IP address is dependent on your network
// IPAddress ip(192, 168, 1, 2);

void startEthernet() {
  Serial.println("start Ethernet");
  Ethernet.begin(mac); //start ethernet
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  if (String(topic) == "alarm/change") {
    alarmHandler(payload);
  }
  if (String(topic) == "conditioner/open") {
    conditionerHandler(payload);
  }
  if (String(topic) == "curtain/open") {
    curtainHandler(payload);
  }
  if (String(topic) == "keypad/change") {
    keypadValid(payload);
  }
}

void alarmHandler(byte* payload) {
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject((char*)payload);
  bool alarm = root["value"];
  if (alarm) {
    digitalWrite(alarmPin, HIGH);
  } else {
    digitalWrite(alarmPin, LOW);
  }
}

void keypadValid(byte* payload) {
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject((char*)payload);
  bool value = root["valid"];
  
  if (value) {
    digitalWrite(keypadPin, HIGH);
    delay(2000);
    digitalWrite(keypadPin, LOW);
    
  } else {
    digitalWrite(keypadPin, HIGH);
    delay(500);
    digitalWrite(keypadPin, LOW);
    delay(200);
    digitalWrite(keypadPin, HIGH);
    delay(500);
    digitalWrite(keypadPin, LOW);
    delay(200);
    digitalWrite(keypadPin, HIGH);
    delay(500);
    digitalWrite(keypadPin, LOW);
  }
}

void conditionerHandler(byte* payload) {
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject((char*)payload);
  bool value = root["value"];
  if (value) {
    digitalWrite(conditionerPin, HIGH);
  } else {
    digitalWrite(conditionerPin, LOW);
  }
  char buffer[256];
  root.printTo(buffer, sizeof(buffer));
  client.publish("room/conditioner", buffer);
}
void curtainHandler(byte* payload) {
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject((char*)payload);
  int photocellReading = root["value"];
  digitalWrite(curtainPin, photocellReading);
  char buffer[256];
  root.printTo(buffer, sizeof(buffer));
  client.publish("room/curtain", buffer);
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
void subscripting() {
  client.subscribe("alarm/change");
  client.subscribe("conditioner/open");
  client.subscribe("curtain/open");
  client.subscribe("keypad/change");
}

int pirSensorLastState = false;

void pirSensorCallback() {
  StaticJsonBuffer<200> jsonBuffer;

  bool movement;

  if (digitalRead(pirSensorPin) == HIGH) {
    movement = true;
  } else {
    movement = false;
  }
  Serial.println(movement);
  if (movement != pirSensorLastState) {
    pirSensorLastState = movement;
    JsonObject & root = jsonBuffer.createObject();
    root["value"] = movement;
    char buffer[256];
    root.printTo(buffer, sizeof(buffer));

    client.publish("room/pir", buffer);
  }
}
String pressedKeys = "";
void keypadCallback() {
  char keypressed = myKeypad.getKey();
  if (keypressed != NO_KEY)
  {
    if (keypressed == '#') {
      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& root = jsonBuffer.createObject();
      root["value"] = pressedKeys;

      pressedKeys = "";

      char buffer[256];
      root.printTo(buffer, sizeof(buffer));

      client.publish("room/keypad", buffer);
      Serial.println("password send");
    } else if (keypressed == '*') {
      Serial.println("reset pressed keys");
      pressedKeys = "";
    } else {
      pressedKeys += keypressed;
      Serial.println(pressedKeys);
    }
  }
}
void temperatureSensorCallback() {
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["humidity"] = dht.readHumidity();
  root["temperature"] = dht.readTemperature();
  char buffer[256];
  root.printTo(buffer, sizeof(buffer));
  client.publish("room/temperature", buffer);
}
void lightSensorCallback() {
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["value"] = analogRead(lightSensorPin);
  char buffer[256];
  root.printTo(buffer, sizeof(buffer));
  client.publish("room/light", buffer);
}
void setup() {
  Serial.begin(9600);
  startEthernet();
  startMqtt();
  subscripting();

  pinMode(alarmPin, OUTPUT);
  digitalWrite(alarmPin, LOW);
  pinMode(curtainPin, OUTPUT);
  digitalWrite(curtainPin, LOW);
  pinMode(keypadPin, INPUT);
  digitalWrite(keypadPin, LOW);
  pinMode(conditionerPin, INPUT);
  digitalWrite(conditionerPin, LOW);
  
  pirSensorThread.onRun(pirSensorCallback);
  pirSensorThread.setInterval(1000);

  temperatureSensorThread.onRun(temperatureSensorCallback);
  temperatureSensorThread.setInterval(5000);

  lightSensorThread.onRun(lightSensorCallback);
  lightSensorThread.setInterval(5000);

  keypadThread.onRun(keypadCallback);
  keypadThread.setInterval(0);

  controll.add(&pirSensorThread);
  controll.add(&temperatureSensorThread);
  controll.add(&lightSensorThread);
  controll.add(&keypadThread);
}

void loop() {
  controll.run();
  if (!client.connected())
  {
    // clientID, username, MD5 encoded password
    client.connect("arduino");
    subscripting();
    client.loop();
  }
  // MQTT client loop processing
  client.loop();
}
