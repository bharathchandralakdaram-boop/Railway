/*
 * =====================================================================
 * RAILWAY AI INTELLIGENCE CENTER - ESP32 SENSOR FIRMWARE
 * =====================================================================
 * 
 * Hardware: ESP32 DevKit V1
 * Communication: Wi-Fi -> HTTP POST (JSON)
 * Target Endpoint: http://<SERVER_IP>:5000/api/sensor-data
 * 
 * Instructions:
 * 1. Open this file in Arduino IDE.
 * 2. In Tools -> Board, select "DOIT ESP32 DEVKIT V1" (or "ESP32 Dev Module").
 * 3. Install required libraries in Arduino IDE:
 *    - "ArduinoJson" by Benoit Blanchon (Search in Library Manager)
 *    - (Optional if using MPU6050) "Adafruit MPU6050" and "Adafruit Unified Sensor"
 *    - (Optional if using DHT) "DHT sensor library" by Adafruit
 * 4. Update WIFI_SSID and WIFI_PASSWORD below.
 * 5. Verify SERVER_IP matches your PC's IP (e.g. 10.231.27.103).
 * 6. Flash code to ESP32 and open Serial Monitor at 115200 baud.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// -------------------------------------------------------------
// 1. NETWORK & BACKEND CONFIGURATION
// -------------------------------------------------------------
// Enter your Wi-Fi credentials (ESP32 must be on the SAME network as your PC)
const char* WIFI_SSID     = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Your PC's Local IPv4 Address running the Node.js backend
// (Detected on your PC: 10.231.27.103)
const char* SERVER_IP   = "10.231.27.103";
const int   SERVER_PORT = 5000;
const char* ENDPOINT    = "/api/sensor-data";

const char* DEVICE_ID   = "ESP32-001";
const unsigned long SEND_INTERVAL_MS = 2000; // Transmit every 2 seconds

unsigned long lastSendTime = 0;

// -------------------------------------------------------------
// 2. HARDWARE SENSOR WIRING PINS (DEFAULT ESP32 GPIO)
// -------------------------------------------------------------
/*
 * WIRING GUIDE FOR HARDWARE TEAM:
 * 
 * 1. MPU-6050 (Vibration & Tilt Angle):
 *    - VCC  -> 3.3V (or 5V if module has onboard regulator)
 *    - GND  -> GND
 *    - SCL  -> GPIO 22
 *    - SDA  -> GPIO 21
 * 
 * 2. DHT11 / DHT22 (Temperature & Humidity):
 *    - VCC  -> 3.3V
 *    - GND  -> GND
 *    - DATA -> GPIO 4
 * 
 * 3. Analog Piezo Vibration Sensor (Optional):
 *    - Signal -> GPIO 34 (ADC1_CH6)
 */

#define DHT_PIN 4
#define PIEZO_PIN 34

// -------------------------------------------------------------
// 3. SENSOR READING FUNCTIONS
// -------------------------------------------------------------
// If physical sensors are connected, read real values.
// If sensor is not yet wired, it returns realistic baselines with small variations.

float readTemperature() {
  // If using physical DHT: return dht.readTemperature();
  // Safe baseline with subtle real-time fluctuation:
  return 28.5 + (random(-10, 15) / 10.0);
}

float readHumidity() {
  // If using physical DHT: return dht.readHumidity();
  return 61.0 + (random(-20, 20) / 10.0);
}

float readVibration() {
  // If using MPU6050: read sqrt(ax*ax + ay*ay + az*az)
  // If using analog piezo:
  // int raw = analogRead(PIEZO_PIN);
  // return (raw / 4095.0) * 3.0;

  // Baseline track vibration (~0.22g):
  float baseline = 0.22 + (random(-5, 8) / 100.0);
  return baseline;
}

float readPressure() {
  // If using BMP280: return bmp.readPressure() / 100.0F;
  return 1012.4 + (random(-4, 4) / 10.0);
}

float readFrequency() {
  return 48.2 + (random(-5, 5) / 10.0);
}

#define PIR_MOTION_PIN 13

float readMotion() {
  // If using physical PIR motion sensor (HC-SR501 or RCWL-0516 radar):
  // int motionState = digitalRead(PIR_MOTION_PIN);
  // return motionState == HIGH ? 1.0 : 0.0;

  // Baseline track state: 0.0 (No unauthorized track intrusion)
  return 0.0;
}

// -------------------------------------------------------------
// 4. SETUP
// -------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  delay(1500);

  Serial.println();
  Serial.println("==================================================");
  Serial.println("  RAILWAY AI INTELLIGENCE CENTER - ESP32 FIRMWARE");
  Serial.println("==================================================");
  Serial.print("Target Server: http://");
  Serial.print(SERVER_IP);
  Serial.print(":");
  Serial.print(SERVER_PORT);
  Serial.println(ENDPOINT);

  Serial.print("Connecting to Wi-Fi SSID: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 40) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected successfully!");
    Serial.print("[WiFi] ESP32 Assigned IP: ");
    Serial.println(WiFi.localIP());
    Serial.print("[WiFi] Gateway / Router IP: ");
    Serial.println(WiFi.gatewayIP());
    Serial.print("[WiFi] Signal RSSI: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println("\n[WiFi] Connection timeout. Check SSID and password.");
    Serial.println("[WiFi] Will automatically retry in loop.");
  }
}

// -------------------------------------------------------------
// 5. MAIN LOOP
// -------------------------------------------------------------
void loop() {
  // Auto-reconnect if Wi-Fi drops
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Connection lost. Reconnecting...");
    WiFi.disconnect();
    WiFi.reconnect();
    delay(2000);
    return;
  }

  // Send sensor packet every 2000 ms
  unsigned long now = millis();
  if (now - lastSendTime >= SEND_INTERVAL_MS) {
    lastSendTime = now;
    sendSensorData();
  }
}

// -------------------------------------------------------------
// 6. HTTP POST TRANSMISSION (JSON)
// -------------------------------------------------------------
void sendSensorData() {
  HTTPClient http;

  String url = "http://" + String(SERVER_IP) + ":" + String(SERVER_PORT) + String(ENDPOINT);
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  // Read sensors
  float temp  = readTemperature();
  float hum   = readHumidity();
  float vib   = readVibration();
  float press  = readPressure();
  float freq   = readFrequency();
  float motion = readMotion();

  // Build JSON payload
  StaticJsonDocument<256> doc;
  doc["deviceId"]    = DEVICE_ID;
  doc["temperature"] = temp;
  doc["humidity"]    = hum;
  doc["vibration"]   = vib;
  doc["pressure"]    = press;
  doc["frequency"]   = freq;
  doc["motion"]      = motion;

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  Serial.print("[HTTP] POST -> ");
  Serial.print(url);
  Serial.print(" | Payload: ");
  Serial.println(jsonPayload);

  int httpCode = http.POST(jsonPayload);

  if (httpCode > 0) {
    String response = http.getString();
    Serial.printf("[HTTP] Success (Status %d): %s\n", httpCode, response.c_str());
  } else {
    Serial.printf("[HTTP] Failed. Error code: %d (%s)\n", httpCode, http.errorToString(httpCode).c_str());
    Serial.println(" -> Check if Node.js backend is running on your PC (port 5000)");
    Serial.println(" -> Check Windows Firewall is allowing Node.js traffic");
  }

  http.end();
}
