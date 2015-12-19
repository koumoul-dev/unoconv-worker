var express = require('express');
var cors = require('cors');
var route = require('./route');

console.log('Initialize unoconv-worker service');

var app = express();
app.use(cors());
app.get('/document', route);
app.post('/document', route);
app.listen(3121, function(err) {
  if (err) console.error('Failed to run service', err.stack);
  else console.info('Service listening at http://localhost:%s', 3121);
});
