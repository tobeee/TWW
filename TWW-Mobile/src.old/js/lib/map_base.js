(function() {
  // Maps don't really fit into Backbone's Model/Collection
  // model, so we define our own classes for it.
  //
  // A Map is composed of MapTiles. MapTiles are uniquely
  // idenfied by their x,y position in their parent Map,
  // and don't have any other unique id.
  //
  // Map and MapTile are intended to work as closely as
  // possible as Backbone Collections and Models.
  //
  // These are just the base classes (MapBase and MapTileBase),
  // meant to bring maps to about the same level of
  // functionality as Backbone's models and collections,
  // allowing it to be extended later (check js/models/map.js
  // for actual application logic for maps).

  var MapTileBase = function(attributes, options) {
    attributes || (attributes = {});

    if (options && options.parse) attributes = this.parse(attributes);

    if (options && options.map) this.map = options.map;
    if (options && options.x !== undefined) this.x = options.x;
    if (options && options.y !== undefined) this.y = options.y;

    this.attributes = {};
    this._escapedAttributes = {};
    this.changed = {};
    this._silent = {};
    this._pending = {};

    this.set(attributes, {silent: true});

    // Reset change tracking.
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this._previousAttributes = _.clone(this.attributes);

    this.initialize.apply(this, arguments);
  };

  _.extend(MapTileBase.prototype, Backbone.Events, {
    changed:  null,
    _silent:  null,
    _pending: null,

    initialize: function() {},

    parse: function(response) {
      return response;
    },

    set: function(key, value, options) {
      var attrs, attr, val;

      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }

      options || (options = {});
      if (!attrs) return this;
      if (attrs instanceof MapTileBase) attrs = attrs.attributes;
      if (options.unset) for (attr in attrs) attrs[attr] = void 0;

      var changes = options.changes = {};
      var now = this.attributes;
      var escaped = this._escapedAttributes;
      var prev = this._previousAttributes || {};

      for (attr in attrs) {
        val = attrs[attr];

        if (!_.isEqual(now[attr], val) || (options.unset && _.has(now, attr))) {
          delete escaped[attr];
          (options.silent ? this._silent : changes)[attr] = true;
        }

        options.unset ? delete now[attr] : now[attr] = val;

        if (!_.isEqual(prev[attr], val) || (_.has(now, attr) != _.has(prev, attr))) {
          this.changed[attr] = val;
          if (!options.silent) this._pending[attr] = true;
        } else {
          delete this.changed[attr];
          delete this._pending[attr];
        }
      }

      if (!options.silent) this.change(options);
      return this;
    },

    north: function() {
      try {
        return this.map.get(this.x, this.y - 1);
      } catch(e) {
        return null;
      }
    },

    east: function() {
      try {
        return this.map.get(this.x + 1, this.y);
      } catch(e) {
        return null;
      }
    },

    south: function() {
      try {
        return this.map.get(this.x, this.y + 1);
      } catch(e) {
        return null;
      }
    },

    west: function() {
      try {
        return this.map.get(this.x - 1, this.y);
      } catch(e) {
        return null;
      }
    },

    // Iterate through each caridnal point
    // and call the iterator on each existing
    // tile in those.
    eachCardinal: function(iterator) {
      var me = this;
      _.each(['north', 'east', 'south', 'west'], function(cp) {
        var tile = me[cp]();
        if (tile) iterator(tile);
      });
    }
  });

  // Copy methods from Backbone.Model
  _.each([
    'get', 'escape', 'unset', 'clear', 'change',
    'hasChanged', 'changedAttributes', 'previous',
    'previousAttributes'
  ], function(method) {
    MapTileBase.prototype[method] = Backbone.Model.prototype[method];
  });

  var MapBase = function(options) {
    options || (options = {});
    this._reset();
    this.initialize.apply(this, arguments);
  };

  _.extend(MapBase.prototype, Backbone.Events, {
    model: MapTileBase,

    initialize: function() {},

    reset: function(models, options) {
      models  || (models  = []);
      options || (options = {});

      this._reset();

      var collection = this;

      _.each(models, function(row, y) {
        collection.models.push(_.map(row, function(model, x) {
          return collection._prepareModel(model, x, y, options);
        }));
      });

      this.height = collection.models.length;
      this.width  = collection.models[0].length;

      if (!options.silent) this.trigger('reset', this);

      return this;
    },

    get: function(x, y) {
      if (x >= this.width || y >= this.height) throw new Error("Out of bounds.");
      return this.models[y][x];
    },

    each: function(iterator, context) {
      for (var i = 0; i < this.height; i++) {
        var r = this.models[i];
        for (var j = 0; j < this.width; j++) {
          iterator.call(context, r[j], j, i);
        }
      }
    },

    _reset: function() {
      this.width = 0;
      this.height = 0;
      this.models = [];
    },

    _prepareModel: function(model, x, y, options) {
      options || (options = {});
      if (!(model instanceof MapTileBase)) {
        var attrs = model;
        options.map = this;
        options.x = x;
        options.y = y;
        model = new this.model(attrs, options);
      } else if (!model.map) {
        model.map = this;
        model.x = x;
        model.y = y;
      }
      return model;
    }
  });

  // Copy methods from Backbone.Collection
  _.each(['fetch', 'expired', 'parse'], function(method) {
    MapBase.prototype[method] = Backbone.Collection.prototype[method];
  });

  // Copy Backbone's extend method
  MapTileBase.extend = MapBase.extend = Backbone.Model.extend;

  _.extend(this.tww.lib, {
    MapTileBase: MapTileBase,
    MapBase: MapBase
  });
}).call(this);
