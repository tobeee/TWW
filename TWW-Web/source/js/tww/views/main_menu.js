//= require tww/views/base

(function() {
  var tww = this.tww;

  var MainMenu = tww.views.Base.extend({
    el: '#main-menu',

    events: {
      'click #mm-build': 'toggleMapEdit'
    },

    toggleMapEdit: function() {
      tww.getMapEditor().toggle();
    }
  });

  tww.views.MainMenu = MainMenu;
}).call(this);
