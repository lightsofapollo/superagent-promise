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

          it('should return a promise from ' + method, function() {
            var p = request[verb]('http://localhost/200')[method]();
            assert(p instanceof Promise);
          });

          it('should get the right data in the promise', function() {
            request[verb]('http://localhost/200')[method]().then(function(data) {
              console.log(data);

              assert(data.body === SUCCESS_BODY);
            });
          });

        });
      });
    });
  });
});
