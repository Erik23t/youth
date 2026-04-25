const https = require('https');

const data = JSON.stringify({
  sessionId: 'test-session-id',
  items: [{ name: 'test', price: 10, qty: 1 }]
});

const options = {
  hostname: 'zylumia-backend-kmbrxbidkq-uc.a.run.app',
  port: 443,
  path: '/api/cart',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
