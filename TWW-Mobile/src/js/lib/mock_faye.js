(function() {
  var Faye = {};

  var Subscription = function() {
    var me = this;
    _.defer(function() {
      if (me._callback) me._callback();
    });
  };

  _.extend(Subscription.prototype, {
    callback: function(f) {
      this._callback = f;
    },

    errback: function() {}
  });

  var Publication = Subscription;

  Faye.Client = function() {};

  _.extend(Faye.Client.prototype, {
    subscribe: function(endpoint, callback) {
      return new Subscription();
    },
    
    publish: function(endpoint, message) {
      return new Publication();
    }
  });

  this.Faye = Faye;
}).call(this);
