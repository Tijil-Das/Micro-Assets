# 🤖 Computer Science Exhibition — Robotics & Embedded Systems

> **Teachers Readiness Programme: Robotics and AI**  
> Council for the Indian School Certificate Examinations (CISCE) & Technology Innovation Hub of IIT Delhi (IHFC)  
> Session: June 2024  

---

## 📖 Background & Overview

This project was built for my school's **Computer Science Exhibition** during my **12th Standard**. Our team was assigned the topic of building an **Obstacle Avoidance Car (Autonomous Robot)**.

The initiative was part of the *Teachers Readiness Programme on Robotics and AI*, organized jointly by the **Council for the Indian School Certificate Examinations (CISCE)** and the **Technology Innovation Hub of IIT Delhi (IHFC)**, guided by Dr. Venkat Bokka and Ms. Mrinmoyee Choudhuri.

The exhibition highlighted hands-on embedded computing and autonomous robotics:
- **Obstacle Avoidance Car:** An autonomous robot using an Arduino Uno R3, an HC-SR04 ultrasonic distance sensor mounted on an SG90 servo motor for active environment scanning, and an L298N dual H-bridge motor driver to steer DC geared motors around detected obstacles in real-time.
- **Traffic Light System:** A complementary embedded demonstration showcasing sequential state timing, LED current regulation, and automated signal cycling.

This folder archives the full project worksheets, step-by-step assembly guides, visual wiring diagrams, and verbatim Arduino sketch source code.

---

## 📂 Projects Catalog

| Project | Description | Primary Hardware | Documentation & Sketch |
|---|---|---|---|
| [**Obstacle Avoidance Robot**](./Obstacle%20Avoidance%20Robot) | Autonomous wheeled robot using ultrasonic ranging to detect obstacles, scan clear paths via a servo motor, and navigate dynamically. | Arduino Uno R3, HC-SR04, SG90 Servo, L298N Motor Driver, DC Gear Motors | 📄 [Content Guide](./Obstacle%20Avoidance%20Robot/Content.md)<br>⚡ [`Arduino Code.ino`](./Obstacle%20Avoidance%20Robot/Arduino%20Code.ino)<br>🖼️ [Wiring Diagram](./Obstacle%20Avoidance%20Robot/Wiring.png) |
| [**Traffic Light System**](./Traffic%20Light) | Microcontroller-driven traffic signal simulation replicating realistic three-state light cycles (Stop, Prepare, Go) with precise delay intervals. | Arduino Uno R3, Red/Yellow/Green LEDs, $220\,\Omega$ Resistors | 📄 [Content Guide](./Traffic%20Light/Content.md)<br>⚡ [`Arduino Code.ino`](./Traffic%20Light/Arduino%20Code.ino)<br>🖼️ [Wiring Diagram](./Traffic%20Light/Wiring.png) |

---

## 🛠️ Structure per Project

Every project folder follows a consistent, self-contained structure:
- **`Content.md`**: Complete documentation covering objective, component bill of materials, step-by-step wiring procedure, circuit assembly, flowchart/state logic, and verbatim Arduino source code.
- **`Arduino Code.ino`**: Standalone Arduino sketch ready for compilation and flashing via the Arduino IDE.
- **`Wiring.png`**: High-resolution, color-coded visual wiring diagram.
