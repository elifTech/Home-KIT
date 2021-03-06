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
Thread gasSensorThread = Thread();
Thread pirSensorThread = Thread();
Thread temperatureSensorThread = Thread();
Thread keypadThread = Thread();
Thread securityThread = Thread();

const int lightSensorPin = A0;
const int gasSensorPin = A1;
const int temperatureSensorPin = 30;
const int pirSensorPin = 41;
const int securityInputPin = 28;

const int gasLedPin = 10;
const int doorLedPin = 11;
const int pirLedPin = 12;

const int lightLedPin = 13;

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
byte server[] = { 192, 168, 1, 1 };


//the IP address is dependent on your network
IPAddress ip(192, 168, 1, 2);

void startEthernet() {
  Serial.println("start Ethernet");
  Ethernet.begin(mac, ip); //start ethernet
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {

  if (String(topic) == "gas/change") {
    gasLedHandler(payload);
  }
  if (String(topic) == "pir/change") {
    pirLedHandler(payload);
  }
  if (String(topic) == "door/change") {
    doorLedHandler(payload);
  }
  if (String(topic) == "light/change") {
    lightLedHandler(payload);
  }
}

void gasLedHandler(byte* payload) {
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject((char*)payload);
  bool alarm = root["alarm"];
  if (alarm) {
    digitalWrite(gasLedPin, HIGH);
  } else {
    digitalWrite(gasLedPin, LOW);
  }
}

void pirLedHandler(byte* payload) {
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject((char*)payload);
  bool alarm = root["value"];
  if (alarm) {
    digitalWrite(pirLedPin, HIGH);
  } else {
    digitalWrite(pirLedPin, LOW);
  }
}

void doorLedHandler(byte* payload) {
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject((char*)payload);
  bool doorShouldBeOpen = root["open"];
  bool doorIsOpen;
  if (doorShouldBeOpen) {
    digitalWrite(doorLedPin, HIGH);
    doorIsOpen = true;
  } else {
    digitalWrite(doorLedPin, LOW);
    doorIsOpen = false;
  }
  StaticJsonBuffer<200> responseJsonBuffer;
  JsonObject& response = responseJsonBuffer.createObject();
  response["open"] = doorIsOpen;
  char buffer[256];
  root.printTo(buffer, sizeof(buffer));
  client.publish("room/door/state", buffer);
}
void lightLedHandler(byte* payload) {
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject((char*)payload);
  int photocellReading = root["value"];
  analogWrite(lightLedPin, photocellReading);
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
  client.subscribe("gas/change");
  client.subscribe("light/change");
  client.subscribe("door/change");
  client.subscribe("pir/change");
}
void gasSensorCallback() {
  StaticJsonBuffer<200> jsonBuffer;
  int gasSensorReading = analogRead(gasSensorPin);
  JsonObject& root = jsonBuffer.createObject();
  root["value"] = gasSensorReading;
  char buffer[256];
  root.printTo(buffer, sizeof(buffer));

  client.publish("room/gas", buffer);
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
      root["password"] = pressedKeys;

      pressedKeys = "";

      char buffer[256];
      root.printTo(buffer, sizeof(buffer));

      client.publish("room/key", buffer);
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
int securityState;
void securityCallback() {
  int  val = digitalRead(securityInputPin);      // read input value and store it in val
  if (val != securityState) {// the button state has changed!
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.createObject();
    char buffer[256];
    root["active"] = (bool)val;
    root.printTo(buffer, sizeof(buffer));
    client.publish("room/security", buffer);
  }
  securityState = val;
}
void setup() {
  Serial.begin(9600);
  startEthernet();
  startMqtt();
  subscripting();
  gasSensorThread.onRun(gasSensorCallback);
  gasSensorThread.setInterval(5000);

  pinMode(pirSensorPin, INPUT);
  digitalWrite(pirSensorPin, LOW);
  pirSensorThread.onRun(pirSensorCallback);
  pirSensorThread.setInterval(1000);

  temperatureSensorThread.onRun(temperatureSensorCallback);
  temperatureSensorThread.setInterval(5000);

  lightSensorThread.onRun(lightSensorCallback);
  lightSensorThread.setInterval(1000);

  keypadThread.onRun(keypadCallback);
  keypadThread.setInterval(0);

  securityThread.onRun(securityCallback);
  pinMode(securityInputPin, INPUT);
  securityThread.setInterval(0);
  securityState = digitalRead(securityInputPin);

  controll.add(&gasSensorThread);
  controll.add(&pirSensorThread);
  controll.add(&temperatureSensorThread);
  controll.add(&lightSensorThread);
  controll.add(&keypadThread);
  controll.add(&securityThread);
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

