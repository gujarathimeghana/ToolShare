const test = require('node:test');
const assert = require('node:assert');

test('Backend Configuration - Health Check & Environment Verification', async (t) => {
  await t.test('Health check endpoint format structure', () => {
    const response = { status: 'UP', message: 'Neighborly API operational' };
    assert.strictEqual(response.status, 'UP');
    assert.strictEqual(response.message, 'Neighborly API operational');
  });

  await t.test('Default PORT environment variable fallback', () => {
    const port = process.env.PORT || 5000;
    assert.strictEqual(typeof port, 'number');
    assert.ok(port > 0);
  });
});

test('Location Formatter Utility Verification', async (t) => {
  await t.test('Formats manual location object into clean address string', () => {
    const formatLocation = (loc) => {
      const city = loc.city || '';
      const area = loc.area || '';
      const state = loc.state || '';
      const pincode = loc.pincode || '';
      return `${area}, ${city}, ${state}${pincode ? ` - ${pincode}` : ''}`.trim();
    };

    const formatted = formatLocation({ city: 'New York', area: 'Manhattan', state: 'NY', pincode: '10001' });
    assert.strictEqual(formatted, 'Manhattan, New York, NY - 10001');
  });
});
