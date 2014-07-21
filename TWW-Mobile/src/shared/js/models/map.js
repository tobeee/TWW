(function() {
  var MapTile = tww.lib.MapTileBase.extend({
    initialize: function() {
      var me = this;

      // Bubble change events to map
      this.on('change', function() {
        me.map.trigger('tile:change', me);
      });

      // Flag map for rebuilding items list
      this.on('change:items', function() {
        me.map._dirtyItems = true;
      });
    },

    parse: function(response) {
      var r = _.clone(response);

      // Strip path from img
      r.img = r.img.replace(/^.+\//, '');

      return r;
    },

    exits: function() {
      var exits = [];
      if (this.get('exitN')) exits.push(['North', this.north()]);
      if (this.get('exitE')) exits.push(['East', this.east()]);
      if (this.get('exitS')) exits.push(['South', this.south()]);
      if (this.get('exitW')) exits.push(['West', this.west()]);
      return exits;
    },

    visit: function(hidden) {
      this.set('visited', true);
      this.eachCardinal(function(tile) {
        tile.set('visited', true);
      });
    },

    addItem: function(item) {
      var items = this.attributes.items || (this.attributes.items = []);
      // Remove item from old tile
      if (item.tile) {
        item.tile.removeItemAt(_.indexOf(item.tile.get('items'), item), {silent: true});
      }
      items.push(item);
      this.trigger('change');
      this.trigger('change:items');
      this.trigger('change:items:add');
    },

    removeItemAt: function(index, options) {
      options || (options = {});
      this.get('items').splice(index, 1);
      if (!options.silent) {
        this.trigger('change');
        this.trigger('change:items');
        this.trigger('change:items:remove');
      }
    },

    addCast: function(castMember) {
      var cast = this.attributes.cast || (this.attributes.cast = []);
      cast.push(castMember);
      this.trigger('change');
      this.trigger('change:cast');
      this.trigger('change:cast:add');
    },

    removeCastMemberAt: function(index) {
      this.get('cast').splice(index, 1);
      this.trigger('change');
      this.trigger('change:cast');
      this.trigger('change:cast:remove');
    }
  });

  var Map = tww.lib.MapBase.extend({
    model: MapTile,

    url: function() {
      return '/maps/' + this.storyId + '/mapdata.js';
    },

    initialize: function(options) {
      options || (options = {});
      if (options.storyId) this.storyId = options.storyId;
      if (options.story) {
        this.story = options.story;
        this.storyId = this.story.id;
      }
      this.items = [];
      this._dirtyItems = true;
    },

    parse: function(resp) {
      // Turns out mapdata.js doesn't return valid JSON
      // as it uses single instead of double quotes... so
      // we need to work around this problem some ugly way...
      // eval is out of the question as that would potentially
      // be a huge security problem, so instead we just replace
      // single with double quotes and pray nothing breaks
      // (this is very naive, but it should work well enough
      // for demoing purposes).
      if (_.isString(resp)) {
        return JSON.parse(resp.replace(/'/g, '"'));
      } else {
        return resp;
      }
    },

    // Returns the full list of map items
    getItems: function() {
      if (this._dirtyItems) {
        this._buildItemsList();
        this._dirtyItems = false;
      }

      return this.items;
    },

    _buildItemsList: function() {
      var items = [];
      this.each(function(tile) {
        var tileItems = tile.get('items');
        if (tileItems) {
          _.each(tileItems, function(item) {
            item.tile = tile;
          });
          Array.prototype.push.apply(items, tileItems);
        }
      });
      return this.items = items;
    }
  });

  _.extend(this.tww.models, {
    MapTile: MapTile,
    Map: Map
  });
}).call(this);
