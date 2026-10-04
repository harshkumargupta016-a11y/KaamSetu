const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

let errors = [];

// 1. Verify JS script tags syntax
const scriptMatches = html.match(/<script>([\s\S]*?)<\/script>/gi);
if (!scriptMatches || scriptMatches.length === 0) {
  errors.push('No script tags found in index.html');
} else {
  scriptMatches.forEach((s, i) => {
    const code = s.replace(/<\/?script>/gi, '');
    try {
      new Function(code);
    } catch (err) {
      errors.push(`Script tag #${i} syntax error: ${err.message}`);
    }
  });
}

// 2. Check essential DOM IDs for all requested modules
const requiredIds = [
  'modal', 'v-company', 'v-seeker', 'v-admin',
  'page-vacancies', 'vacancies-grid-view', 'map', 'verification-directory',
  'verificationAccess', 'verificationEmployerView', 'verifCandidatesGrid',
  'page-schemes', 'schemesGrid', 'schemeDetailModal',
  'page-ai', 'drop', 'file', 'rt', 'role', 'scanb', 'out',
  'page-help', 'chatbox', 'chatinput', 'voicewidget'
];

requiredIds.forEach(id => {
  if (!html.includes(`id="${id}"`)) {
    errors.push(`Missing DOM ID: ${id}`);
  }
});

if (html.includes('id="page-verification"')) {
  errors.push('EPFO/ESIC verification should be embedded in the vacancies page, not a separate page');
}

const vacanciesPageStart = html.indexOf('id="page-vacancies"');
const verificationSectionStart = html.indexOf('id="verification-directory"');
const nextPageStart = html.indexOf('id="page-complain"');
if (verificationSectionStart < vacanciesPageStart || verificationSectionStart > nextPageStart) {
  errors.push('Verification directory should be inside the vacancies page');
}

['verification-directory', 'verificationAccess', 'verificationEmployerView', 'verif_q', 'verif_loc', 'chk_epfo', 'chk_esic', 'chk_avail', 'verif_exp', 'verifCandidatesGrid'].forEach(id => {
  const count = (html.match(new RegExp(`id="${id}"`, 'g')) || []).length;
  if (count !== 1) errors.push(`Expected one ${id} element, found ${count}`);
});

if (!html.includes("const isVerificationRequest = p === 'verification'") || !html.includes("p = 'vacancies'")) {
  errors.push('Verification shortcuts should open the combined vacancies page');
}

// 3. Check essential JS functions
const requiredFunctions = [
  'openM', 'login', 'show', 'showPage',
  'renderVacancies', 'updateLeafletMap', 'applyVacancy',
  'renderSchemes', 'showSchemeDetails', 'filterSchemes',
  'callGeminiAPI', 'toggleSpeak', 'toggleVoiceListen',
  'renderCharts', 'initFlowAndCounters'
];

requiredFunctions.forEach(fn => {
  if (!html.includes(fn)) {
    errors.push(`Missing function: ${fn}`);
  }
});

if (errors.length > 0) {
  console.error('VERIFICATION FAILED:', errors);
  process.exit(1);
} else {
  console.log('VERIFICATION PASSED: All JavaScript blocks parse cleanly and all required modules/DOM elements are intact.');
}
