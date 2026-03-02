// Fix batch7-c.js: The args order is add(slug, title, desc, cat, WRONG_CS, WRONG_ICON, kw, ...)
// Currently: arg5=icon("$"), arg6="Calculator"
// Need: arg5=categorySlug, arg6=icon
// Also some have "Finance" -> cs should be "finance", icon "$"
// Others have "Everyday" -> cs should be "everyday", icon "~"
// Others have "Science" -> cs should be "science", icon "A"

const fs = require('fs');
let lines = fs.readFileSync('scripts/batch7-c.js', 'utf8').split('\n');

// Find all add() calls and fix the cs/icon args
let i = 0;
let fixCount = 0;
while (i < lines.length) {
  if (lines[i].startsWith('add(')) {
    // Lines: add(  [0]
    //   slug,     [+1]
    //   title,    [+2]
    //   desc,     [+3]
    //   cat,      [+4]
    //   cs,       [+5]  <- currently icon like "$"
    //   icon,     [+6]  <- currently "Calculator"
    //   kw,       [+7]

    // Get category from line +4
    const catLine = lines[i + 4];
    const catMatch = catLine.match(/"(\w+)"/);
    if (catMatch) {
      const cat = catMatch[1];
      let cs, icon;
      if (cat === 'Finance') { cs = 'finance'; icon = '$'; }
      else if (cat === 'Everyday') { cs = 'everyday'; icon = '~'; }
      else if (cat === 'Science') { cs = 'science'; icon = 'A'; }
      else if (cat === 'Math') { cs = 'math'; icon = '+'; }
      else if (cat === 'Health') { cs = 'health'; icon = 'H'; }
      else if (cat === 'Conversion') { cs = 'conversion'; icon = 'R'; }
      else { cs = cat.toLowerCase(); icon = '~'; }

      lines[i + 5] = `  "${cs}",`;
      lines[i + 6] = `  "${icon}",`;
      fixCount++;
    }
  }
  i++;
}

fs.writeFileSync('scripts/batch7-c.js', lines.join('\n'));
console.log('Fixed', fixCount, 'add() calls');
