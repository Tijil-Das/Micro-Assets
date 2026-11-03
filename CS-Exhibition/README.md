# 🤖 Computer Science Exhibition — Robotics & Embedded Systems

> **Teachers Readiness Programme: Robotics and AI**  
> Council for the Indian School Certificate Examinations (CISCE) & Technology Innovation Hub of IIT Delhi (IHFC)  
> Session: June 2024  

This directory contains standalone robotics and embedded systems projects developed for exhibition and educational demonstrations. Each project includes complete circuit wiring diagrams, step-by-step assembly guides, operating logic, and upload-ready Arduino sketches.

---

## 📂 Projects Catalog

| Project | Description | Primary Hardware | Documentation & Sketch |
|---|---|---|---|
| [**Obstacle Avoidance Robot**](./Obstacle%20Avoidance%20Robot) | Autonomous wheeled robot using ultrasonic ranging to detect obstacles, scan clear paths via a servo motor, and navigate dynamically. | Arduino Uno R3, HC-SR04, SG90 Servo, L298N Motor Driver, DC Gear Motors | 📄 [Content Guide](./Obstacle%20Avoidance%20Robot/Content.md)<br>⚡ [`Obstacle Avoidance Robot.ino`](./Obstacle%20Avoidance%20Robot/Obstacle%20Avoidance%20Robot.ino)<br>🖼️ [Wiring Diagram](./Obstacle%20Avoidance%20Robot/Wiring.png) |
| [**Traffic Light System**](./Traffic%20Light) | Microcontroller-driven traffic signal simulation replicating realistic three-state light cycles (Stop, Prepare, Go) with precise delay intervals. | Arduino Uno R3, Red/Yellow/Green LEDs, $220\,\Omega$ Resistors | 📄 [Content Guide](./Traffic%20Light/Content.md)<br>⚡ [`Traffic Light Code.ino`](./Traffic%20Light/Traffic%20Light%20Code.ino)<br>🖼️ [Wiring Diagram](./Traffic%20Light/Wiring.png) |

---

## 🛠️ Structure per Project

Every project folder follows a consistent, self-contained structure:
- **`Content.md`**: Complete documentation covering objective, component bill of materials, step-by-step wiring procedure, circuit assembly, flowchart/state logic, and full source code.
- **`*.ino`**: Standalone Arduino sketch ready for compilation and flashing via the Arduino IDE.
- **`Wiring.png`**: High-resolution, color-coded visual wiring diagram.
