const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

// Caminhos para limpar
const paths = [
  '.next',
  'node_modules/.cache'
];

console.log('Limpando cache do Next.js...');

paths.forEach(cachePath => {
  const fullPath = path.join(__dirname, cachePath);
  if (fs.existsSync(fullPath)) {
    console.log(`Removendo ${fullPath}...`);
    rimraf.sync(fullPath);
  }
});

console.log('Cache limpo com sucesso!');
console.log('Execute "npm install" e depois "npm run dev" para reiniciar o projeto.');
