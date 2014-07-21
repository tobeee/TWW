//= require lib/map_tile_base

(function() {
  var _        = this._,
      Backbone = this.Backbone,
      tww      = this.tww;

  var noop = function() { throw "Called a noop method on MapBase."; };

  var reset = function(models, options) {
    options || (options = {});
    var collection = this;

    for (var i = 0, l = this.models.length; i < l; i++) {
      this._removeReference(this.models[i]);
    }

    options.previousModels = this.models;
    this._reset();

    _.each(models, function(row, y) {
      collection.mappedModels.push(_.map(row, function(model, x) {
        var model = collection._prepareModel(model, x, y, options);
        // Listen to model events
        model.on('all', collection._onModelEvent, collection);
        return model;
      }));
    });

    this.height = models.length;
    this.width  = models[0].length;
    this.models = _.flatten(this.mappedModels);

    if (!options.silent) this.trigger('reset', this, options);
    return this;
  };

  var MapBase = Backbone.Collection.extend({
    model: tww.lib.MapTileBase,

    // We only allow resetting the entire
    // map at once, so any method that modifies
    // it partially becomes a noop
    add:          noop,
    push:         noop,
    remove:       noop,
    pop:          noop,
    unshift:      noop,
    shift:        noop,
    slice:        noop,
    sort:         noop,
    sortedIndex:  noop,
    create:       noop,

    // set behaves the same way as reset
    set:   reset,
    reset: reset,

    get: function(idOrX, y) {
      if (y === undefined) {
        return Backbone.Collection.prototype.get.call(this, idOrX);
      }
      return this.coords(idOrX, y);
    },

    at: function(indexOrX, y) {
      if (y === undefined) {
        return Backbone.Collection.prototype.at.call(this, indexOrX);
      }
      return this.coords(indexOrX, y);
    },

    coords: function(x, y) {
      if (x >= this.width || y >= this.height) throw "Out of bounds.";
      return this.mappedModels[y][x];
    },

    each: function(iterator, context) {
      for (var i = 0; i < this.height; i++)
      for (var j = 0; j < this.width; j++) {
        iterator.call(context, this.mappedModels[i][j], j, i);
      }
    },

    _reset: function() {
      this.width = 0;
      this.height = 0;
      this.mappedModels = [];
      Backbone.Collection.prototype._reset.call(this);
    },

    _prepareModel: function(attrs, x, y, options) {
      if (attrs instanceof tww.lib.MapTileBase) {
        if (!attrs.collection) {
          attrs.collection = this;
          attrs.map = this;
          attrs.x = x;
          attrs.y = y;
        }
        return attrs;
      }
      options || (options = {});
      options.collection = this;
      options.x = x;
      options.y = y;
      var model = new this.model(attrs, options);
      if (!model._validate(attrs, options)) {
        this.trigger('invalid', this, attrs, options);
        return false;
      }
      return model;
    }
  });

  tww.lib.MapBase = MapBase;
}).call(this);
