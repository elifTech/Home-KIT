/*
 *  This sketch sends a message to a TCP server
 *
 */

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include "PubSubClient.h"
#include <SPI.h>
#include "MFRC522.h" 
#include "ArduinoJson.h";

ESP8266WiFiMulti WiFiMulti;
WiFiClient client;
PubSubClient mqttClient;
byte server[] = { 192, 168, 0, 62 };
#define RST_PIN  2 // RST-PIN fur RC522 - RFID - SPI - Modul GPIO15 
#define SS_PIN  4  // SDA-PIN fur RC522 - RFID - SPI - Modul GPIO2 
MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance

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

void initCard() {
  // Serial.begin(9600);    // Initialize serial communications
  delay(250);
  Serial.println(F("Booting...."));  
  SPI.begin();           // Init SPI bus
  mfrc522.PCD_Init();    // Init MFRC522    
  Serial.println(F("Ready!"));
  Serial.println(F("======================================================")); 
  Serial.println(F("Scan for Card and print UID:"));
}

void mqttCallback(char* topic, byte* payload, unsigned int length) { }

void dump_byte_array(byte *buffer, byte bufferSize) {

  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& cardId = jsonBuffer.createObject();
  cardId["id"] = getID();
  char message[256];
  cardId.printTo(message, sizeof(message));
  mqttClient.publish("room/card", message);
  Serial.println(message);
}

void setup() {
    Serial.begin(9600);
    delay(10);

    // We start by connecting to a WiFi network
    WiFiMulti.addAP("Eliftech_2.4G", "Node.Js_1S");

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
    initCard();
    
    delay(500);
}

String getID(){
  // Dump UID
  String rfid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
      rfid += mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ";
      rfid += String(mfrc522.uid.uidByte[i], HEX);
  }
  
  rfid.trim();
  rfid.toUpperCase();
  return rfid;
     
}


void loop() {

    // Look for new cards
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    delay(50);
    return;
  }
  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    delay(50);
    return;
  }
  // Show some details of the PICC (that is: the tag/card)
  Serial.print(F("Card UID:"));
  dump_byte_array(mfrc522.uid.uidByte, mfrc522.uid.size);
  Serial.println();
    delay(5000);
}

