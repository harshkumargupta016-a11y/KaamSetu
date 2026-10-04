const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const scriptCode = scriptMatches.map(m => m[1]).join('\n');

const elements = {};
const localStorageData = {};
function getOrCreateElement(id) {
  if (!elements[id]) {
    elements[id] = {
      id,
      value: '',
      textContent: '',
      innerHTML: '',
      hidden: true,
      classList: {
        add: function(cls) { this[cls] = true; },
        remove: function(cls) { this[cls] = false; },
        contains: function(cls) { return !!this[cls]; }
      },
      setAttribute: function() {},
      style: {},
      addEventListener: function() {},
      focus: function() {},
      scrollIntoView: function() {},
      getContext: function() {
        return {
          strokeStyle: '',
          lineWidth: 0,
          beginPath: function() {},
          moveTo: function() {},
          lineTo: function() {},
          stroke: function() {},
          fillStyle: '',
          fillRect: function() {},
          fillText: function() {},
          font: '',
          clearRect: function() {},
          arc: function() {},
          fill: function() {}
        };
      }
    };
  }
  return elements[id];
}

const mockDocument = {
  documentElement: { lang: 'en' },
  querySelector: function(selector) {
    if (selector.startsWith('#')) {
      return getOrCreateElement(selector.slice(1));
    }
    return getOrCreateElement(selector);
  },
  querySelectorAll: function() { return []; },
  getElementById: function(id) { return getOrCreateElement(id); }
};

const mockWindow = {
  document: mockDocument,
  addEventListener: function() {},
  scrollTo: function() {},
  IntersectionObserver: function() { return { observe: function() {}, unobserve: function() {} }; },
  speechSynthesis: { cancel: function() {}, speak: function() {} },
  localStorage: {
    getItem: function(key) { return Object.prototype.hasOwnProperty.call(localStorageData, key) ? localStorageData[key] : null; },
    setItem: function(key, value) { localStorageData[key] = String(value); }
  }
};

const context = vm.createContext({
  document: mockDocument,
  window: mockWindow,
  addEventListener: mockWindow.addEventListener,
  scrollTo: mockWindow.scrollTo,
  IntersectionObserver: mockWindow.IntersectionObserver,
  speechSynthesis: mockWindow.speechSynthesis,
  localStorage: mockWindow.localStorage,
  navigator: {},
  console: console,
  setTimeout: setTimeout,
  clearInterval: clearInterval,
  setInterval: function() { return 1; }
});

async function run() {
try {
  vm.runInContext(scriptCode, context);

  // Test 1: Company Login
  console.log("Testing Company Login...");
  context.openM('Company Login', 'Company email');
  mockDocument.querySelector('#mname').value = "Shree Power Works";
  mockDocument.querySelector('#mphone').value = "hr@shreepower.com";
  mockDocument.querySelector('#motp').value = "123456";
  await context.login();

  console.log("App hidden:", mockDocument.querySelector('#app').hidden);
  console.log("Company view hidden:", mockDocument.querySelector('#v-company').hidden);
  console.log("Header title:", mockDocument.querySelector('#apt').textContent);

  if (mockDocument.querySelector('#app').hidden || mockDocument.querySelector('#v-company').hidden || !mockDocument.querySelector('#apt').textContent.includes("Shree Power Works")) {
    console.error("TEST FAILED: Company Dashboard not displayed with company name!");
    process.exit(1);
  }

  // Test 2: Job Seeker Login
  console.log("Testing Job Seeker Login...");
  context.openM('Job Seeker Login', 'Mobile number');
  mockDocument.querySelector('#mname').value = "Harsh Kumar";
  mockDocument.querySelector('#mphone').value = "0123456789";
  mockDocument.querySelector('#motp').value = "123456";
  await context.login();

  console.log("Seeker view hidden:", mockDocument.querySelector('#v-seeker').hidden);
  console.log("Header title:", mockDocument.querySelector('#apt').textContent);

  if (mockDocument.querySelector('#app').hidden || mockDocument.querySelector('#v-seeker').hidden || !mockDocument.querySelector('#apt').textContent.includes("Harsh Kumar")) {
    console.error("TEST FAILED: Job Seeker Dashboard not displayed with user name!");
    process.exit(1);
  }

  // A seeker sees only their account-scoped verification summary, never the employer directory.
  let ownVerificationHtml = mockDocument.querySelector('#seekerVerificationStatus').innerHTML;
  if (!ownVerificationHtml.includes("EPFO match signal") || ownVerificationHtml.includes("Amit Verma") || ownVerificationHtml.includes("Pooja Patel")) {
    console.error("TEST FAILED: Job seeker verification panel exposed directory records or omitted personal status!");
    process.exit(1);
  }
  context.getOwnSeekerVerification().employmentHistory.push({
    company: "Harsh's Employer",
    role: "Worker",
    duration: "2024 - Present",
    epfoMatched: true,
    esicMatched: false
  });
  context.getOwnSeekerVerification().employmentHistory.push({
    company: "Second Employer",
    role: "Assistant",
    duration: "2022 - 2024",
    epfoMatched: false,
    esicMatched: true
  });
  context.renderOwnVerificationStatus();
  context.showPage('verification');
  ownVerificationHtml = mockDocument.querySelector('#seekerVerificationStatus').innerHTML;
  if (!ownVerificationHtml.includes("Harsh's Employer") || !ownVerificationHtml.includes("Second Employer") || !ownVerificationHtml.includes("EPFO: Matched") || !ownVerificationHtml.includes("ESIC: No match") || !mockDocument.querySelector('#verificationEmployerView').hidden) {
    console.error("TEST FAILED: Job seeker could not view only their own employer signals!");
    process.exit(1);
  }
  context.home();
  context.showPage('verification');
  if (mockDocument.querySelector('#app').hidden || mockDocument.querySelector('#v-seeker').hidden || !mockDocument.querySelector('#seekerVerificationStatus').innerHTML.includes("Harsh's Employer")) {
    console.error("TEST FAILED: Verification shortcut did not return the seeker to their own status panel!");
    process.exit(1);
  }

  // A different account must not inherit the first seeker's employment records.
  context.openM('Job Seeker Login', 'Mobile number');
  mockDocument.querySelector('#mname').value = "Amit Verma";
  mockDocument.querySelector('#mphone').value = "0987654321";
  mockDocument.querySelector('#motp').value = "123456";
  await context.login();
  ownVerificationHtml = mockDocument.querySelector('#seekerVerificationStatus').innerHTML;
  if (ownVerificationHtml.includes("Harsh's Employer") || ownVerificationHtml.includes("Pooja Patel")) {
    console.error("TEST FAILED: One seeker's verification record was visible to another account!");
    process.exit(1);
  }

  // Test 3: Admin Login
  console.log("Testing Admin Login...");
  context.openM('Admin Login', 'Admin ID');
  mockDocument.querySelector('#mphone').value = "admin@kaamsetu.gov.in";
  mockDocument.querySelector('#motp').value = "admin123";
  await context.login();

  console.log("Admin view hidden:", mockDocument.querySelector('#v-admin').hidden);
  console.log("Header title:", mockDocument.querySelector('#apt').textContent);

  if (mockDocument.querySelector('#app').hidden || mockDocument.querySelector('#v-admin').hidden) {
    console.error("TEST FAILED: Admin Dashboard not displayed!");
    process.exit(1);
  }

  console.log("\nALL REGRESSION TESTS PASSED!");
} catch (e) {
  console.error("TEST FAILED WITH ERROR:", e);
  process.exit(1);
}
}

run();
