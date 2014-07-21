//= require tww/views/base
//= require tww/views/map_tile_details

(function() {
  var tww = this.tww;

  var TILE_OUTER_WIDTH = 128;
  var TILE_PADDING = 25;
  var TILE_INNER_WIDTH = TILE_OUTER_WIDTH - TILE_PADDING;

  var brushOverlayTemplate = '<img class="map-brush-overlay" style="display: none">';

  var overscrollOptions = {
    showThumbs: false,
    wheelDelta: TILE_INNER_WIDTH / 2,
    cancelOn:   '.' + tww.views.MapTileDetails.prototype.className + ' *'
  };

  // See Map#setMode()
  var mapModes = {
    normal: {
      events: {
        'mouseup .map-tile': 'showTileDetails'
      },

      className: '-normal-mode'
    },

    paint: {
      setup: function() {
        this.closeTileDetails();
      },

      teardown: function() {
        this.hideBrushOverlay();
      },

      events: {
        'mouseup   .map-tile': 'paint',
        'mouseover .map-tile': 'moveBrushOverlay',
        'mouseout':            'hideBrushOverlay'
      },

      className: '-paint-mode'
    },

    dropCharacter: {
      setup: function() {
        this.closeTileDetails();
        this.$tiles.droppable({
          accept:     '.med-character',
          scope:      'map',
          hoverClass: '-drop-hover'
        });
      },

      teardown: function() {
        this.$tiles.each(function() {
          var $tile = $(this);
          if ($tile.data('droppable')) $tile.droppable('destroy');
        });
      },

      events: {
        'drop     .map-tile': 'addCharacter',

        // Since map tiles overlap each other we
        // need to make sure only one acts as droppable
        // at any given time or we could end up dropping
        // the same element in two or more tiles at once,
        // so we disable droppables in each tile's vicinity
        // as the user hovers them to prevent this.
        //
        // Trick source:
        // http://stackoverflow.com/questions/11997053/jqueryui-droppable-stop-propagation-to-overlapped-sibling
        'dropover .map-tile': 'disableSurroundingDroppables',
        'dropout  .map-tile': 'enableSurroundingDroppables'
      },

      className: '-drop-character-mode'
    }
  };

  var Map = tww.views.Base.extend({
    el: "#map-viewport",

    template: 'map',

    initialize: function(options) {
      var me = this;

      this.listenTo(this.collection, 'reset', function() {
        me.render();
      });

      this.listenTo(this.collection, 'change', function(tile) {
        me.updateTile(tile);
      });

      this.listenTo(this.collection, 'add:castPresent remove:castPresent', function(character) {
        me.updateTile(character.collection._parents[0]);
      });

      this.onWindowResize(function() {
        me.updateScrolling();
      });

      this.setMode('normal');
    },

    render: function() {
      this.$el.html(this.template({
        map: this.collection
      }));

      this._cacheTiles();

      this.brushOverlay = $(brushOverlayTemplate);
      this.$el.append(this.brushOverlay);

      this.updateScrolling();

      return this;
    },

    // The map is modal, that is, it can have different
    // modes with different behaviours. This method
    // takes the name of a mode and takes care of setting
    // it up and cleaning up after the previous mode.
    setMode: function(mode) {
      if (mapModes[mode] === undefined) throw "Map mode doesn't exist";
      if (this.mode == mode) return;
      if (this.mode) {
        mapModes[this.mode].teardown && mapModes[this.mode].teardown.call(this);
        this.$el.removeClass(mapModes[this.mode].className);
      }
      this.mode = mode;
      mapModes[this.mode].setup && mapModes[this.mode].setup.call(this);
      this.$el.addClass(mapModes[this.mode].className);
      this.delegateEvents(mapModes[mode].events || {});
    },

    updateScrolling: function() {
      // There's no problem with calling overscroll
      // multiple times, the plugin deals with it properly.
      this.overscroll = this.$el.overscroll(overscrollOptions).data('overscroll');
    },

    showTileDetails: function(e) {
      if (this.overscroll.dragging) return true;
      var tile = this.elToTile(e.target);
      this.closeTileDetails();
      this.detailsView = new tww.views.MapTileDetails({
        model: tile,
        mapView: this
      });
      this.$el.append(this.detailsView.render().el);
    },

    closeTileDetails: function() {
      this.detailsView && this.detailsView.close();
    },

    paint: function(e) {
      if (!this.brush) return true;
      if (this.overscroll.dragging) return true;
      var tile = this.elToTile(e.target);
      tile.set('img', this.brush);
    },

    disableSurroundingDroppables: function(e) {
      this._toggleSurroundingDroppables(e.target, false);
    },

    enableSurroundingDroppables: function(e) {
      this._toggleSurroundingDroppables(e.target, true);
    },

    addCharacter: function(e, ui) {
      var model = ui.draggable.data('model');
      var tile = this.elToTile(e.target);
      tile.get('castPresent').add(model.clone());
    },

    updateTile: function(tile) {
      var tileEl = this.tileToEl(tile);
      $(tileEl).replaceWith(tww.templates['map_tile']({
        map:  this.collection,
        tile: tile
      }));
      this._cacheTiles();
    },

    tileToEl: function(tile) {
      return this.$('.map-tile').eq(tile.y * this.collection.width + tile.x);
    },

    elToTile: function(tileEl) {
      var coords = $(tileEl).closest('.map-tile').data('coords').split(',');
      return this.collection.at(coords[0], coords[1]);
    },

    setBrush: function(brush) {
      this.brush = brush;
      this.brushOverlay.attr('src', tww.helpers.tilePath(this.brush));
    },

    moveBrushOverlay: function(e) {
      if (!this.brush) return true;
      var tileEl = $(e.target).closest('.map-tile');
      this.brushOverlay.insertAfter(tileEl).css({
        left:   tileEl.css('left'),
        top:    tileEl.css('top'),
        zIndex: tileEl.css('z-index')
      }).show();
    },

    hideBrushOverlay: function() {
      this.brushOverlay.hide();
    },

    _toggleSurroundingDroppables: function(tileEl, enabled) {
      var tile = this.elToTile(tileEl);
      var me = this;
      tile.eachCardinal(function(t) {
        $(me.tileToEl(t)).droppable(enabled ? 'enable' : 'disable');
      }, true);
    },

    _cacheTiles: function() {
      this.$tiles = this.$('.map-tile');
    }
  });

  Map.TILE_OUTER_WIDTH = TILE_OUTER_WIDTH;
  Map.TILE_PADDING = TILE_PADDING;
  Map.TILE_INNER_WIDTH = TILE_INNER_WIDTH;

  tww.views.Map = Map;
}).call(this);
