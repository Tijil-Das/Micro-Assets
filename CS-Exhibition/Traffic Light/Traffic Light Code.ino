// Define LED pins
const int redLedPin = 4;        // Pin connected to the red LED
const int yellowLedPin = 3;     // Pin connected to the yellow LED
const int greenLedPin = 2;      // Pin connected to the green LED

void setup() {
  // Initialize LED pins as outputs
  pinMode(redLedPin, OUTPUT);     // Set red LED pin as output
  pinMode(yellowLedPin, OUTPUT);  // Set yellow LED pin as output
  pinMode(greenLedPin, OUTPUT);   // Set green LED pin as output
}

void loop() {
  // Red light
  digitalWrite(redLedPin, HIGH);     // Turn on red LED
  digitalWrite(yellowLedPin, LOW);    // Turn off yellow LED
  digitalWrite(greenLedPin, LOW);     // Turn off green LED
  delay(5000);                       // Wait for 5 seconds

  // Yellow light
  digitalWrite(redLedPin, LOW);      // Turn off red LED
  digitalWrite(yellowLedPin, HIGH);   // Turn on yellow LED
  digitalWrite(greenLedPin, LOW);     // Turn off green LED
  delay(2000);                       // Wait for 2 seconds

  // Green light
  digitalWrite(redLedPin, LOW);      // Turn off red LED
  digitalWrite(yellowLedPin, LOW);    // Turn off yellow LED
  digitalWrite(greenLedPin, HIGH);    // Turn on green LED
  delay(5000);                       // Wait for 5 seconds
}
