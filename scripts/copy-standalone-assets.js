const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source directory ${src} does not exist, skipping.`);
    return;
  }
  try {
    fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
    console.log(`Successfully copied ${src} to ${dest}`);
  } catch (err) {
    console.error(`Error copying ${src} to ${dest}:`, err.message);
  }
}

// Destination paths
const standaloneNext = path.join(__dirname, '../.next/standalone/.next');
const standalonePublic = path.join(__dirname, '../.next/standalone/public');

// Source paths
const sourceStatic = path.join(__dirname, '../.next/static');
const sourcePublic = path.join(__dirname, '../public');

console.log('Starting postbuild standalone asset copy...');

// Copy .next/static to .next/standalone/.next/static
copyDir(sourceStatic, path.join(standaloneNext, 'static'));

// Copy public to .next/standalone/public
copyDir(sourcePublic, standalonePublic);

console.log('Standalone asset copy completed!');
