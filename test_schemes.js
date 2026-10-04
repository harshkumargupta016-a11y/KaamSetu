const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

let errors = [];

if (!html.includes('function showSchemeDetails(idx)')) {
  errors.push('showSchemeDetails function is missing');
}

if (!html.includes('id="schemeDetailModal"')) {
  errors.push('schemeDetailModal element is missing');
}

if (!html.includes('View Scheme Details')) {
  errors.push('View Scheme Details button trigger is missing');
}

['eligibility', 'documents', 'howToApply'].forEach(field => {
  if (!html.includes(field + ':')) {
    errors.push('SCHEMES_DATA field ' + field + ' is missing');
  }
});

if (errors.length > 0) {
  console.error('REGRESSION TEST FAILED:', errors);
  process.exit(1);
} else {
  console.log('REGRESSION TEST PASSED: All scheme detail modal features verified.');
}
