const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'calculators');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts');

const map = {};
for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const slugMatch = content.match(/slug:\s*["']([^"']+)["']/);
  const catMatch = content.match(/categorySlug:\s*["']([^"']+)["']/);
  if (slugMatch && catMatch) {
    map[slugMatch[1]] = catMatch[1];
  }
}

fs.writeFileSync(
  path.join(__dirname, '..', 'redirect-map.json'),
  JSON.stringify(map)
);
console.log(`Generated ${Object.keys(map).length} redirect entries`);
