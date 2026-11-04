/* ===================================================================
   OBSTACLE AVOIDANCE CAR — WORKER & FEEDBACK CONFIGURATION
   Set your Cloudflare Worker endpoint and authentication passcode here.
   =================================================================== */

window.ROBOT_CONFIG = {
  // 1. Paste your deployed Cloudflare Worker URL here:
  workerUrl: "https://obstacle-car-feedback-worker.tijil.workers.dev",

  // 2. Set the passcode matching the PASSCODE variable in your Cloudflare Worker:
  passcode: "aloysius-robotics-2026",

  // 3. Relative path to the feedbacks JSON database
  dataPath: "./Data/feedbacks.json"
};
