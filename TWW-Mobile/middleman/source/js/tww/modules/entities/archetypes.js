(function() {
  this.tww.module("entities.archetypes", function(module, app, Backbone, Marionette) {
    app.reqres.setHandler("archetypes", function() {
      return _.values(app.data.roleTypes);
    });
  })
}).call(this);
