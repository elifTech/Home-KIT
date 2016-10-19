#include <SPI.h>
#include <MFRC522.h>
#include <Thread.h>
#include <ThreadController.h>
#include <Keypad.h>

#define RST_PIN         10         // Configurable, see typical pin layout above
#define SS_PIN          53         // Configurable, see typical pin layout above


// ThreadController that will controll all threads
ThreadController controll = ThreadController();
Thread gasSensorThread = Thread();
Thread cardReaderThread = Thread();
Thread photocellThread = Thread();
Thread keypadThread = Thread();

const int gasPin = A0;
const int photocellPin = A1;
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

int photocellReading;

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance
String UIDstring;

void gasSensorCallback() {
  Serial.println("Gas sensor says:");
  Serial.println(analogRead(gasPin));
}

void cardReaderCallback() {
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // Dump debug info about the card; PICC_HaltA() is automatically called
  Serial.println("Card id:");
  UIDstring = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    UIDstring = UIDstring + String(mfrc522.uid.uidByte[i]);
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
  }
  Serial.println();
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

void setup() {
  Serial.begin(9600);   // Initialize serial communications with the PC
  gasSensorThread.onRun(gasSensorCallback);
  gasSensorThread.setInterval(1000);

  cardReaderThread.onRun(cardReaderCallback);
  cardReaderThread.setInterval(0);

  photocellThread.onRun(photocellCallback);
  photocellThread.setInterval(2000);

  keypadThread.onRun(keypadCallback);
  keypadThread.setInterval(0);

  controll.add(&gasSensorThread);
  controll.add(&cardReaderThread);
  controll.add(&photocellThread);
  controll.add(&keypadThread);

  while (!Serial);    // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)
  SPI.begin();      // Init SPI bus
  mfrc522.PCD_Init();   // Init MFRC522
  mfrc522.PCD_DumpVersionToSerial();  // Show details of PCD - MFRC522 Card Reader details
  Serial.println(F("Scan PICC to see UID, type, and data blocks..."));
}

void loop() {
  controll.run();
  // Look for new cards
  //  if ( ! mfrc522.PICC_IsNewCardPresent()) {
  //    return;
  //  }
  //
  //  // Select one of the cards
  //  if ( ! mfrc522.PICC_ReadCardSerial()) {
  //    return;
  //  }
  //
  //  // Dump debug info about the card; PICC_HaltA() is automatically called
  //  Serial.println("Card id:");
  //  UIDstring = "";
  //  for (byte i = 0; i < mfrc522.uid.size; i++) {
  //    UIDstring = UIDstring + String(mfrc522.uid.uidByte[i]);
  //    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
  //    Serial.print(mfrc522.uid.uidByte[i], HEX);
  //  }
  //  Serial.println();
}
