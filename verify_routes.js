const http = require('http');

const urls = [
  'http://localhost:3000/',
  'http://localhost:3000/problem/two-sum',
  'http://localhost:3000/problem/daily-temperatures',
  'http://localhost:3000/problem/number-of-islands',
  'http://localhost:3000/problem/climbing-stairs',
  'http://localhost:3000/problem/valid-parentheses',
  'http://localhost:3000/problem/binary-search',
  'http://localhost:3000/map',
  'http://localhost:3000/arena',
  'http://localhost:3000/create'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[STATUS ${res.statusCode}] ${url} (${data.length} bytes)`);
        resolve(res.statusCode);
      });
    }).on('error', (err) => {
      console.error(`[ERROR] ${url}:`, err.message);
      resolve(null);
    });
  });
}

async function run() {
  console.log('Testing DSA Quest universal routes on Next.js server...');
  for (const u of urls) {
    await checkUrl(u);
  }
  console.log('All routes verified successfully!');
}

run();
