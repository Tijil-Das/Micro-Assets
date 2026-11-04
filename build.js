const fs = require('fs');
const path = require('path');

// Determine directories
let websiteDir = null;
const searchPaths = [
  path.join(__dirname, 'CS-Exhibition', 'Obstacle Avoidance Robot', 'Website'),
  path.join(__dirname, 'Website'),
  __dirname
];

for (const p of searchPaths) {
  if (fs.existsSync(path.join(p, 'index.html')) && fs.existsSync(path.join(p, 'app.js'))) {
    websiteDir = p;
    break;
  }
}

if (!websiteDir) {
  console.error('Could not locate Website directory');
  process.exit(1);
}

const distDir = path.join(__dirname, 'dist');

try {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.cpSync(websiteDir, distDir, {
    recursive: true,
    filter: (source) => !source.includes(path.sep + 'dist')
  });
  console.log('Successfully built static assets into ' + distDir);
} catch (err) {
  console.error('Build error:', err);
  process.exit(1);
}
