(function() {
  this.tww.module("game.views", function(module, app, Backbone, Marionette, $, _) {
    var TILE_WIDTH = 62;
    var TILE_HEIGHT = TILE_WIDTH;

    module.Map = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      gameView: true,

      className: 'map',

      initialize: function(options) {
        var me = this;
        this.listenTo(this.model.getMap(), "tile:change", function(tile) {
          me.updateTile(tile);
        });
        this.listenTo(this.model.state, "hero:move", function() {
          me.updateHero();
        })
      },

      render: function() {
        var map = this.model.getMap();
        this.$el.html(tww.t.map({
          map: map
        })).css(
          'height', map.height * TILE_HEIGHT
        );
        this.$container = this.$('.map-container');
        this.$hero = $('<div class="hero"></div>');
        this.$container.append(this.$hero);
        this.updateHero();
        return this;
      },

      updateHero: function() {
        this.$hero.css({
          left: TILE_WIDTH * this.model.state.heroPos.x,
          top:  TILE_HEIGHT * this.model.state.heroPos.y
        });
      },

      updateTile: function(tile) {
        var tileEl = this.tileEl(tile);
        tileEl.toggleClass('visited', tile.get('visited'));
      },

      tileEl: function(tile) {
        return this.$('#map-tile-' + tile.x + '-' + tile.y);
      }
    }));

    // Attach constants to class.
    _.extend(module.Map, {
      TILE_WIDTH:  TILE_WIDTH,
      TILE_HEIGHT: TILE_HEIGHT
    });
  });
}).call(this);
