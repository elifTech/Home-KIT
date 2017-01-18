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

const int lightSensorPin = A1;
const int gasSensorPin = A1;
const int pirSensorPin = A2;
const int temperatureSensorPin = 30;

const int gasSensorLed = 10;

DHT dht(temperatureSensorPin, DHT11);

//#define DHTPIN 30
//DHT dht(DHTPIN, DHT11);

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
byte server[] = { 192, 168, 0, 72 };

void startEthernet() {
  Serial.println("start Ethernet");
  Ethernet.begin(mac); //start ethernet
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  if (String(topic) == "gas/change") {
    gasLedHandler(payload);
  }
}

void gasLedHandler(byte* payload) {
  DynamicJsonBuffer jsonBuffer;
 // JsonArray& lightsArray = jsonBuffer.parseArray((char*)payload);
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
}
void gasSensorCallback() {
  StaticJsonBuffer<200> jsonBuffer;
  int gasSensorReading = analogRead(gasSensorPin);
  JsonObject& root = jsonBuffer.createObject();
  root["value"] = gasSensorReading;
  char buffer[256];
  root.printTo(buffer, sizeof(buffer));

  client.publish("room/gas", buffer);

  root.printTo(Serial);
  Serial.println();
}
void setup() {
  Serial.begin(9600);
  startEthernet();
  startMqtt();
  subscripting();
  gasSensorThread.onRun(gasSensorCallback);
}

void loop() {
  // put your main code here, to run repeatedly:

}

