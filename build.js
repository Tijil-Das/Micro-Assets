const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'CS-Exhibition', 'Obstacle Avoidance Robot', 'Website');
const rootDist = path.join(__dirname, 'dist');
const robotDist = path.join(__dirname, 'CS-Exhibition', 'Obstacle Avoidance Robot', 'dist');
const websiteDist = path.join(src, 'dist');

try {
  // 1. Build clean root dist without nested dist
  fs.rmSync(rootDist, { recursive: true, force: true });
  fs.cpSync(src, rootDist, { 
    recursive: true, 
    filter: (source) => !source.includes(path.sep + 'dist') 
  });

  // 2. Sync to subfolder dists so Cloudflare Pages succeeds with ANY root directory setting
  fs.rmSync(robotDist, { recursive: true, force: true });
  fs.cpSync(rootDist, robotDist, { recursive: true });

  fs.rmSync(websiteDist, { recursive: true, force: true });
  fs.cpSync(rootDist, websiteDist, { recursive: true });

  console.log('Successfully built: synced website to all 3 dist locations');
} catch (err) {
  console.error('Build error:', err);
  process.exit(1);
}

