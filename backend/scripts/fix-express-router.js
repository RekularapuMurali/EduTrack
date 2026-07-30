const fs = require('fs');
const path = require('path');

const routerJs = path.resolve(__dirname, '..', 'node_modules', 'express', 'lib', 'router.js');
const routerIndex = path.resolve(__dirname, '..', 'node_modules', 'express', 'lib', 'router', 'index.js');

if (!fs.existsSync(routerIndex)) {
  console.warn('Express router index not found:', routerIndex);
  process.exit(0);
}

if (!fs.existsSync(routerJs)) {
  fs.writeFileSync(routerJs, "module.exports = require('./router/index.js');\n", 'utf8');
  console.log('Created shim file:', routerJs);
} else {
  console.log('Shim file already exists:', routerJs);
}
