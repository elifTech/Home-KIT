#include "ArduinoJson.h";
#include "AES.h"
#include "base64.h"
#include "./iv.h"
AES aes ;
static char* decode(char* payload)  {
  DynamicJsonBuffer jsonBuffer; // create jsno buffer
  JsonObject& payld = jsonBuffer.parseObject((char*)payload);
  int num = payld["iv"];
  char* msg = payld["message"];
  char b64data[200];
  uint8_t cipher[1000];
  memset(b64data, 0, 200);
  memset(cipher, 0, 1000);
  uint8_t iv[N_BLOCK];
  memset(iv, 0, 16);
  memcpy(iv,new_iv[num], sizeof(new_iv[num]));
  String realMSG = String(msg);
  int blen = base64_decode(b64data, realMSG.c_str(), realMSG.length());
  aes.do_aes_decrypt((uint8_t *)b64data, blen , cipher, key, 128, iv);
  //return b64data;
  base64_decode(b64data, (char *)cipher, aes.get_size());
 // free(&jsonBuffer);

  return b64data;
}

//for encoding ACHTUNG : set string wich have even length //TODO : fix this
char* encode(String msg)  {
  char data[200];
  byte cipher[1000];
  long num;
  byte iv[N_BLOCK];
  memset(data, 0, 200);
  memset(cipher, 0, 1000);
  memset(iv, 0, 16);
  num = random(100);
  memcpy(iv,new_iv[num], sizeof(new_iv[num]));
  aes.set_key( key , sizeof(key));  // Get the globally defined key
  int len = base64_encode(data, (char *)msg.c_str(), msg.length() + 1);
  // Encrypt! With AES128, our key and IV, CBC and pkcs7 padding
  aes.do_aes_encrypt((byte *)data, len , cipher, key, 128, iv);
  base64_encode(data, (char *)cipher, aes.get_size());
  char result[200];
 char stringIV[5];
 sprintf(stringIV, "%d", num);
 strcpy(result, "{\"iv\": ");
 strcat(result, stringIV);
 strcat(result, ", \"message\": \"");
 strcat(result, data);
 strcat(result, "\"}");
 free(&stringIV);
 return result;
//  String mseg =  String("{\"iv\": ") + num + String(", \"message\":\"")+ String(data) +String("\"}");
//  return mseg;

}
