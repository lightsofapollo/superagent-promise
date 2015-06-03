superagent-promise
==================

Simple/dumb promise wrapper for superagent. You must depend on `superagent` and your favorite Promise library directly.


## Usage

```js
var agent = require('superagent-promise')(require('superagent'), this.Promise || require('promise'));

// method, url form with `end`
agent('GET', 'http://google.com')
  .end()
  .then(function onResult(res) {
    // do stuff
  });

// method, url form with `then`
agent('GET', 'http://google.com')
  .then(function onResult(res) {
    // do stuff
  });


// helper functions: get, head, patch, post, put, del
agent.put('http://myxfoo', 'data')
  .end()
  .then(function(res) {
    // do stuff`
  });

// helper functions: get, head, patch, post, put, del
agent.put('http://myxfoo', 'data').
  .then(function(res) {
    // do stuff
  });


```
