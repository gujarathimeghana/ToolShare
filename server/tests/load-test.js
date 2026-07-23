// Baseline / Load Testing Automation Script
// Simulates 100 concurrent virtual users for 60 seconds against the backend API

const https = require('https');
const http = require('http');
const path = require('path');
const XLSX = require('xlsx');

const API_URL = process.env.API_URL || 'https://toolshare-production-e02e.up.railway.app/api';
const CONCURRENT_USERS = parseInt(process.env.VIRTUAL_USERS || '100', 10);
const DURATION_SECONDS = parseInt(process.env.TEST_DURATION || '60', 10);

const endpointsToTest = [
  { name: 'Health Check', path: '/health', method: 'GET' },
  { name: 'Get Tools List', path: '/tools', method: 'GET' },
  { name: 'Get Categories List', path: '/categories', method: 'GET' },
  { name: 'Get Skilled Helpers', path: '/help/helpers', method: 'GET' }
];

async function executeSingleRequest(endpointPath) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const targetUrl = new URL(`${API_URL}${endpointPath}`);
    const client = targetUrl.protocol === 'https:' ? https : http;

    const req = client.get(targetUrl.href, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          responseTime,
          success: res.statusCode >= 200 && res.statusCode < 400
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 500,
        responseTime: Date.now() - startTime,
        success: false,
        error: err.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        statusCode: 504,
        responseTime: Date.now() - startTime,
        success: false,
        error: 'Timeout'
      });
    });
  });
}

async function runLoadTest() {
  console.log('====================================================');
  console.log('🔥 STARTING BASELINE / LOAD TESTING SUITE');
  console.log(`   Target Endpoint Base: ${API_URL}`);
  console.log(`   Virtual Users (VU):   ${CONCURRENT_USERS} Concurrent Users`);
  console.log(`   Duration:             ${DURATION_SECONDS} Seconds`);
  console.log('====================================================\n');

  const endTime = Date.now() + (DURATION_SECONDS * 1000);
  const responseTimes = [];
  let totalRequests = 0;
  let successfulRequests = 0;
  let failedRequests = 0;

  // Worker loop simulating a virtual user sending continuous requests
  async function virtualUserWorker(workerId) {
    while (Date.now() < endTime) {
      // Pick an endpoint round-robin or randomly
      const ep = endpointsToTest[totalRequests % endpointsToTest.length];
      const res = await executeSingleRequest(ep.path);
      
      totalRequests++;
      responseTimes.push(res.responseTime);

      if (res.success) {
        successfulRequests++;
      } else {
        failedRequests++;
      }

      // Small delay (20ms) between requests per virtual user to simulate user think time
      await new Promise(r => setTimeout(r, 20));
    }
  }

  const workers = [];
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    workers.push(virtualUserWorker(i + 1));
  }

  // Progress indicator while load test is running
  const progressInterval = setInterval(() => {
    const elapsed = Math.round((Date.now() - (endTime - DURATION_SECONDS * 1000)) / 1000);
    const rps = (totalRequests / Math.max(1, elapsed)).toFixed(1);
    console.log(`   ⏱️  Progress: ${elapsed}s / ${DURATION_SECONDS}s | Total Requests: ${totalRequests} | Current RPS: ${rps} req/sec`);
  }, 10000);

  await Promise.all(workers);
  clearInterval(progressInterval);

  // Compute Metrics
  const minResponseTime = Math.min(...responseTimes);
  const maxResponseTime = Math.max(...responseTimes);
  const avgResponseTime = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);

  // Sort response times for percentiles
  responseTimes.sort((a, b) => a - b);
  const p90 = responseTimes[Math.floor(responseTimes.length * 0.90)] || maxResponseTime;
  const p95 = responseTimes[Math.floor(responseTimes.length * 0.95)] || maxResponseTime;
  const rps = (totalRequests / DURATION_SECONDS).toFixed(2);
  const successRate = ((successfulRequests / totalRequests) * 100).toFixed(2) + '%';

  console.log('\n====================================================');
  console.log('📊 LOAD TESTING RESULTS SUMMARY');
  console.log('====================================================');
  console.log(`   🔹 Total Requests Sent:     ${totalRequests.toLocaleString()}`);
  console.log(`   🔹 Successful Requests:     ${successfulRequests.toLocaleString()} (${successRate})`);
  console.log(`   🔹 Failed / Throttled:      ${failedRequests.toLocaleString()}`);
  console.log(`   ⚡ Requests Per Sec (RPS):  ${rps} req/sec`);
  console.log(`   ⏱️  Response Time (Min):    ${minResponseTime}ms`);
  console.log(`   ⏱️  Response Time (Average):${avgResponseTime}ms`);
  console.log(`   ⏱️  Response Time (Max):    ${maxResponseTime}ms`);
  console.log(`   ⏱️  90th Percentile (P90):  ${p90}ms`);
  console.log(`   ⏱️  95th Percentile (P95):  ${p95}ms`);
  console.log('====================================================\n');

  // Generate Excel Performance Report
  const loadTestSummary = [
    { 'Metric': 'Target Base API', 'Value': API_URL },
    { 'Metric': 'Concurrent Virtual Users (VUs)', 'Value': CONCURRENT_USERS },
    { 'Metric': 'Test Duration (Seconds)', 'Value': DURATION_SECONDS },
    { 'Metric': 'Total Requests Handled', 'Value': totalRequests },
    { 'Metric': 'Successful Requests', 'Value': successfulRequests },
    { 'Metric': 'Failed Requests', 'Value': failedRequests },
    { 'Metric': 'Requests Per Second (RPS)', 'Value': `${rps} req/sec` },
    { 'Metric': 'Min Response Time', 'Value': `${minResponseTime}ms` },
    { 'Metric': 'Average Response Time', 'Value': `${avgResponseTime}ms` },
    { 'Metric': 'Max Response Time', 'Value': `${maxResponseTime}ms` },
    { 'Metric': '90th Percentile (P90)', 'Value': `${p90}ms` },
    { 'Metric': '95th Percentile (P95)', 'Value': `${p95}ms` },
    { 'Metric': 'Overall Success Rate', 'Value': successRate },
    { 'Metric': 'Test Completed At', 'Value': new Date().toLocaleString() }
  ];

  const wb = XLSX.utils.book_new();
  const wsSummary = XLSX.utils.json_to_sheet(loadTestSummary);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Load Test Performance');

  const reportPath = path.join(__dirname, '..', 'load_test_report.xlsx');
  XLSX.writeFile(wb, reportPath);
  console.log(`📊 Load Testing Excel Report Generated: ${reportPath}`);
}

if (require.main === module) {
  runLoadTest();
}

module.exports = { runLoadTest };
