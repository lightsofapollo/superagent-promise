[![Build Status](https://img.shields.io/travis/lightsofapollo/superagent-promise/master.svg)](https://travis-ci.org/lightsofapollo/superagent-promise)

superagent-promise
==================

Simple/dumb promise wrapper for superagent. You must depend on `superagent` and your favorite Promise library directly.


## Usage

```js
var Promise = this.Promise || require('promise');
var agent = require('superagent-promise')(require('superagent'), Promise);

// method, url form with `end`
agent('GET', 'http://google.com')
  .end()
  .then(function onResult(res) {
    // do stuff
  }, function onError(err) {
    //err.response has the response from the server
  });

// method, url form with `then`
agent('GET', 'http://google.com')
  .then(function onResult(res) {
    // do stuff
  });


// helper functions: options, head, get, post, put, patch, del
agent.put('http://myxfoo', 'data')
  .end()
  .then(function(res) {
    // do stuff`
  });

// helper functions: options, head, get, post, put, patch, del
agent.put('http://myxfoo', 'data').
  .then(function(res) {
    // do stuff
  });
```

## Mocking

Now superagent-promise can be mocked using `superagent-mock`. For the complete example see
`test/mock.spec.js` and `test/mock.config.js`.

```js
var SUCCESS_BODY = 'Yay! Mocked :)';
var mockedRequest = require('superagent');
var mocks = require('./mock.config')('localhost', SUCCESS_BODY);
require('superagent-mock')(mockedRequest, mocks);
var request = require('../index')(mockedRequest, Promise);
```

## Typescript

This module provides a type definition file so it can be used from Typescript.
You do **not** need to use `typings` to install, since it is included in the
NPM package itself. However, it does depend on the `node` typings, and you
will need the `superagent` typings in order to import superagent.

```
# install superagent and superagent-promise
npm install superagent superagent-promise --save

# install typings for node and superagent.
typings install node --source=dt --global --save
typings install superagent --source=dt --global --save
```

```typescript
/// <reference path="./typings/index.d.ts" />

import * as superagent from 'superagent';
import * as superagentPromise from 'superagent-promise';

const request = superagentPromise(superagent, Promise);

request
  .get('http://github.com')
  .set('X-Awesome', 'superagent-promise')
  .end()
  .then(r => {
    // r is of type SuperAgentResponse
    console.log(`Status: ${r.status}`);
  })
  .catch(err => {
    console.error(err);
  });
```
