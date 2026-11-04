const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'CS-Exhibition', 'Obstacle Avoidance Robot', 'Website');
const dest = path.join(__dirname, 'dist');

try {
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log('Successfully built: copied Website to dist/');
} catch (err) {
  console.error('Build error:', err);
  process.exit(1);
}

