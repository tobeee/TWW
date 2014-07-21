(function() {
  this.tww.module("entities", function(module, app, Backbone, Marionette, $, _) {
    module._userScopedCollections = {};

    module.fetchUserScopedCollection = function(name, collectionClass) {
      if (module._userScopedCollections[name]) return module._userScopedCollections[name];
      var defer = $.Deferred();
      var userData = app.request("session:data");
      var collection = new collectionClass;
      collection.fetch({
        data: _.pick(userData, 'email'),
        success: function() {
          module._userScopedCollections[name] = collection;
          defer.resolve(collection);
        },
        error: function() { defer.resolve(undefined); }
      });
      return defer.promise();
    };
  });
}).call(this);
