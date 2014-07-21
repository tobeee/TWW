(function() {
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read':   'GET'
  };

  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  var env = this;

  this.ForgeSync = {
    baseURL: '',

    sync: function(method, model, options) {
      var type = methodMap[method];

      // Default options, unless specified.
      options || (options = {});

      // Default JSON-request options.
      var params = {type: type, dataType: 'json'};

      // Ensure that we have a URL.
      if (!options.url) {
        params.url = (ForgeSync.baseURL + _.result(model, 'url')) || urlError();
      }

      // Ensure that we have the appropriate request data.
      if (!options.data && model && (method == 'create' || method == 'update')) {
        params.contentType = 'application/json';
        params.data = JSON.stringify(model.toJSON());
      }

      // Make the request, allowing the user to override any Ajax options.
      return env.forge.ajax(_.extend(params, options));
    }
  };
}).call(this);
