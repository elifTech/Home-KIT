/////////////////////////////
//VARS
//the time we give the sensor to calibrate (10-60 secs according to the datasheet)
int calibrationTime = 10;        

//the time when the sensor outputs a low impulse
long unsigned int lowIn;         

//the amount of milliseconds the sensor has to be low 
//before we assume all motion has stopped
long unsigned int pause = 5000;  

boolean lockLow = true;
boolean takeLowTime;  

int pirPin = 31;    //the digital pin connected to the PIR sensor's output
int ledPin = 13;


/////////////////////////////
//SETUP
void setup() {
  Serial.begin(9600);
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
  digitalWrite(pirPin, LOW);

  //give the sensor some time to calibrate
  Serial.print("calibrating sensor ");
    for (int i = 0; i < calibrationTime; i++) {
      Serial.print(".");
      delay(1000);
    }
    Serial.println(" done");
    Serial.println("SENSOR ACTIVE");
    delay(50);
}

////////////////////////////
//LOOP
void loop() {

     if (digitalRead(pirPin) == HIGH) {
         digitalWrite(ledPin, HIGH);   //the led visualizes the sensors output pin state
         Serial.println("motion detected");
         delay(500);
      }         
      if (digitalRead(pirPin) == LOW) {
      	digitalWrite(ledPin, LOW); 
      }
}
