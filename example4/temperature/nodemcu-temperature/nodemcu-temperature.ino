#include "DHT.h";


const int tempPin = D1;
//#define DHT11_PIN D1
DHT dht(tempPin, DHT11);

void setup() {
  Serial.begin(9600);
}

void loop()
{
  Serial.print("Temperature = ");
  Serial.println( dht.readTemperature());
  Serial.print("Humidity = ");
  Serial.println(dht.readHumidity());
  Serial.println();
  delay(2000);
}
