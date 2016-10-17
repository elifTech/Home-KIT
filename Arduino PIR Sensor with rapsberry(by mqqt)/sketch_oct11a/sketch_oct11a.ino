
//including library
#include "AES.h"
#include "base64.h"
#include "ArduinoJson.h";
#include "UIPEthernet.h"
#include "PubSubClient.h"
#include "./printf.h"
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

//AES key
byte key[] = { 0x2B, 0x7E, 0x15, 0x16, 0x28, 0xAE, 0xD2, 0xA6, 0xAB, 0xF7, 0x15, 0x88, 0x09, 0xCF, 0x4F, 0x3C };
// The unitialized Initialization vector
byte my_iv[N_BLOCK] = { 0x70, 0x01, 0x6F, 0x89, 0xA0, 0xCC, 0x1D, 0xE8, 0xE5, 0xB5, 0xE1, 0xA7, 0xF7, 0xFE, 0x1E, 0x41};

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
      client.publish("sensor/motion", encode(String("{\"motions\":1}"))); // send data to raspberry
      movement = true; // set is movement
    } else { // if value from sensor is low
      if (movement) { // if was movement
        if (!busy) { //check if timer is busy
          busy = true; // set to busy timer
          TimerA = millis(); // set initial time
        }
        client.publish("sensor/motion", encode(String("{\"motions\":0}"))); movement = false; //send movement is end
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
  DynamicJsonBuffer jsonBuffer; // creat jsno buffer
  JsonArray& list = jsonBuffer.parseArray(decode(payload)); //parse jsno array of leds
  for (int i = 0; i < list.size(); i++) {
    JsonObject& element = list[i]["sensor"];
    char* sensor = element["name"];
    int state = element["value"];
    setState(sensor, state); // set state of led
  }

}

//function for decoding
char* decode(byte* msg)  {
  char b64data[200];
  byte cipher[1000];
  memset(b64data, 0, 200);
  memset(cipher, 0, 1000);
  Serial.println("CHECK variable");
  Serial.println(b64data);
  Serial.print("IV: ");
  Serial.println((char*)my_iv);
  byte iv[N_BLOCK] = { 0x70, 0x01, 0x6F, 0x89, 0xA0, 0xCC, 0x1D, 0xE8, 0xE5, 0xB5, 0xE1, 0xA7, 0xF7, 0xFE, 0x1E, 0x41};
  String realMSG = String((char*)msg);
  Serial.println( realMSG );
  int blen = base64_decode(b64data, realMSG.c_str(), realMSG.length() );
  Serial.println (" Message in B64: " + String(b64data) );
  Serial.println (" The lenght is:  " + String(blen) );

  aes.do_aes_decrypt((byte *)b64data, blen , cipher, key, 128, iv);

  Serial.println("Encryption done!");

  Serial.println("Cipher size: " + String(aes.get_size()));

  base64_decode(b64data, (char *)cipher, aes.get_size() );
  Serial.println ("Decrypted data in base64: " + String(b64data) );
  Serial.println("Done...");
  return b64data;
}



//for encoding ACHTUNG : set string wich have even length //TODO : fix this
char* encode(String msg)  {
  char data[200];
  byte cipher[1000];
  memset(data, 0, 200);
  memset(cipher, 0, 1000);
  Serial.println("CHECK variable");
  Serial.print("IV: ");
  Serial.println((char*)my_iv);
  byte iv[N_BLOCK] = { 0x70, 0x01, 0x6F, 0x89, 0xA0, 0xCC, 0x1D, 0xE8, 0xE5, 0xB5, 0xE1, 0xA7, 0xF7, 0xFE, 0x1E, 0x41};

  Serial.println("Let's encrypt:");

  aes.set_key( key , sizeof(key));  // Get the globally defined key



  Serial.println(" Mensagem: " + msg );

  int len = base64_encode(data, (char *)msg.c_str(), msg.length());
  Serial.println (" Message in B64: " + String(data) );
  Serial.println (" The lenght is:  " + String(len) );

  // Encrypt! With AES128, our key and IV, CBC and pkcs7 padding
  aes.do_aes_encrypt((byte *)data, len , cipher, key, 128, iv);

  Serial.println("Encryption done!");

  Serial.println("Cipher size: " + String(aes.get_size()));

  base64_encode(data, (char *)cipher, aes.get_size() );
  Serial.println ("Encrypted data in base64: " + String(data) );

  Serial.println("Done...");
  return data;
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
