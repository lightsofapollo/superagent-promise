Object.keys(require.cache).forEach(function(key) { delete require.cache[key]; });

var assert  = require('assert');
var superagent = require('superagent');
var Promise = require('es6-promise').Promise;
var wrapRequest = require('../index');
var request = wrapRequest(superagent, Promise);
var http    = require('http');
var debug   = require('debug')('test:index');

function respondWith(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'text/plain',
    'Content-Length': body.length
  });
  res.end(body);
}

describe('superagent-promise', function() {
  // start the server
  var server;
  var baseURL;
  var successBody = 'woot';
  var errorBody = 'Not Found';

  var connections = {};
  before(function(done) {
    server = http.createServer(function(req, res) {
      if (/success$/.test(req.url)) {
        debug('Responding with 200');
        respondWith(res, 200, successBody);
        return;

      } else if(/NotFound$/.test(req.url)) {
        debug('Responding with 404');
        respondWith(res, 404, errorBody);

      } else if(/error$/.test(req.url)) {
        debug('Responding with 200, but mismatching Content-Length');
        res.writeHead(200, {
          'Content-Length': successBody.length - 2,
          'Content-Type': 'text/plain'
        });
        res.end(successBody);
      } else if (/redirect/.test(req.url)) {
        debug('Responding with a 302 redirect');
        var url = baseURL + '/success';
        res.writeHead(303, {
          'Location': url
        });
        res.end();
       }
    });

    var i = 0;
    // for some reason the checks on convenience methods open connections
    // that don't get closed so we have to do some clean up
    server.on('connection', function(conn) {
      conn.__connCount = i;
      connections[i++] = conn;
      conn.on('close', function() {
        delete connections[conn.__connCount];
      })
    });

    server.listen(0, function() {
      var addr = server.address();
      debug('server up at', addr);
      baseURL = 'http://' + addr.address + ':' + addr.port;
      done();
    });
  });

  after(function(done) {
    for (var conn in connections) {
      connections[conn].destroy();
    }
    server.close(function() {
      debug('server down');
      done();
    });
    server = undefined;
  });

  describe('convenience methods', function() {
    [
      'head',
      'options',
      'get',
      'post',
      'put',
      'patch',
      'del'
    ].forEach(function(method) {
      describe('#'+method, function() {
        it('should have `then` and `end`', function() {
          var promiseRequest = request[method](baseURL);
          assert(promiseRequest.then instanceof Function);
          assert(promiseRequest.end instanceof Function);
        });

        it('should return a promise from `end`', function() {
          var p = request[method](baseURL).end();
          assert(p instanceof Promise);
        });

        it('should return a promise from `then`', function() {
          var p = request[method](baseURL).then(function() { });
          assert(p instanceof Promise);
        });
      })
    });
  });

  describe('inherited methods', function() {
    it('should have an agent method', function() {
      assert.equal(typeof request.agent, 'function')
    });
    it('should inherit new properties added to superagent', function() {
      superagent.foo = 'bar';
      var r = wrapRequest(superagent, Promise)
      assert.equal(r.foo, 'bar')
      delete superagent.foo
    });
  });

  ['end', 'then'].forEach(function(method) {
    describe('#'+method, function() {
      it('should succeed when the server responds with a 200', function(done) {
        var url = baseURL + '/success';

        request('GET', url)[method]().then(function(res) {
          assert.equal(res.text, successBody);
        }).then(done).catch(done);
      });

      it('should fail when the server responds with a 404', function(done) {
        var url = baseURL + '/NotFound';

        request('GET', url)[method]().then(undefined, function(err) {
          assert.equal(err.status, 404)
          assert.equal(err.response.text, errorBody);

        }).then(done).catch(done);
      });

      it('should fail if content length is mismatched', function(done) {
        var url = baseURL + '/error';

        request('GET', url).end().then(function(res) {
          done(new Error('Got response for mismatched Content-Length'))
        }, function(err) {
          assert.ok(err);
          done();
        });
      });

      it('should follow redirects', function() {
        var url = baseURL + '/redirect';

        return request('GET', url).end().then(function(res) {
          assert.equal(res.text, successBody);
        });
      });
    })
  })
});
