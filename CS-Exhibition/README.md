# 🤖 Computer Science Exhibition — Robotics & Embedded Systems

> **Teachers Readiness Programme: Robotics and AI**  
> Council for the Indian School Certificate Examinations (CISCE) & Technology Innovation Hub of IIT Delhi (IHFC)  
> Session: June 2024  

---

## 📖 Background & Overview

These projects were part of my school's **Computer Science Exhibition** during my **12th Standard**. 

Our class was divided into specialized project teams:
- **Our Group (4 Members):** We were assigned the flagship topic of building the **Obstacle Avoidance Car (Autonomous Robot)**. Our 4-member team designed and constructed the wheeled robot using an Arduino Uno R3, an HC-SR04 ultrasonic distance sensor mounted on an SG90 servo motor for active angular scanning, and an L298N dual H-bridge motor driver to navigate and steer DC geared motors dynamically away from detected obstacles in real-time.
- **Peer Group:** Another group from our same class was assigned to build the **Traffic Light System**, demonstrating microcontroller state sequencing, LED current regulation using $220\,\Omega$ resistors, and automated signal cycling.

The initiative was conducted under the *Teachers Readiness Programme on Robotics and AI*, organized jointly by the **Council for the Indian School Certificate Examinations (CISCE)** and the **Technology Innovation Hub of IIT Delhi (IHFC)**, mentored by Dr. Venkat Bokka and Ms. Mrinmoyee Choudhuri.

This folder archives the complete project worksheets, step-by-step assembly guides, visual wiring diagrams, and verbatim Arduino sketch source code for both exhibition demonstrations.

---

## 📂 Projects Catalog

| Project | Description | Primary Hardware | Documentation & Sketch |
|---|---|---|---|
| [**Obstacle Avoidance Robot**](./Obstacle%20Avoidance%20Robot) | Autonomous wheeled robot using ultrasonic ranging to detect obstacles, scan clear paths via a servo motor, and navigate dynamically. Built by our 4-member team. | Arduino Uno R3, HC-SR04, SG90 Servo, L298N Motor Driver, DC Gear Motors | 📄 [Content Guide](./Obstacle%20Avoidance%20Robot/Content.md)<br>⚡ [`Arduino Code.ino`](./Obstacle%20Avoidance%20Robot/Arduino%20Code.ino)<br>🖼️ [Wiring Diagram](./Obstacle%20Avoidance%20Robot/Wiring.png) |
| [**Traffic Light System**](./Traffic%20Light) | Microcontroller-driven traffic signal simulation replicating realistic three-state light cycles (Stop, Prepare, Go) with precise delay intervals. Built by a peer group in our class. | Arduino Uno R3, Red/Yellow/Green LEDs, $220\,\Omega$ Resistors | 📄 [Content Guide](./Traffic%20Light/Content.md)<br>⚡ [`Arduino Code.ino`](./Traffic%20Light/Arduino%20Code.ino)<br>🖼️ [Wiring Diagram](./Traffic%20Light/Wiring.png) |

---

## 🛠️ Structure per Project

Every project folder follows a consistent, self-contained structure:
- **`Content.md`**: Complete documentation covering objective, component bill of materials, step-by-step wiring procedure, circuit assembly, flowchart/state logic, and verbatim Arduino source code.
- **`Arduino Code.ino`**: Standalone Arduino sketch ready for compilation and flashing via the Arduino IDE.
- **`Wiring.png`**: High-resolution, color-coded visual wiring diagram.
