const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const scriptCode = scriptMatches.map(m => m[1]).join('\n');

const elements = {};
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
  localStorage: { getItem: function() { return null; } }
};

const context = vm.createContext({
  document: mockDocument,
  window: mockWindow,
  addEventListener: mockWindow.addEventListener,
  scrollTo: mockWindow.scrollTo,
  IntersectionObserver: mockWindow.IntersectionObserver,
  speechSynthesis: mockWindow.speechSynthesis,
  localStorage: mockWindow.localStorage,
  console: console,
  setTimeout: setTimeout,
  clearInterval: clearInterval,
  setInterval: function() { return 1; }
});

try {
  vm.runInContext(scriptCode, context);

  // Test 1: Company Login
  console.log("Testing Company Login...");
  context.openM('Company Login', 'Company email');
  mockDocument.querySelector('#mname').value = "Shree Power Works";
  mockDocument.querySelector('#mphone').value = "hr@shreepower.com";
  mockDocument.querySelector('#motp').value = "123456";
  context.login();

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
  context.login();

  console.log("Seeker view hidden:", mockDocument.querySelector('#v-seeker').hidden);
  console.log("Header title:", mockDocument.querySelector('#apt').textContent);

  if (mockDocument.querySelector('#app').hidden || mockDocument.querySelector('#v-seeker').hidden || !mockDocument.querySelector('#apt').textContent.includes("Harsh Kumar")) {
    console.error("TEST FAILED: Job Seeker Dashboard not displayed with user name!");
    process.exit(1);
  }

  // Test 3: Admin Login
  console.log("Testing Admin Login...");
  context.openM('Admin Login', 'Admin ID');
  mockDocument.querySelector('#mphone').value = "admin@kaamsetu.gov.in";
  mockDocument.querySelector('#motp').value = "admin123";
  context.login();

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
