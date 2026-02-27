const fs = require('fs');
const path = require('path');
const INDEX = path.join(__dirname, '..', 'src', 'calculators', 'index.ts');
const newImports = fs.readFileSync(path.join(__dirname, 'new-imports-b.txt'), 'utf8').trim();
const newRegs = fs.readFileSync(path.join(__dirname, 'new-regs-b.txt'), 'utf8').trim();
let c = fs.readFileSync(INDEX, 'utf8');
const el = 'export const calculators: CalculatorDefinition[] = [';
const ei = c.indexOf(el);
c = c.slice(0, ei) + '\n' + newImports + '\n\n' + c.slice(ei);
const nei = c.indexOf(el) + el.length;
const ci = c.indexOf('\n];', nei);
c = c.slice(0, ci) + '\n' + newRegs + '\n' + c.slice(ci);
// Dedup
const lines = c.split('\n'); const seen = new Set(); const rm = new Set();
for (let i=0;i<lines.length;i++){const t=lines[i].trim();if(t.startsWith('import {')){if(seen.has(t))rm.add(i);else seen.add(t);}}
const f = lines.filter((_,i) => !rm.has(i));
fs.writeFileSync(INDEX, f.join('\n'));
console.log(`Lines: ${f.length}, deduped: ${rm.size}`);
