Object.keys(require.cache).forEach(function(key) { delete require.cache[key]; });

var assert  = require('assert');
var Promise = require('es6-promise').Promise
var debug   = require('debug')('test:mocks');

var SUCCESS_BODY = 'Yay! Mocked :)';
var mockedRequest = require('superagent');
var mocks = require('./mock.config')('localhost', SUCCESS_BODY);
require('superagent-mock')(mockedRequest, mocks);
var request = require('../index')(mockedRequest, Promise);

describe('superagent-promise + superagent-mock', function() {
  describe('mocked methods', function() {
    ['get', 'put', 'post'].forEach(function(verb) {
      describe('#' + verb, function() {
        ['end', 'then'].forEach(function(method) {

          it('should return a promise from ' + method, function(done) {
            var p = request[verb]('http://localhost/200')[method]();
            assert(p instanceof Promise, verb + '.' + method + ' did not return a promise');
            done();
          });

          it('should get the right data in the promise', function(done) {
            request[verb]('http://localhost/200')[method]().then(function(data) {
              assert.equal(data.body, SUCCESS_BODY, 'Wrong body from mock');
              done();
            }).catch(done);
          });

          it('should fail when the mock throws', function(done) {
            request[verb]('http://localhost/404')[method]().then(function() {
              assert(false);
            }, function(err) {
              assert.equal(err.message, '404', 'Wrong error from mock');
              done();
            }).catch(done);
          })

        });
      });
    });
  });
});
