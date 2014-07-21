(function() {
  var Map = Backbone.View.extend({
    gameView: true,

    className: 'map',

    events: {
    },

    initialize: function(options) {
      this.setupListeners();
    },

    render: function() {
      var map = this.model.getMap();

      this.$el.html(tww.t.map({
        map: map
      })).css(
        'height', map.height * Map.TILE_HEIGHT
      );

      this.$container = this.$('.map-container');
      this.$hero = $('<div class="hero"></div>');
      this.$container.append(this.$hero);
      this.updateHero();

      return this;
    },

    updateHero: function() {
      this.$hero.css({
        left: Map.TILE_WIDTH * this.model.state.heroPos.x,
        top:  Map.TILE_HEIGHT * this.model.state.heroPos.y
      });
    },

    updateTile: function(tile) {
      var tileEl = this.tileEl(tile);
      tileEl.toggleClass('visited', tile.get('visited'));
    },

    tileEl: function(tile) {
      return this.$('#map-tile-' + tile.x + '-' + tile.y);
    },

    destroy: function() {
      this.undelegateEvents();
      this.model.getMap().off(null, null, this);
      this.model.state.off(null, null, this);
    },

    setupListeners: function() {
      var me = this;

      this.model.getMap().on('tile:change', function(tile) {
        me.updateTile(tile);
      }, this);

      this.model.state.on('hero:move', function() {
        me.updateHero();
      }, this);
    }
  });

  Map.TILE_WIDTH = Map.TILE_HEIGHT = 62;

  // Mixins
  _.extend(Map.prototype, AdjustableHeight);

  window.tww.views.Map = Map;
})();
