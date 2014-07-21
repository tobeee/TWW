//= require_self
//= require tww/lib/map_base
//  require ../../shared/js/models/map
//  require_tree ../../shared/js/models
//= require_tree ./tww

(function() {
  var root = this;

  var BACKBONE_OPTIONS = {
    root: '/',
    pushState: false
  };

  var tww = {
    // Application data
    data: {},

    // View templates
    templates: {},

    // Models and views
    models: {},
    views: {},

    // Helper methods
    helpers: {
      // TODO: Move this to its own helpers file
      tilePath: function(tile) {
        return "/images/tiles/" + tile + ".png";
      }
    },

    // Various libraries created for the app
    lib: {},

    // Global view instances
    ui: {},

    initialize: function(options) {
      // Initialize router
      this.router = new this.Router();

      // Initialize global views
      this.ui.mainMenu = new this.views.MainMenu();

      this._setupBackboneSync();

      if (!Backbone.history.start(BACKBONE_OPTIONS)) {
        this.router.navigate('/', { trigger: true });
      }
    },

    getMapEditor: function() {
      if (this.ui.mapEditor) return this.ui.mapEditor;
      return this.ui.mapEditor = new this.views.MapEditor();
    },

    _setupBackboneSync: function() {
      // XXX: Temporarily use just mock sync
      root.Backbone.sync = root.MockSync.sync;
    }
  };

  this.tww = tww;
}).call(this);
