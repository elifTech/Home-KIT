
void setup(){
  Serial.begin(9600);
}

void loop()
{
  int light = analogRead(A0);
  Serial.print("LIGHT = ");
  Serial.println(light);
  delay(1000);
}