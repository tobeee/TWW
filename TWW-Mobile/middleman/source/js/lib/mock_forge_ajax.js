(function() {
  var forge = this.forge || (this.forge = {});

  var urlError = function() {
    throw new Error('A "url" property must be specified');
  };

  function getPath(url) {
    return url.replace(/^https?:\/\/(?:\w+(?::\w+)?@)?[a-z][\w.]+[a-z](?::\d+)?\//, "/");
  };

  forge.ajax = function(options) {
    var url = getPath(options.url) || urlError();

    // Replace numeric segments of the given
    // URL with "$", assuming they will always
    // be dynamic parts of the URL (e.g. an id)
    var urlMatcher = url.replace(/\/\d+([\/.]|$)/, '/$$$1');

    var result = MockSync.data[urlMatcher];

    if (result) {
      console.log('Mock forge.ajax:', options.type, url, '[OK]');

      if (_.isFunction(result)) {
        var params = _.map(url.match(/\d+(?=[\/.]|$)/g), Number);
        result = result.apply(null, params);
      }

      _.defer(options.success, result);
    } else {
      console.log('Mock forge.ajax:', options.type, url, '[FAIL]');
      options.error && _.defer(options.error);
    }

    return true;
  }
}).call(this);
