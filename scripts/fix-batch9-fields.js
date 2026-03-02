// Fix batch9-a.js and batch9-b.js: convert concatenated string fields to arrays
const fs = require('fs');

function fixFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');

  // Pattern: fields are like:
  //   '{ name: "x", ... },' +
  //   '{ name: "y", ... },' +
  //   '{ name: "z", ... }',
  // Need to convert to:
  //   [
  //     '{ name: "x", ... }',
  //     '{ name: "y", ... }',
  //     '{ name: "z", ... }',
  //   ],

  // Strategy: find sequences of lines that are string field definitions
  const lines = content.split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if this line starts a field string (indented '{ name: ...)
    if (/^\s+'{ name:/.test(line) && (line.includes("' +") || line.includes("',") || line.trimEnd().endsWith("'"))) {
      // Start collecting field lines
      const fieldStrings = [];
      let indent = line.match(/^(\s+)/)[1];

      while (i < lines.length) {
        const fline = lines[i].trimEnd();

        if (/^\s+'{ name:/.test(fline)) {
          // Extract the field string - remove trailing ' + or ',
          let field = fline.trim();
          if (field.endsWith("' +")) {
            field = field.slice(0, -3).trim();
          } else if (field.endsWith("',")) {
            field = field.slice(0, -2).trim();
          } else if (field.endsWith("'")) {
            // Last field without comma
          }
          // Ensure it ends with }'
          if (!field.endsWith("}'")) {
            field = field + "'";
          }
          fieldStrings.push(field);
          i++;
        } else {
          break;
        }
      }

      // Output as array
      result.push(indent + '[');
      for (let j = 0; j < fieldStrings.length; j++) {
        result.push(indent + '  ' + fieldStrings[j] + ',');
      }
      result.push(indent + '],');

    } else {
      result.push(line);
      i++;
    }
  }

  fs.writeFileSync(filename, result.join('\n'));
  console.log('Fixed', filename);
}

fixFile('scripts/batch9-a.js');
fixFile('scripts/batch9-b.js');
