const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function buildFile(srcDir, outputFile) {
  if (!fs.existsSync(srcDir)) {
    console.error(`Directory not found: ${srcDir}`);
    return;
  }

  const files = fs.readdirSync(srcDir)
    .filter(f => f.endsWith('.html') || f.endsWith('.js'))
    .sort(); // Sorting is critical so 01_, 02_ etc. are in order

  console.log(`\nBuilding ${outputFile} from ${files.length} files in ${srcDir}...`);
  
  let combinedContent = '';
  for (const file of files) {
    const filePath = path.join(srcDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    combinedContent += content;
    // ensure trailing newline to avoid joining issues
    if (!combinedContent.endsWith('\n')) {
      combinedContent += '\n';
    }
  }

  fs.writeFileSync(outputFile, combinedContent, 'utf8');
  console.log(`✅ Successfully built ${outputFile} (${combinedContent.length} bytes)`);
}

// 1. Build index.html
buildFile('src/html', 'index.html');

// 2. Build js/app.js
buildFile('src/js', 'js/app.js');

// 3. Run build-counts.js automatically
console.log('\nRunning build-counts.js to update badge numbers...');
try {
  const output = execSync('node build-counts.js', { encoding: 'utf8' });
  console.log(output);
  console.log('🎉 Build completed successfully!');
} catch (error) {
  console.error('❌ Error running build-counts.js:', error.message);
  process.exit(1);
}
