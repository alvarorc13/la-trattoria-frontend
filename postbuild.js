const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'vercel.json');
const dest = path.join(__dirname, 'dist', 'la-trattoria-frontend', 'vercel.json');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('vercel.json copiado a dist/la-trattoria-frontend');
} else {
  console.error('No se encontró vercel.json en la raíz');
  process.exit(1);
}
