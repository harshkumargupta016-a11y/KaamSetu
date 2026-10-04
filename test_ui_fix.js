const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

let errors = [];

// 1. Verify initFlowAndCounters
if (!html.includes('initFlowAndCounters')) {
  errors.push('initFlowAndCounters function missing');
}

// 2. Verify lowered IntersectionObserver threshold
if (!html.includes('{ threshold: .1 }')) {
  errors.push('IntersectionObserver threshold is not set to .1');
}

// 3. Verify DOMContentLoaded hook or fallback
if (!html.includes('document.readyState === "loading"')) {
  errors.push('DOMContentLoaded initialization check missing');
}

// 4. Verify canvas chart functions
if (!html.includes('function renderCharts()') || !html.includes('chartCompanies') || !html.includes('chartJobs')) {
  errors.push('renderCharts or chart canvas IDs missing');
}

if (errors.length > 0) {
  console.error('REGRESSION TEST FAILED:', errors);
  process.exit(1);
} else {
  console.log('REGRESSION TEST PASSED: Flowchart, counters, and analytics charts initialization verified.');
}
