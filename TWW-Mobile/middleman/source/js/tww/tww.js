//= require_self
//= require lib/jst_marionette_cache
//= require lib/map_base
//= require lib/forge_sync
//= require_tree ../../../shared/js/models
//= require_tree ./lib
//= require_tree ./views
//= require_tree ./models
//= require_tree ./modules
//= require_tree .

(function() {
  var tww = new Backbone.Marionette.Application();

  _.extend(tww, {
    models:    {},
    views:     {},
    lib:       {},
    helpers:   {},
    data:      {}
  });

  // Set up some shortcuts
  tww.h = tww.helpers;

  // Shortcut for Backbone.history.navigate
  tww.navigate = function(route, options) {
    Backbone.history.navigate(route, options || {});
  };

  // Don't start Backbone's history until after login
  tww.vent.on("session:start", function() {
    if (!Backbone.history.start()) {
      Backbone.history.navigate('', {trigger: true});
    }
  });

  this.tww = tww;
}).call(this);
