const fs = require('fs');
const path = require('path');

const baseUrl = 'https://fullcalculator.com';
const calcDir = path.join(__dirname, '..', 'src', 'calculators');
const today = new Date().toISOString().split('T')[0];

// Read all calculator files to get slug and categorySlug
const entries = [];
for (const file of fs.readdirSync(calcDir).filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts')) {
  const content = fs.readFileSync(path.join(calcDir, file), 'utf8');
  const slugMatch = content.match(/slug:\s*"([^"]+)"/);
  const catMatch = content.match(/categorySlug:\s*"([^"]+)"/);
  if (slugMatch && catMatch) {
    entries.push({ slug: slugMatch[1], cat: catMatch[1] });
  }
}

const categories = ['math', 'finance', 'health', 'everyday', 'science', 'conversion'];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
xml += `  <url><loc>${baseUrl}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n`;

for (const cat of categories) {
  xml += `  <url><loc>${baseUrl}/${cat}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n`;
}

for (const e of entries) {
  xml += `  <url><loc>${baseUrl}/${e.cat}/${e.slug}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
}

xml += `</urlset>\n`;
fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), xml);
console.log(`Sitemap generated: ${entries.length} calculators + ${categories.length} categories + 1 homepage`);
