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
  fs.mkdirSync(distDir, { recursive: true });

  const entries = fs.readdirSync(websiteDir);
  for (const entry of entries) {
    if (entry === 'dist' || entry === 'node_modules' || entry === '.git') continue;
    const srcPath = path.join(websiteDir, entry);
    const dstPath = path.join(distDir, entry);
    fs.cpSync(srcPath, dstPath, { recursive: true });
  }

  console.log('Successfully built static assets into ' + distDir);
} catch (err) {
  console.error('Build error:', err);
  process.exit(1);
}
