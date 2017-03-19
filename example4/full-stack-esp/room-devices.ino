/*
 *  This sketch sends a message to a TCP server
 *
 */
#include <Thread.h>
#include <ThreadController.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include "PubSubClient.h"
#include <SPI.h>
#include "MFRC522.h" 
#include "ArduinoJson.h";
#include "DHT.h";

ESP8266WiFiMulti WiFiMulti;
WiFiClient client;
PubSubClient mqttClient;
byte server[] = { 192, 168, 0, 68 };

ThreadController controll = ThreadController();
Thread pirThread = Thread();
Thread temperatureThread = Thread();
Thread lightThread = Thread();

char* wifiName = "Eliftech_2.4G";
char* wifiPassword = "Golang-Node.js";
const int pirPin = D0;
bool pirState = false;
const int tempPin = D1;
const int lightPin = A0;
const int conditionerPin = D3;
const int curtainPin = D2;
char* conditionerTopic = "conditioner/open";
char* curtainTopic = "curtain/open";
char* conditionerPublishTopic = "room/coditioner";
char* curtainPublishTopic = "room/curtain";

DHT dht(tempPin, DHT11);

void startMqtt() {
  mqttClient.setClient(client); //set client for mqqt (ethernet)
  mqttClient.setServer(server, 1883); // set server for mqqt(raspberry)
  mqttClient.setCallback(mqttCallback); // set callback for subscripting

  mqttClient.connect("arduino"); //connect as arduino
  Serial.println("Connecting to MQTT server");
  if (!mqttClient.connected()) {
    while (!mqttClient.connected()) {
      mqttClient.connect("arduino");
  Serial.print(".");
    }
  }
  Serial.println("Connected to MQTT server");
}

void connectToWifi() {
    Serial.print("connecting to ");

    // This will send the request to the server
    client.print("Send this data to server");

    //read back one line from server
    String line = client.readStringUntil('\r');
    client.println(line);
  }

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.println("received");
    if (String(topic) == String(curtainTopic)) {
      curtain(payload);
    }
    if (String(topic) == String(conditionerTopic)) {
      conditioner(payload);
    }
}

void conditioner(byte* payload) {
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
  mqttClient.publish(conditionerPublishTopic, buffer);
}

void curtain(byte* payload) {
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject((char*)payload);
  bool value = root["value"];
  if (value) {
    digitalWrite(curtainPin, HIGH);
  } else {
    digitalWrite(curtainPin, LOW);
  }
  char buffer[256];
  root.printTo(buffer, sizeof(buffer));
  mqttClient.publish(curtainPublishTopic, buffer);
}

void pirSensorCallback() {
  StaticJsonBuffer<200> jsonBuffer;

  bool movement;

  if (digitalRead(pirPin) == HIGH) {
    if (pirState) {
      return;
    }
    pirState = true;
  } else {
    if (!pirState) {
      return;
    }
    pirState = false;
  }
  Serial.print("Current motion state: ");
  Serial.println(pirState);
  JsonObject & root = jsonBuffer.createObject();
  root["value"] = pirState;
  char buffer[256];
  root.printTo(buffer, sizeof(buffer));
  mqttClient.publish("room/pir", buffer);
}

void temperatureSensorCallback() {
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["humidity"] = dht.readHumidity();
  root["temperature"] = dht.readTemperature();
  Serial.print("Current temperature: ");
  Serial.println(dht.readTemperature());
  char buffer[256];
  root.printTo(buffer, sizeof(buffer));
  mqttClient.publish("room/temperature", buffer);
}

void lightSensorCallback() {
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["value"] = analogRead(lightPin);
  Serial.print("Current light value: ");
  Serial.println(analogRead(lightPin));
  char buffer[256];
  root.printTo(buffer, sizeof(buffer)); 
  mqttClient.publish("room/light", buffer);
}

void subscribe() {
  mqttClient.subscribe(conditionerTopic);
  mqttClient.subscribe(curtainTopic);
}

void setup() {
    Serial.begin(9600);
    delay(10);

    // We start by connecting to a WiFi network
    WiFiMulti.addAP(wifiName, wifiPassword);

    Serial.println();
    Serial.println();
    Serial.print("Wait for WiFi... ");

    while(WiFiMulti.run() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    connectToWifi();
    startMqtt();
    
    pirThread.onRun(pirSensorCallback);
    pirThread.setInterval(1000);
    temperatureThread.onRun(temperatureSensorCallback);
    temperatureThread.setInterval(5000);
    lightThread.onRun(lightSensorCallback);
    lightThread.setInterval(1000);

    pinMode(conditionerPin, OUTPUT);
    pinMode(curtainPin, OUTPUT);

    controll.add(&pirThread);
    controll.add(&temperatureThread);
    controll.add(&lightThread);

    subscribe();
    
    delay(500);
}


void loop() {
  
  controll.run();
  if (!mqttClient.connected())
  {
    // clientID, username, MD5 encoded password
    mqttClient.connect("arduino");
    mqttClient.loop();
  }
  // MQTT client loop processing
  mqttClient.loop();

}

