const fs = require('fs');

const content = fs.readFileSync('scripts/batch7-c.js', 'utf8');
const lines = content.split('\n');
let result = [];
let inCalcBody = false;
let braceDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detect start of unwrapped calcBody: "  (inputs) =>"
  if (/^  \(inputs\) =>/.test(line) && !line.startsWith('  `')) {
    result.push('  `' + line);
    inCalcBody = true;
    braceDepth = 0;
    for (const ch of line) {
      if (ch === '{') braceDepth++;
      if (ch === '}') braceDepth--;
    }
    continue;
  }

  if (inCalcBody) {
    for (const ch of line) {
      if (ch === '{') braceDepth++;
      if (ch === '}') braceDepth--;
    }
    if (braceDepth <= 0) {
      result.push(line + '`');
      inCalcBody = false;
    } else {
      result.push(line);
    }
    continue;
  }

  result.push(line);
}

fs.writeFileSync('scripts/batch7-c.js', result.join('\n'));
console.log('Fixed batch7-c.js');
const fixed = fs.readFileSync('scripts/batch7-c.js', 'utf8');
const count = (fixed.match(/`\(inputs\)/g) || []).length;
console.log('Backtick-wrapped calcBodies:', count);
