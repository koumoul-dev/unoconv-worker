var fs = require('fs');
var should = require('should');
var request = require('request');

var docxMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
function documentAPI(inputType, outputType, template, data, callback) {
  var isBuffer = data instanceof Buffer;

  if (typeof data === 'object' && !isBuffer) data = JSON.stringify(data);

  var options = {
    url: 'http://localhost:3121/document',
    body: data,
    headers: {
      'Content-Type': inputType,
      Accept: outputType
    },
    qs: {
      template: template
    }
  };

  if (isBuffer) {
    options.encoding = null;
  }

  request.get(options, function(err, response) {
    if (err) return callback(err);
    if (response.statusCode !== 200) {
      err = new Error(response.body);
      err.code = response.statusCode;
      return callback(err);
    }

    var result = response.body;
    if (isBuffer) {
      result = result.toString();
    }
    callback(null, result);
  });
}

describe('UNO converter worker', function() {

  it('should get a PDF from a docx file', function(callback) {
    documentAPI(docxMime, 'application/pdf', null, fs.readFileSync(__dirname + '/resources/hello_world.docx'),
      function(err) {
        should.not.exist(err);
        // TODO: a way to check the content
        callback();
      });
  });

  it('should get a HTML from a docx file', function(callback) {
    documentAPI(docxMime, 'text/html', null, fs.readFileSync(__dirname + '/resources/hello_world.docx'),
      function(err, result) {
        should.not.exist(err);
        result.should.match(/Hello/);
        result.should.match(/who/);
        callback();
      });
  });

  it('should get a HTML from TXT file', function(callback) {
    documentAPI('text/plain', 'text/html', null, 'Hello',
      function(err, result) {
        should.not.exist(err);
        result.should.match(/Hello/);
        callback();
      });
  });
});
