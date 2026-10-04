const test = require("node:test");
const assert = require("node:assert/strict");
const { createAdminToken, validateSubmission, verifyAdminToken } = require("../server");

test("valid submission shapes are accepted", () => {
  assert.equal(validateSubmission({
    id: "550e8400-e29b-41d4-a716-446655440000",
    type: "complaint",
    payload: { company: "Example Co", description: "Asked for a fee" }
  }), null);
});

test("submission validation rejects unsupported, malformed, and oversized records", () => {
  const id = "550e8400-e29b-41d4-a716-446655440000";
  assert.match(validateSubmission({ id, type: "unknown", payload: {} }), /Unsupported/);
  assert.match(validateSubmission({ id: "bad-id", type: "complaint", payload: { description: "x" } }), /UUID/);
  assert.match(validateSubmission({ id, type: "complaint", payload: {} }), /description/);
  assert.match(validateSubmission({ id, type: "complaint", payload: { description: "x".repeat(33 * 1024) } }), /32 KB/);
});

test("admin bearer tokens are signed and expire", () => {
  const secret = "a sufficiently long test secret for signing tokens";
  const token = createAdminToken("admin", secret, Date.now() + 60_000);
  assert.equal(verifyAdminToken(token, secret), true);
  assert.equal(verifyAdminToken(token, "a different secret with enough bytes"), false);
  assert.equal(verifyAdminToken(createAdminToken("admin", secret, Date.now() - 1), secret), false);
  assert.equal(verifyAdminToken("malformed", secret), false);
});
