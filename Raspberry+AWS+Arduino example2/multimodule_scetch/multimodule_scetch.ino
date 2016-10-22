#include <Thread.h>
#include <ThreadController.h>
#include <Keypad.h>
#include "DHT.h";
#include "UIPEthernet.h";
#include "PubSubClient.h";
#include "ArduinoJson.h";

EthernetClient ethClient;
PubSubClient client;

// ThreadController that will controll all threads
ThreadController controll = ThreadController();
Thread keypadThread = Thread();
Thread roomThread = Thread();

const int gasPin = A0;
const int yellowLedPin = 10;
const int redLedPin = 11;
const int greenLedPin = 12;

const int photocellPin = A1;
const byte numRows = 4; //number of rows on the keypad
const byte numCols = 4; //number of columns on the keypad
#define DHTPIN 30
DHT dht(DHTPIN, DHT11);

byte mac[]    = {  0x00, 0x01, 0x02, 0x03, 0x04, 0x05D };
byte server[] = { 192, 168, 0, 33 };

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

bool currentDoorState = false;

void manageYellowLed(bool value) {
  if (value) {
    digitalWrite(yellowLedPin, HIGH);
  } else {
    digitalWrite(yellowLedPin, LOW);
  }
}
void manageRedLed(bool value) {
  if (value) {
    digitalWrite(redLedPin, HIGH);
  } else {
    digitalWrite(redLedPin, LOW);
  }
}

void manageGreenLed(bool value) {
  if (value) {
    digitalWrite(greenLedPin, HIGH);
  } else {
    digitalWrite(greenLedPin, LOW);
  }
}

void infoPanelHandler(byte* payload) {
  DynamicJsonBuffer jsonBuffer;
  JsonArray& lightsArray = jsonBuffer.parseArray((char*)payload);
  for (int i = 0; i < lightsArray.size(); i++) {
    char* name = lightsArray[i]["name"];
    bool value = lightsArray[i]["value"];
    if (String(name) == "yellow") {
      manageYellowLed(value);
    }
    if (String(name) == "green") {
      manageGreenLed(value);
    }
    if (String(name) == "red") {
      manageRedLed(value);
    }
  }
  char buffer[256];
  lightsArray.printTo(buffer, sizeof(buffer));

  client.publish("room/infopanel", buffer);
}
void doorHandler(byte* payload) {

  DynamicJsonBuffer jsonBuffer;
  JsonObject& doorState = jsonBuffer.parseObject((char*)payload);
  bool isOpen = doorState["open"];
  currentDoorState = isOpen;

  char buffer[256];
  doorState.printTo(buffer, sizeof(buffer));
  
  client.publish("room/door", buffer);  

}
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  if (String(topic) == "infopanel") {
    infoPanelHandler(payload);
  }
  if (String(topic) == "door") {
    doorHandler(payload);
  }
}
void startEthernet() {
  Serial.println("start Ethernet");
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
void subscripting() {
  client.subscribe("infopanel");
  client.subscribe("door");
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

      client.publish("room/lock", buffer);
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

void roomStateCallback() {
  StaticJsonBuffer<200> jsonBuffer;

  int photocellReading = analogRead(photocellPin);
  float hum = dht.readHumidity();
  float temper = dht.readTemperature();
  int gasSensorReading = analogRead(gasPin);

  JsonObject& root = jsonBuffer.createObject();

  JsonObject& photocell = root.createNestedObject("photocell");
  photocell["value"] = photocellReading;

  JsonObject& humidity = root.createNestedObject("humidity");
  humidity["value"] = hum != hum ? 0 : hum;

  JsonObject& temperature = root.createNestedObject("temperature");
  temperature["value"] = temper != temper ? 0 : temper;

  JsonObject& gas_sensor = root.createNestedObject("gas_sensor");
  gas_sensor["value"] = gasSensorReading;

  char buffer[256];
  root.printTo(buffer, sizeof(buffer));

  client.publish("room/sensors", buffer);

  root.printTo(Serial);
  Serial.println();
}

void setup() {
  Serial.begin(9600);   // Initialize serial communications with the PC
  pinMode(yellowLedPin, OUTPUT);
  pinMode(redLedPin, OUTPUT);
  pinMode(greenLedPin, OUTPUT);
  startEthernet();
  startMqtt();
  subscripting();
  dht.begin();

  keypadThread.onRun(keypadCallback);
  keypadThread.setInterval(0);

  roomThread.onRun(roomStateCallback);
  roomThread.setInterval(10000);

  controll.add(&keypadThread);
  controll.add(&roomThread);
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
