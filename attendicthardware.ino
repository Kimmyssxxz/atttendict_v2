/**
 * ESP32 RFID Attendance Terminal for Attendict
 * 
 * HARDWARE CONNECTIONS:
 * -------------------
 * LCD I2C:
 * - VCC -> VIN (5V)
 * - GND -> GND
 * - SDA -> GPIO 21
 * - SCL -> GPIO 22
 * 
 * RFID RC522 (SPI):
 * - VCC -> 3.3V
 * - GND -> GND
 * - SDA (SS) -> GPIO 5
 * - SCK -> GPIO 18
 * - MOSI -> GPIO 23
 * - MISO -> GPIO 19
 * - RST -> GPIO 27
 * 
 * RTC DS1302:
 * - VCC -> 3.3V
 * - GND -> GND
 * - CLK -> GPIO 14
 * - DAT -> GPIO 13
 * - RST -> GPIO 15
 * 
 * Active Buzzer:
 * - Signal -> GPIO 26
 * 
 * LEDs:
 * - Green -> GPIO 25
 * - Red -> GPIO 33
 * - Common Cathode -> GND
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <ThreeWire.h>  
#include <RtcDS1302.h>

// --- SETTINGS ---
const char* ssid = "DICT_Ormin";
const char* password = "1234567890";
// Replace with your computer's local IP (e.g. http://192.168.1.5:3001)
const char* serverUrl = "http://192.168.0.21:3001/api/rfid/scan";

// --- PIN DEFINITIONS ---
#define SS_PIN    5
#define RST_PIN   27
#define BUZZER    26
#define LED_G     25
#define LED_R     33

// RTC Pins
#define RTC_CLK 14
#define RTC_DAT 13
#define RTC_RST 15

// --- OBJECTS ---
MFRC522 mfrc522(SS_PIN, RST_PIN);
LiquidCrystal_I2C lcd(0x27, 16, 2); // Change address if necessary (usually 0x27 or 0x3F)
ThreeWire myWire(RTC_DAT, RTC_CLK, RTC_RST);
RtcDS1302<ThreeWire> Rtc(myWire);

unsigned long lastLcdUpdate = 0;

void setup() {
  Serial.begin(115200);
  
  // Pin modes
  pinMode(BUZZER, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_R, OUTPUT);
  digitalWrite(LED_G, LOW);
  digitalWrite(LED_R, LOW);

  // Initialize LCD
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Initializing...");

  // Initialize SPI & RFID
  SPI.begin();
  mfrc522.PCD_Init();
  delay(4); // wait for MFRC522 to initialize
  mfrc522.PCD_SetAntennaGain(mfrc522.RxGain_max);

  // Initialize RTC
  Rtc.Begin();
  if (!Rtc.IsDateTimeValid()) {
      Rtc.SetDateTime(RtcDateTime(__DATE__, __TIME__));
  }
  if (Rtc.GetIsWriteProtected()) {
      Rtc.SetIsWriteProtected(false);
  }
  if (!Rtc.GetIsRunning()) {
      Rtc.SetIsRunning(true);
  }

  // Connect Wi-Fi
  WiFi.begin(ssid, password);
  lcd.setCursor(0, 1);
  lcd.print("WiFi connecting");
  
  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 20) {
    delay(500);
    Serial.print(".");
    retry++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    lcd.clear();
    lcd.print("WiFi Connected!");
    Serial.println("\nWiFi Connected");
    beep(1);
  } else {
    lcd.clear();
    lcd.print("WiFi Failed");
    beep(3);
  }
  
  delay(2000);
  lcd.clear();
}

void loop() {
  // Display Time from RTC only once per second to avoid blocking RFID reads
  if (millis() - lastLcdUpdate >= 1000) {
    displayTime();
    lastLcdUpdate = millis();
  }

  // Check for RFID Tag
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // Get UID
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uid += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    uid += String(mfrc522.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  
  Serial.print("Card Scanned: ");
  Serial.println(uid);

  // Send to Server
  sendScanData(uid);

  // Halt RFID to prevent multiple reads
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}

void displayTime() {
  RtcDateTime now = Rtc.GetDateTime();
  char datestring[20];
  snprintf_P(datestring, 
          countof(datestring),
          PSTR("%02u/%02u/%04u %02u:%02u"),
          now.Month(),
          now.Day(),
          now.Year(),
          now.Hour(),
          now.Minute());
          
  lcd.setCursor(0, 0);
  lcd.print("ATTENDICT SYSTEM");
  lcd.setCursor(0, 1);
  lcd.print(datestring);
}

void sendScanData(String uid) {
  if (WiFi.status() != WL_CONNECTED) {
    showError("WiFi Lost");
    return;
  }

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Scanning...");

  HTTPClient http;
  http.setTimeout(15000);
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<200> doc;
  doc["uid"] = uid;
  String requestBody;
  serializeJson(doc, requestBody);

  int httpResponseCode = http.POST(requestBody);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(response);
    
    StaticJsonDocument<500> resDoc;
    DeserializationError error = deserializeJson(resDoc, response);

    if (!error) {
      String status = resDoc["status"];
      String message = resDoc["message"];
      String name = resDoc["name"];

      if (status == "success") {
        showSuccess(name, message);
      } else if (status == "error") {
        showError(message);
      } else {
        showInfo(name, message);
      }
    } else {
      showError("Sync Error");
    }
  } else {
    showError("Server Offline");
  }
  
  http.end();
  delay(3000);
  lcd.clear();
}

void showSuccess(String name, String action) {
  digitalWrite(LED_G, HIGH);
  beep(1);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(name);
  lcd.setCursor(0, 1);
  lcd.print(action + " SUCCESS");
  delay(1000);
  digitalWrite(LED_G, LOW);
}

void showInfo(String name, String msg) {
  beep(2);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(name);
  lcd.setCursor(0, 1);
  lcd.print(msg);
}

void showError(String msg) {
  digitalWrite(LED_R, HIGH);
  beep(3);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("ACCESS DENIED");
  lcd.setCursor(0, 1);
  lcd.print(msg);
  delay(2000);
  digitalWrite(LED_R, LOW);
}

void beep(int count) {
  for (int i = 0; i < count; i++) {
    digitalWrite(BUZZER, HIGH);
    delay(100);
    digitalWrite(BUZZER, LOW);
    if (i < count - 1) delay(100);
  }
}

// Macro helper
#define countof(a) (sizeof(a) / sizeof(a[0]))
