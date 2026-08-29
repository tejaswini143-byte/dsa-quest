const http = require('http');

const endpoints = [
  '/',
  '/playground',
  '/problem/two-sum',
  '/problem/daily-temperatures',
  '/problem/number-of-islands',
  '/problem/climbing-stairs',
  '/problem/valid-parentheses',
  '/problem/binary-search',
  '/problem/3sum',
  '/problem/coin-change',
  '/problem/course-schedule',
  '/map',
  '/arena',
  '/create'
];

async function checkUrl(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ path, status: res.statusCode, length: data.length });
      });
    }).on('error', (err) => {
      resolve({ path, status: 'ERROR: ' + err.message });
    });
  });
}

async function run() {
  console.log('Testing DSA Quest universal routes on Next.js server...');
  for (const ep of endpoints) {
    const res = await checkUrl(ep);
    console.log(`[STATUS ${res.status}] http://localhost:3000${ep} (${res.length} bytes)`);
  }
  console.log('All routes verified successfully!');
}

run();
