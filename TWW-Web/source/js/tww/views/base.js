(function() {
  var tww = this.tww, Backbone = this.Backbone;

  // Extend Backbone.View to provide a common
  // platform for all the app's views.
  //
  // This provides template finding and a basic
  // destroy method.
  //
  var Base = Backbone.View.extend({
    constructor: function(options) {
      Backbone.View.call(this, options);
      this._findTemplate();
    },

    onWindowResize: function(callback) {
      $(window).on('resize.windowEvents' + this.cid, callback);
      return this;
    },

    offWindowEvents: function(callback) {
      $(window).off('.windowEvents' + this.cid);
    },

    destroy: function() {
      // Push actual destroy functionality to
      // an underscored method to allow easier
      // overwriting
      this._destroy();
    },

    _destroy: function() {
      this.undelegateEvents();
      this.stopListening();
      this.offWindowEvents();
    },

    _findTemplate: function() {
      if (_.isString(this.template)) {
        this.template = tww.templates[this.template];
      }
    }
  });

  tww.views.Base = Base;
}).call(this);
