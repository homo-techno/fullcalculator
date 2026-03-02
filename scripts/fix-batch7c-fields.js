// Fix batch7-c.js: convert object field definitions to string field definitions
const fs = require('fs');

let content = fs.readFileSync('scripts/batch7-c.js', 'utf8');

// Replace field objects with string representations
// Pattern: { name: "x", label: "Y", type: "number", ... }
// Need to wrap in quotes: '{ name: "x", label: "Y", type: "number", ... }'

// Match lines that start with "    { name:" (field definition lines inside arrays)
content = content.replace(/^(\s+)(\{ name: .+\}),?$/gm, (match, indent, obj) => {
  // Wrap the object literal in single quotes to make it a string
  return indent + "'" + obj + "',";
});

fs.writeFileSync('scripts/batch7-c.js', content);
console.log('Fixed field definitions in batch7-c.js');

// Verify
const fixed = fs.readFileSync('scripts/batch7-c.js', 'utf8');
const stringFields = (fixed.match(/'{ name:/g) || []).length;
const objectFields = (fixed.match(/[^']{ name:/g) || []).length;
console.log('String fields:', stringFields);
console.log('Object fields:', objectFields);
