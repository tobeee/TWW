//= require tww/views/base

(function() {
  var tww = this.tww;

  var MapTileDetails = tww.views.Base.extend({
    className: 'map-tile-details',

    template: 'map_tile_details',

    events: {
      'click .map-td-close': 'close'
    },

    initialize: function(options) {
      var me = this;
      this.mapView = options.mapView;
      this.onWindowResize(function() {
        me.reposition();
      });
    },

    render: function() {
      var me = this;

      this.$el.html(this.template({
        tile: this.model
      }));

      _.defer(function() { me.reposition(); });

      return this;
    },

    reposition: function() {
      var tileEl = this.mapView.tileToEl(this.model);
      var tilePos = tileEl.position();
      var height = this.$el.height();

      this.$el.removeClass('map-td-top map-td-bottom');

      if (tilePos.top < height) {
        // If we're too close to the top to fit
        // then display the dialog below the tile
        var top = tilePos.top + tileEl.height() + tww.views.Map.TILE_PADDING;
        this.$el.addClass('map-td-below');
      } else {
        var top = tilePos.top - height;
        this.$el.addClass('map-td-above');
      }

      // TODO: Push dialog inside the map if near
      // the left/right corners
      var left = (tilePos.left + tileEl.width() / 2) - (this.$el.width() / 2);

      this.$el.css({
        top: top + this.mapView.$el.scrollTop(),
        left: left + this.mapView.$el.scrollLeft()
      });

      return this;
    },

    close: function() {
      this.remove();
      this.destroy();
    }
  });

  tww.views.MapTileDetails = MapTileDetails;
}).call(this);
