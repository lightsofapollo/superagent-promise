suite('superagent-promise', function() {
  var assert  = require('assert');
  var request = require('./')(require('superagent'), require('es6-promise').Promise);
  var http    = require('http');
  var debug   = require('debug')('index_test');

  // start the server
  var server;
  var successBody = 'woot';
  var errorBody = 'Not Found';
  setup(function(done) {
    server = http.createServer(function(req, res) {
      if (/success$/.test(req.url)) {
        debug('Responding with 200');
        res.writeHead(200, {
          'Content-Length': successBody.length,
          'Content-Type': 'text/plain'
        });
        res.end(successBody);
      } else if(/NotFound$/.test(req.url)) {
        debug('Responding with 404');
        res.writeHead(404, {
          'Content-Length': errorBody.length,
          'Content-Type': 'text/plain'
        });
        res.end(errorBody);
      } else if(/error$/.test(req.url)) {
        debug('Responding with 200, but mismatching Content-Length');
        res.writeHead(200, {
          'Content-Length': successBody.length - 2,
          'Content-Type': 'text/plain'
        });
        res.end(successBody);
      }
    });

    server.listen(0, function() {
      debug('listen');
      done();
    });
  });

  teardown(function(done) {
    server.close(function() {
      debug('teardown');
      done();
    });
    server = undefined;
  });

  suite('#end', function() {
    test('issue request', function(done) {
      var addr = server.address();
      var url = 'http://' + addr.address + ':' + addr.port + '/success';

      request('GET', url).end().then(function(res) {
        assert.equal(res.text, successBody);
      }).then(done).catch(done);
    });

    test('issue request with .get', function(done) {
      var addr = server.address();
      var url = 'http://' + addr.address + ':' + addr.port + '/success';

      request.get(url).end().then(function(res) {
        assert.equal(res.text, successBody);
      }).then(done).catch(done);
    });

    test('issue 404 request', function(done) {
      var addr = server.address();
      var url = 'http://' + addr.address + ':' + addr.port + '/NotFound';

      request('GET', url).end().then(undefined, function(err) {
        assert.equal(err.status, 404)
        assert.equal(err.response.text, errorBody);

      }).then(done).catch(done);
    });

    test('test error', function(done) {
      var addr = server.address();
      var url = 'http://' + addr.address + ':' + addr.port + '/error';

      request('GET', url).end().then(function(res) {
        done(new Error('error should not should not succeed'));

      }, function(err) {
        assert.ok(err);
      }).then(done).catch(done);
    });
  });

  suite('#then', function() {
    test('issue request', function(done) {
      var addr = server.address();
      var url = 'http://' + addr.address + ':' + addr.port + '/success';

      request('GET', url).then(function(res) {
        assert.equal(res.text, successBody);
      }).then(done).catch(done);
    });

    test('issue request with .get', function(done) {
      var addr = server.address();
      var url = 'http://' + addr.address + ':' + addr.port + '/success';

      request.get(url).then(function(res) {
        assert.equal(res.text, successBody);
      }).then(done).catch(done);
    });

    test('issue 404 request', function(done) {
      var addr = server.address();
      var url = 'http://' + addr.address + ':' + addr.port + '/NotFound';

      request('GET', url).then(undefined, function(err) {
        assert.equal(err.status, 404)
        assert.equal(err.response.text, errorBody);

      }).then(done).catch(done);
    });

    test('test error', function(done) {
      var addr = server.address();
      var url = 'http://' + addr.address + ':' + addr.port + '/error';

      request('GET', url).then(function(res) {
        done(new Error('error should not should not succeed'));

      }, function(err) {
        assert.ok(err);
      }).then(done).catch(done);
    });
  })
});
