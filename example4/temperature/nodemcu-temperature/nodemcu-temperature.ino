#include "DHT_U.H"

dht DHT;

//#define DHT11_PIN D1

void setup() {
  Serial.begin(9600);
}

void loop()
{
  int pirPin = D1;
//  int chk = DHT.read11(DHT11_PIN);
  int chk = DHT.read11(pirPin);
  Serial.print("Temperature = ");
  Serial.println(DHT.temperature);
  Serial.print("Humidity = ");
  Serial.println(DHT.humidity);
  Serial.println();
  delay(2000);
}
