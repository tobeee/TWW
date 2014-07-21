(function() {
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  var MockSync = {
    sync: function(method, model, options) {
      var url = options.url || _.result(model, 'url') || urlError();

      // Replace numeric segments of the given
      // URL with "$", assuming they will always
      // be dynamic parts of the URL (e.g. an id)
      var urlMatcher = url.replace(/\/\d+([\/.]|$)/, '/$$$1');

      var result = MockSync.data[urlMatcher];

      if (result) {
        console.log('Mock fetch:', url, '[OK]');

        if (_.isFunction(result)) {
          var params = _.map(url.match(/\d+(?=[\/.]|$)/g), Number);
          result = result.apply(null, params);
        }

        _.defer(options.success, result);
      } else {
        console.log('Mock fetch:', url, '[FAIL]');
        options.error && _.defer(options.error);
      }

      return true;
    },

    data: {}
  };

  this.MockSync = MockSync;
}).call(this);
