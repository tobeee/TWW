(function() {
  var forge = this.forge || (this.forge = {});

  var apiResponses = {
    me: { email: 'tobeee@gmail.com' }
  };

  forge.facebook = {
    authorize: function(success, failure) {
      _.defer(success);
    },

    api: function(req, callback) {
      _.defer(callback, apiResponses[req]);
    }
  };
}).call(this);
