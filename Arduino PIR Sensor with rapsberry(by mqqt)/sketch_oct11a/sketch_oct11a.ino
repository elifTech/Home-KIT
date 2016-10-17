
//including library
#include "AES.h"
#include "base64.h"
#include "ArduinoJson.h";
#include "UIPEthernet.h"
#include "PubSubClient.h"
#include "./printf.h"
#include "./iv.h"
//define pins
#define GREEN 4
#define RED 5
#define YELLOW 6
#define pirPin  31
//define timer
unsigned long TimerA;
bool busy = false;
//end timer
//define moves
bool movement = false;
//define AES,ethernet and mqqt client
AES aes ;
EthernetClient ethClient;
PubSubClient client;

//define params for ethernet and mqtt
byte mac[]    = {  0x00, 0x01, 0x02, 0x03, 0x04, 0x05D };
byte server[] = { 192, 168, 0, 33 };
byte ip[]     = { 192, 168, 0, 37 };


//function for decoding
char* decode(char* payload)  {
  DynamicJsonBuffer jsonBuffer; // create jsno buffer
  JsonObject& payld = jsonBuffer.parseObject((char*)payload);
  int num = payld["iv"];
  char* msg = payld["message"];
  char b64data[200];
  byte cipher[1000];
  memset(b64data, 0, 200);
  memset(cipher, 0, 1000);
  Serial.println("CHECK variable");
  Serial.println(b64data);
  Serial.print("IV: ");
  byte iv[N_BLOCK];
  memset(iv, 0, 16);
  memcpy(iv,new_iv[num], sizeof(new_iv[num]));
  String realMSG = String(msg);
  Serial.println( realMSG );
  int blen = base64_decode(b64data, realMSG.c_str(), realMSG.length() );
  aes.do_aes_decrypt((byte *)b64data, blen , cipher, key, 128, iv);
  base64_decode(b64data, (char *)cipher, aes.get_size() );
  Serial.println ("Decrypted data in base64: " + String(b64data) );
  return b64data;
}



//for encoding ACHTUNG : set string wich have even length //TODO : fix this
String encode(String msg)  {
  char data[200];
  byte cipher[1000];
  long num;
  byte iv[N_BLOCK];
  memset(data, 0, 200);
  memset(cipher, 0, 1000);
  memset(iv, 0, 16);
  Serial.println("CHECK variable");
  Serial.print("IV: ");
  num = random(100);
  Serial.println(num);
  memcpy(iv,new_iv[num], sizeof(new_iv[num]));
  aes.set_key( key , sizeof(key));  // Get the globally defined key
  Serial.println(" Mensagem: " + msg );
  int len = base64_encode(data, (char *)msg.c_str(), msg.length());
  // Encrypt! With AES128, our key and IV, CBC and pkcs7 padding
  aes.do_aes_encrypt((byte *)data, len , cipher, key, 128, iv);
  Serial.println("Encryption done!");
  base64_encode(data, (char *)cipher, aes.get_size() );
  Serial.println ("Encrypted data in base64: " + String(data) );
  String mseg =  String("{\"iv\": ") + num + String(", \"message\":\"")+ String(data) +String("\"}");
  return mseg;

}



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
  if (millis() - TimerA >= 10000) { //check if timer end
    busy = false; // set state of timer
    if (digitalRead(pirPin) == HIGH) { //read value from sensor, if is high
      Serial.print("motion detected");
      if (!busy) { // check if timer is busy
        busy = true; // set to busy timer
        TimerA = millis(); // set initial time
      }
      client.publish("sensor/motion", encode(String("{\"motions\":1}")).c_str()); // send data to raspberry
      movement = true; // set is movement
    } else { // if value from sensor is low
      if (movement) { // if was movement
        if (!busy) { //check if timer is busy
          busy = true; // set to busy timer
          TimerA = millis(); // set initial time
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
  Serial.print("localIP: ");
  Serial.println(Ethernet.localIP());
  Serial.print("subnetMask: ");
  Serial.println(Ethernet.subnetMask());
  Serial.print("gatewayIP: ");
  Serial.println(Ethernet.gatewayIP());
  Serial.print("dnsServerIP: ");
  Serial.println(Ethernet.dnsServerIP());
  Serial.println("try 146to connect");
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
   client.subscribe("led/status"); //subscribe to led
}

void getStatus() {
  client.publish("led/get_status", "Give me my status"); //subscribe for status
  Serial.println("give status");
}

void setup()
{
  Serial.begin(57600); //start serial
  printf_begin(); // start printf
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
