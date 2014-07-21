(function() {
  this.tww.module("entities.characters", function(module, app, Backbone, Marionette, $, _) {
    app.reqres.setHandler("characters", function() {
      return app.entities.fetchUserScopedCollection("characters", app.models.Characters);
    });

    app.reqres.setHandler("character", function(id) {
      var defer = $.Deferred();
      $.when(
        app.request("characters")
      ).done(function(characters) {
        defer.resolve(characters.get(id));
      });
      return defer.promise();
    });
  });
}).call(this);
