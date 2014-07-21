(function() {
  var _        = this._,
      Backbone = this.Backbone,
      tww      = this.tww;

  var crossCardinals = ['north', 'east', 'south', 'west'];
  var fullCardinals = ['north', 'northEast', 'east', 'southEast', 'south', 'southWest', 'west', 'northWest'];

  var MapTileBase = Backbone.AssociatedModel.extend({
    constructor: function(attributes, options) {
      if (options && options.x !== undefined) this.x = options.x;
      if (options && options.y !== undefined) this.y = options.y;
      Backbone.Model.call(this, attributes, options);
      // Alias collection as "map" for backwards compatibility
      this.map = this.collection;
    },

    north: function() { return this._offset(0, -1); },
    east:  function() { return this._offset(1, 0); },
    south: function() { return this._offset(0, 1); },
    west:  function() { return this._offset(-1, 0); },

    northEast: function() { return this._offset(1, -1); },
    southEast: function() { return this._offset(1, 1); },
    southWest: function() { return this._offset(-1, 1); },
    northWest: function() { return this._offset(-1, -1); },

    // Iterate through each caridnal point
    // and call the iterator on each existing
    // tile in those.
    eachCardinal: function(iterator, diagonals) {
      var me = this;
      _.each(diagonals ? fullCardinals : crossCardinals, function(cp) {
        var tile = me[cp]();
        if (tile) iterator(tile);
      });
    },

    _offset: function(x, y) {
      try {
        return this.collection.at(this.x + x, this.y + y);
      } catch(e) {
        return null;
      }
    }
  });

  tww.lib.MapTileBase = MapTileBase;
}).call(this);

