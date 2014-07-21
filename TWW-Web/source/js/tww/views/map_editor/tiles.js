//= require tww/views/tab

(function() {
  var tww = this.tww;

  var Tiles = tww.views.Tab.extend({
    id: 'med-tiles',

    template: 'map_editor/tiles',

    events: {
      'click .med-tile': 'selectBrush'
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    },

    show: function() {
      this.setMapMode();
      return tww.views.Tab.prototype.show.apply(this);
    },

    setMapMode: function() {
      tww.ui.map.setMode('paint');
      return this;
    },

    selectBrush: function(e) {
      var tile = $(e.target);
      this.$('._selected').removeClass('_selected');
      tile.addClass('_selected');
      tww.ui.map.setBrush(tile.data('brush'));
    }
  });

  tww.views.MapEditor.TABS_MAP.tiles = Tiles;
}).call(this);
