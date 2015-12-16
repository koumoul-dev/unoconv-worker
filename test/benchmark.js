var fs = require('fs');
var apiBenchmark = require('api-benchmark');

var services = {
  server1: 'http://localhost:3121'
};

var routes = {
  textToHTML: {
    method: 'get',
    route: 'document',
    expectedStatusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
      Accept: 'text/html'
    },
    data: 'Hello world'
  }
};

apiBenchmark.measure(services, routes, {
  runMode: 'parallel',
  maxConcurrentRequests: 100
}, function(err, results) {
  if (err) throw err;
  apiBenchmark.getHtml(results, function(err, html) {
    if (err) throw err;
    console.log('Write results in benchmark-results/report.html');
    fs.writeFileSync('./benchmark-results/report.html', html);
  });
});
