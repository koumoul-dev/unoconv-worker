var fs = require('fs');
var should = require('should');
var request = require('request');

var docxMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

function documentAPI(inputType, outputType, data, callback) {
  var options = {
    url: 'http://localhost:3121/document',
    headers: {
      'Content-Type': inputType,
      Accept: outputType
    }
  };

  var isBuffer = data instanceof Buffer;
  if (typeof data === 'object' && !isBuffer) data = JSON.stringify(data);

  if (data) {
    options.body = data;
  }

  if (isBuffer || !data) {
    options.encoding = null;
  }

  if (callback) {
    request.post(options, function(err, response) {
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
  } else {
    return request.post(options);
  }
}

describe('UNO converter worker', function() {

  after(function(cb) {
    setTimeout(cb, 1000);
  });

  it('should get a PDF from a docx file', function(callback) {
    documentAPI(docxMime, 'application/pdf', fs.readFileSync(__dirname + '/resources/hello_world.docx'),
      function(err) {
        should.not.exist(err);
        // TODO: a way to check the content
        callback();
      });
  });

  it('should get a HTML from a docx file', function(callback) {
    documentAPI(docxMime, 'text/html', fs.readFileSync(__dirname + '/resources/hello_world.docx'),
      function(err, result) {
        should.not.exist(err);
        result.should.match(/Hello/);
        result.should.match(/who/);
        callback();
      });
  });

  it('should get a HTML from a docx file using request streaming mode', function(callback) {
    var stream = documentAPI(docxMime, 'text/html');
    fs.createReadStream(__dirname + '/resources/hello_world.docx').pipe(stream);
    stream.on('data', function(data) {
      var result = data.toString();
      result.should.match(/Hello/);
      result.should.match(/who/);
      callback();
    });
    stream.on('error', callback);
  });

  it('should get a HTML from TXT file', function(callback) {
    documentAPI('text/plain', 'text/html', 'Hello',
      function(err, result) {
        should.not.exist(err);
        result.should.match(/Hello/);
        callback();
      });
  });
});
