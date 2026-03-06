const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'src', 'calculators');
let fixCount = 0;

for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts')) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, 'utf8');
  const lines = content.split('\n');
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    if (/^\s*formula:\s*"/.test(lines[i]) && !lines[i].trimEnd().endsWith('",') && !lines[i].trimEnd().endsWith('";')) {
      let combined = lines[i];
      let j = i + 1;
      while (j < lines.length && j < i + 10) {
        combined += '; ' + lines[j].trim();
        if (lines[j].includes('"')) {
          lines[i] = combined;
          lines.splice(i + 1, j - i);
          changed = true;
          break;
        }
        j++;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(fp, lines.join('\n'));
    fixCount++;
    console.log('Fixed:', file);
  }
}
console.log('Total fixed:', fixCount);
