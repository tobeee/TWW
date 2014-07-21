(function() {
  this.tww.module("browse.views", function(module, app, Backbone, Marionette) {
    module.ForcePoints = app.views.ForcePoints.extend({
      className: "force-points section",
      template: "index/force_points"
    });
  });
}).call(this);
