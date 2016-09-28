#define myPeriodic 15 //in sec | Thingspeak pub is 15sec
#include <ESP8266WiFi.h>
#include <pins_arduino.h>
long min=0;
int PIRpin = 5;
int PIRvalue=0;
const char* server = "api.thingspeak.com";
String apiKey ="Your-api-key";
String api_key_ts="your-api-key-ts";
const char* MY_SSID = "wifi=ssid"; 
const char* MY_PWD = "password";
int ledpin = 4;
int failedCounter = 0;
long lastConnectionTime = 0; 
boolean lastConnected = false;
int sent = 0;

void setup() {
  pinMode(D4, INPUT);
   pinMode(ledpin,OUTPUT);
  Serial.begin(115200);
}

void loop() {
  digitalWrite(ledpin,HIGH);
  PIRvalue=digitalRead(PIRpin);
  digitalWrite(16,HIGH);
if (PIRvalue==HIGH){
  Serial.println(String(sent)+"Motion detected ");
  int count = myPeriodic;
  while(count--)
  delay(10);}
  else{
    Serial.println(String(sent)+"Motion NOT detected ");
  int count = myPeriodic;
  while(count--)
  delay(10);}
    
}





