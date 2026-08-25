const fs = require('fs');

function splitFile(filepath, outputDir, parts) {
  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n');

  parts.forEach(part => {
    // lines array is 0-indexed. 
    // part.startLine is 1-indexed. part.endLine is 1-indexed.
    const slice = lines.slice(part.start - 1, part.end).join('\n');
    fs.writeFileSync(`${outputDir}/${part.filename}`, slice + (part.end !== lines.length ? '\n' : ''));
    console.log(`Created ${outputDir}/${part.filename} (${part.start} - ${part.end})`);
  });
}

// index.html parts
const htmlParts = [
  { filename: '01_head.html', start: 1, end: 23 },
  { filename: '02_header.html', start: 24, end: 88 },
  { filename: '03_hero.html', start: 89, end: 104 },
  { filename: '04_nav_categories.html', start: 105, end: 326 },
  { filename: '05_toolbar.html', start: 327, end: 439 },
  { filename: '06_main_grids.html', start: 440, end: 658 },
  { filename: '07_modals.html', start: 659, end: 1497 },
  { filename: '08_footer.html', start: 1498, end: 1543 }
];
splitFile('index.html', 'src/html', htmlParts);

// app.js parts
const jsLines = fs.readFileSync('js/app.js', 'utf8').split('\n');
const jsParts = [
  { filename: '00_iife_start.js', start: 1, end: 9 },
  { filename: '01_storage.js', start: 10, end: 40 },
  { filename: '02_helpers.js', start: 41, end: 130 },
  { filename: '03_state_and_common.js', start: 131, end: 604 },
  { filename: '04_domain_activities.js', start: 605, end: 814 },
  { filename: '05_domain_gourmet.js', start: 815, end: 1045 },
  { filename: '06_domain_stays.js', start: 1046, end: 1249 },
  { filename: '07_domain_shopping.js', start: 1250, end: 1556 },
  { filename: '08_domain_currency.js', start: 1557, end: 2053 },
  { filename: '09_domain_spa.js', start: 2054, end: 2325 },
  { filename: '10_domain_guide.js', start: 2326, end: 2897 },
  { filename: '11_registry.js', start: 2898, end: 3098 },
  { filename: '12_routing_events.js', start: 3099, end: 3500 },
  { filename: '13_bootstrap_and_export.js', start: 3501, end: jsLines.length - 1 },
  { filename: '99_iife_end.js', start: jsLines.length, end: jsLines.length }
];
splitFile('js/app.js', 'src/js', jsParts);

console.log('Split completed successfully.');
