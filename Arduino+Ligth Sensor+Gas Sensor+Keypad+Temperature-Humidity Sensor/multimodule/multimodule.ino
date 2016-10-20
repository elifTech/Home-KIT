#include <Thread.h>
#include <ThreadController.h>
#include <Keypad.h>
#include "DHT.h"

// ThreadController that will controll all threads
ThreadController controll = ThreadController();
Thread gasSensorThread = Thread();
Thread photocellThread = Thread();
Thread keypadThread = Thread();
Thread meteoThread = Thread();

const int gasPin = A0;
const int photocellPin = A1;
const byte numRows = 4; //number of rows on the keypad
const byte numCols = 4; //number of columns on the keypad
#define DHTPIN 30
DHT dht(DHTPIN, DHT11);

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

int photocellReading;

void gasSensorCallback() {
  Serial.println("Gas sensor says:");
  Serial.println(analogRead(gasPin));
}


void photocellCallback() {
  photocellReading = analogRead(photocellPin);
  Serial.println("Photocell data");
  Serial.println(photocellReading);
}

void keypadCallback() {
  char keypressed = myKeypad.getKey();
  if (keypressed != NO_KEY)
  {
    Serial.print(keypressed);
  }
}

void meteoCallback() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  Serial.println("Humidity");
  Serial.println(h);
  Serial.println("Temperature");
  Serial.println(t);
}

void setup() {
  Serial.begin(9600);   // Initialize serial communications with the PC
  dht.begin();
  gasSensorThread.onRun(gasSensorCallback);
  gasSensorThread.setInterval(10000);

  photocellThread.onRun(photocellCallback);
  photocellThread.setInterval(10000);

  keypadThread.onRun(keypadCallback);
  keypadThread.setInterval(0);

  meteoThread.onRun(meteoCallback);
  meteoThread.setInterval(1000);
  
  controll.add(&gasSensorThread);
  controll.add(&photocellThread);
  controll.add(&keypadThread);
  controll.add(&meteoThread);
}

void loop() {
  controll.run();
}
