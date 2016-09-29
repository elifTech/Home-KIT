#include <IRremote.h>

int RECV_PIN = 11;

IRrecv irrecv(RECV_PIN);

decode_results results;

void setup()
{
  Serial.begin(9600);
  irrecv.enableIRIn(); // Start the receiver
  Serial.println("SERIAL STARTED");
  
}

void loop() {
  if (irrecv.decode(&results)) {
    Serial.println("COMMAND RECEIVED");
    Serial.println(results.value, HEX);
    irrecv.resume(); // Receive the next value
  }
}
