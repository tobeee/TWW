










(function() {
  var tww = new Backbone.Marionette.Application();

  _.extend(tww, {
    models:    {},
    views:     {},
    lib:       {},
    helpers:   {},
    data:      {}
  });

  // Set up some shortcuts
  tww.h = tww.helpers;

  // Shortcut for Backbone.history.navigate
  tww.navigate = function(route, options) {
    Backbone.history.navigate(route, options || {});
  };

  // Don't start Backbone's history until after login
  tww.vent.on("session:start", function() {
    if (!Backbone.history.start()) {
      Backbone.history.navigate('', {trigger: true});
    }
  });

  this.tww = tww;
}).call(this);
(function() {
  var env = this;
  this.Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(id) {
    return env.JST[id];
  };
  this.Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(template) {
    return template;
  };
}).call(this);
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
(function() {
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read':   'GET'
  };

  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  var env = this;

  this.ForgeSync = {
    baseURL: '',

    sync: function(method, model, options) {
      var type = methodMap[method];

      // Default options, unless specified.
      options || (options = {});

      // Default JSON-request options.
      var params = {type: type, dataType: 'json'};

      // Ensure that we have a URL.
      if (!options.url) {
        params.url = (ForgeSync.baseURL + _.result(model, 'url')) || urlError();
      }

      // Ensure that we have the appropriate request data.
      if (!options.data && model && (method == 'create' || method == 'update')) {
        params.contentType = 'application/json';
        params.data = JSON.stringify(model.toJSON());
      }

      // Make the request, allowing the user to override any Ajax options.
      return env.forge.ajax(_.extend(params, options));
    }
  };
}).call(this);
(function() {
  var tww = this.tww;

  var CastMember = Backbone.Model.extend({
    defaults: {
    },

    parse: function(response) {
      return {
        name: response.name,
        desc: response.desc,
        // Spelling of archetype is not consistent
        // across all JSON objects, so we need to
        // normalize it
        archetype: response.archtype || response.archetype
      };
    }
  });

  var Cast = Backbone.Collection.extend({
    model: CastMember
  });

  _.extend(tww.models, {
    CastMember: CastMember,
    Cast: Cast
  });
}).call(this);
(function() {
  var Character = Backbone.Model.extend({
    defaults: {
      name:      "Hero",
      archetype: "A Lawman",
      gender:    "m" // Sexist?
    },

    parse: function(response) {
      var r = {};

      if (response.attributes) {
        var data = JSON.parse(response.attributes.data);

        // Build a minimalist object with just the attributes we need
        r = {
          id:          response.attributes.id,
          user_id:     response.attributes.user_id,
          name:        data.char_name,
          description: data.desc,
          archetype:   data.archetype || data.archtype || this.defaults.archetype,
          mine:        response.char_mine === "mychar"
        };
      } else {
        r = {
          name:        response.name,
          description: response.desc,
          archetype:   response.type || response.archetype || response.archtype || this.defaults.archtype
        };
      }

      // Compact result object
      _.each(r, function(v, k) {
        if (v === undefined) delete r[k];
      });

      return r;
    }
  });

  var Characters = Backbone.Collection.extend({
    model: Character,

    url: '/mobileendpointcharacter.js',

    mine: function() {
      return new Characters(this.where({mine: true}));
    },

    byUser: function(userOrId) {
      var id = _.isNumber(userOrId) ? userOrId : userOrId.id;
      return new Characters(this.where({user_id: id}));
    }
  });

  _.extend(window.tww.models, {
    Character:  Character,
    Characters: Characters 
  });
})();
(function() {
  var INITIAL_FORCE_POINTS = 200;
  var GOD_TURN = true;
  var HERO_TURN = !GOD_TURN;
  var INITIAL_TURN = GOD_TURN;

  var GameState = function(story) {
    this.story = story;

    this.currentChapter = 0;

    // List of current objectives, initialized
    // with first chapter's objectives
    this.objectives = new tww.models.Objectives(
      this.story.get('chapters')[0].objectives
    );

    // List of current cast
    this.cast = new tww.models.Cast();

    this.forcePoints = INITIAL_FORCE_POINTS;

    this.whoseTurn = INITIAL_TURN;
    this.turnCount = 1;

    // Initialize hero's position
    this.heroPos = {};
    this.moveHero(
      this.story.get('hero').xTile,
      this.story.get('hero').yTile
    );

    // TODO: Check with Toby whether this
    // initialization is the right one
    this.inventory = new tww.models.Inventory(
      this.story.get('hero').inventory
    );
  };

  _.extend(GameState.prototype, Backbone.Events, {
    addForcePoints: function(forcePoints) {
      if (forcePoints > 0) {
        this.forcePoints += forcePoints;
        this.trigger('herofp:change', this.forcePoints);
        this.trigger('herofp:add', forcePoints, this.forcePoints);
      }
      return this;
    },

    removeForcePoints: function(forcePoints) {
      if (forcePoints > 0) {
        this.forcePoints -= forcePoints;
        this.trigger('herofp:change', this.forcePoints);
        this.trigger('herofp:remove', forcePoints, this.forcePoints);
      }
      return this;
    },

    endTurn: function(options) {
      options || (options = {});

      this.whoseTurn = !this.whoseTurn;
      this.turnCount++;

      this.trigger('turn:switch', this.whoseTurn);
      this.trigger(this.isGodTurn() ? 'turn:god' : 'turn:hero');

      if (options.publish) {
        this.story.getMessagesHistory().push({
          endTurn: true,
          currentX: this.heroPos.x,
          currentY: this.heroPos.y
        }).publish();
      }

      return this;
    },

    isGodTurn: function() {
      return this.whoseTurn === GOD_TURN;
    },

    isHeroTurn: function() {
      return this.whoseTurn === HERO_TURN;
    },

    moveHero: function(x, y) {
      var mapTile;

      if (x instanceof tww.models.MapTile) {
        mapTile = x;
        x = mapTile.x;
        y = mapTile.y;
      } else {
        mapTile = this.story.getMap().get(x, y);
      }

      mapTile.visit();

      this.heroPos.x = x;
      this.heroPos.y = y;

      this.trigger('hero:move', this.heroPos, mapTile);
    },

    loadChapter: function(index) {
      var chapter = this.story.get('chapters')[index];

      if (!chapter) {
        throw "Invalid chapter index.";
      }

      var mapTile = this.story.getMap().get(chapter.locationX, chapter.locationY);

      this.objectives.reset(chapter.objectives);
      this.moveHero(mapTile);
      this.currentChapter = index;
      this.trigger('chapter:change', chapter, index, mapTile);
    }
  });

  window.tww.models.GameState = GameState;
})();
(function() {
  var Item = Backbone.Model.extend({
  });

  var Inventory = Backbone.Collection.extend({
    model: Item
  });

  _.extend(window.tww.models, {
    Item: Item,
    Inventory: Inventory
  });
})();
(function() {
  var JoinRequest = Backbone.Model.extend({
    url: '/l_requests',

    parse: function() {
      return {};
    }
  });

  window.tww.models.JoinRequest = JoinRequest;
})();
(function() {
  var tww = this.tww;

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

    initialize: function(models, options) {
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

  _.extend(tww.models, {
    MapTile: MapTile,
    Map: Map
  });
}).call(this);
(function() {
  var GameMessage = Backbone.Model.extend({
    // Method to call to apply the effects of this
    // message on the game's state. Needs to be
    // overwritten in subclasses.
    apply: function() {},

    initialize: function() {
      this.story = this.collection.story;
    },

    renderWith: function() {
      return _.underscored(this.get('_type')) + '_message';
    },

    // Pushes message over Faye connection
    publish: function() {
      var message = _.omit(this.attributes, '_type');
      // Include sender id so we can avoid parsing
      // this message again when it appears in the
      // Faye subscription
      message.senderId = tww.session.id;
      tww.fayeClient.publish(this.collection.fayeUrl(), message);
      return this;
    }
  });

  // Expected attributes:
  //
  // - currentX - Hero's current X coordinate
  // - currentY - Hero's current Y coordinate
  //
  var EndTurnMessage = GameMessage.extend({
    defaults: {
      _type: "endTurn"
    },

    apply: function() {
      this.story.state.moveHero(this.get('currentX'), this.get('currentY'));
      this.story.state.endTurn();
      return this;
    }
  });

  // Expected attributes:
  //
  // - sendText - Actual message
  // - actions  - Number of actions
  // - channel  - One of "meta"/"record"
  // - type     - One of "normal"/"action"
  // - who      - One of "hero"/"god"
  //
  var SendTextMessage = GameMessage.extend({
    defaults: {
      _type: "sendText"
    },

    apply: function() {
      if (this.isAction()) {
        this.story.state.removeForcePoints(this.get('actions'));
      }
      return this;
    },

    isRecordText: function() {
      return this.get('channel') === 'record';
    },

    isAction: function() {
      return this.get('type') === 'action';
    }
  });

  var CompletedObjectiveMessage = GameMessage.extend({
    defaults: {
      _type: "completedObjective"
    },

    apply: function() {
      if (!this.getObjective()) {
        alert("Objective not found ):");
        return this;
      }

      this.getObjective().complete();
      // Award FP to the hero
      this.story.state.addForcePoints(this.getObjective().get('fpValue'));

      return this;
    },

    // NOTE: Seems like this needs to look up
    // the objective in a full list of objectives
    // instead of just the current ones, let's
    // figure that out later...
    getObjective: function() {
      if (this.objective) return this.objective;
      var objective = this.story.state.objectives.at(+this.get('arrayPos'));
      if (objective) {
        return this.objective = objective;
      } else {
        return this.objective = new tww.models.Objective({name: 'Unknown Objective', fpValue: 0});
      }
    }
  });

  var CreateCastMessage = GameMessage.extend({
    defaults: {
      _type: "createCast"
    },

    apply: function() {
      this.story.addCast(this.castObject());
      return this;
    },

    castObject: function() {
      return _.pick(this.attributes, 'name', 'desc', 'type');
    }
  });

  var CreateItemMessage = GameMessage.extend({
    defaults: {
      _type: "createItem"
    },

    apply: function() {
      this.story.addItem(this.itemObject());
      return this;
    },

    itemObject: function() {
      return _.pick(this.attributes, 'name', 'desc');
    }
  });

  var CreateEncounterMessage = GameMessage.extend({
    defaults: {
      _type: "createEncounter"
    },

    apply: function() {
      this.story.addEncounter(
        this.encounterObject(),
        this.findChapter()
      );
      return this;
    },

    encounterObject: function() {
      return {
        name:       this.get('name'),
        desc:       this.get('desc'),
        cast:       this.findCast(),
        items:      this.findItems(),
        objectives: [],
        used:       false
      };
    },

    findCast: function() {
      var me = this;
      return _.compact(_.map(this.get('castPresentArray'), function(name) {
        return me.story.findCastByName(name);
      }));
    },

    findItems: function() {
      var me = this;
      return _.compact(_.map(this.get('itemsArray'), function(name) {
        return me.story.findItemByName(name);
      }));
    },

    findChapter: function() {
      return this.story.findChapterByName(this.get('chapterName'));
    }
  });

  var CreateChapterMessage = GameMessage.extend({
    defaults: {
      _type: "createChapter"
    },

    apply: function() {
      this.story.addChapter(this.chapterObject());
      return this;
    },

    chapterObject: function() {
      return {
        name:       this.get('name'),
        desc:       this.get('desc'),
        locationX:  this.get('locationX'),
        locationY:  this.get('locationY'),
        encounters: [],
        objectives: [],
        used:       false
      };
    }
  });

  var CreateLocationMessage = GameMessage.extend({
    defaults: {
      _type: "createLocation"
    },

    apply: function() {
      var tile = this.story.getMap().get(+this.get('locationX'), +this.get('locationY'));
      tile.set({
        name:        this.get('name'),
        desc:        this.get('desc'),
        img:         this.get('src'),
        exitN:       this.get('n'),
        exitE:       this.get('e'),
        exitS:       this.get('s'),
        exitW:       this.get('w'),
        castPresent: this.findCast(),
        items:       this.findItems(),
        verbable:    false,
        wasteland:   false,
        walkable:    true,
        visited:     false
      });
      return this;
    },

    findCast: function() {
      var me = this;
      return _.compact(_.map(this.get('castPresentArray'), function(name) {
        return me.story.findCastByName(name);
      }));
    },

    findItems: function() {
      var me = this;
      return _.compact(_.map(this.get('itemsArray'), function(name) {
        return me.story.findItemByName(name);
      }));
    }
  });

  var CreateObjectiveMessage = GameMessage.extend({
    defaults: {
      _type: "createObjective"
    },

    apply: function() {
      this.story.state.objectives.add({name: this.get('name')});
      return this;
    }
  });

  var MoveChapterMessage = GameMessage.extend({
    defaults: {
      _type: "moveChapter"
    },

    apply: function() {
      this.story.state.loadChapter(+this.get('arrayPos'));
      return this;
    }
  });

  var PlaceStoryItemMessage = GameMessage.extend({
    defaults: {
      _type: "placeStoryItem"
    },

    apply: function() {
      var map = this.story.getMap();
      var tile = map.get(+this.get('xTile'), +this.get('yTile'));
      var item = this.story.get('items')[+this.get('arrayPos')];
      tile.addItem(item);
      return this;
    }
  });

  var PlaceMapItemMessage = GameMessage.extend({
    defaults: {
      _type: "placeMapItem"
    },

    apply: function() {
      var map = this.story.getMap();
      var tile = map.get(+this.get('xTile'), +this.get('yTile'));
      var item = map.getItems()[+this.get('arrayPos')];
      tile.addItem(item);
      return this;
    }
  });

  var GiveItemMessage = GameMessage.extend({
    defaults: {
      _type: "giveItem"
    },

    apply: function() {
      this.story.state.inventory.add(this.itemObject());
      return this;
    },

    itemObject: function() {
      return this.get('data');
    }
  });

  var RemoveItemMessage = GameMessage.extend({
    defaults: {
      _type: "removeItem"
    },

    apply: function() {
      var map = this.story.getMap();
      var tile = map.get(+this.get('xTile'), +this.get('yTile'));
      tile.removeItemAt(+this.get('position'));
      return this;
    }
  });

  var MoveCastMessage = GameMessage.extend({
    defaults: {
      _type: "moveCast"
    },

    apply: function() {
      var map = this.story.getMap();
      var tile = map.get(+this.get('xTile'), +this.get('yTile'));
      var castMember = this.story.get('cast')[+this.get('arrayPos')];
      tile.addCast(castMember);
      return this;
    }
  });

  var RemoveCastMessage = GameMessage.extend({
    defaults: {
      _type: "removeCast"
    },

    apply: function() {
      var map = this.story.getMap();
      var tile = map.get(+this.get('xTile'), +this.get('yTile'));
      tile.removeCastMemberAt(+this.get('arrayPos'));
      return this;
    }
  });

  var RemoveItemFromInvMessage = GameMessage.extend({
    defaults: {
      _type: "removeItemFromInv"
    },

    apply: function() {
      var item = this.story.state.inventory.at(+this.get('position'));
      this.story.state.inventory.remove(item);
      return this;
    }
  });

  var PlayEncounterMessage = GameMessage.extend({
    defaults: {
      _type: "playEncounter"
    },

    apply: function() {
      var encounter = this.getEncounter();
      
      // Append encounter's objectives to story
      this.story.state.objectives.add(encounter.objectives);

      // Reset the current cast with the encounter's
      this.story.state.cast.add(encounter.cast);

      return this;
    },

    getEncounter: function() {
      return this.encounter || (this.encounter = this.story.get('chapters')[+this.get('chapterArrayPos')].encounters[+this.get('encounterArrayPos')]);
    }
  });

  // NOTE: This is not used, according to Toby
  //
  //var MoveHeroMessage = GameMessage.extend({
  //  defaults: {
  //    _type: "moveHero"
  //  }
  //});

  // Expected attributes:
  //
  // - xTile
  // - yTile
  //
  var MoveCharHiddenMessage = GameMessage.extend({
    defaults: {
      _type: "moveCharHidden"
    },

    apply: function() {
      var me = this;
      // Delay effect until end of turn
      this.story.state.on('turn:switch', function() {
        this.story.getMap().get(+this.get('xTile'), +this.get('yTile')).visit();
        me.story.state.off('turn:switch', null, this);
      }, this);
      return this;
    }
  });

  var messagesMap = {
    endTurn:            EndTurnMessage,
    sendText:           SendTextMessage,
    completedObjective: CompletedObjectiveMessage,
    createCast:         CreateCastMessage,
    createItem:         CreateItemMessage,
    createEncounter:    CreateEncounterMessage,
    createChapter:      CreateChapterMessage,
    createLocation:     CreateLocationMessage,
    createObjective:    CreateObjectiveMessage,
    moveChapter:        MoveChapterMessage,
    placeStoryItem:     PlaceStoryItemMessage,
    placeMapItem:       PlaceMapItemMessage,
    giveItem:           GiveItemMessage,
    removeItem:         RemoveItemMessage,
    moveCast:           MoveCastMessage,
    removeCast:         RemoveCastMessage,
    removeItemFromInv:  RemoveItemFromInvMessage,
    playEncounter:      PlayEncounterMessage,
    //moveHero:           MoveHeroMessage,
    moveCharHidden:     MoveCharHiddenMessage
  };

  var MessagesHistory = Backbone.Collection.extend({
    // This function acts as a proxy to the various
    // specific message classes, initializing the right
    // class based on type.
    model: function(attributes, options) {
      var messageClass = _.find(messagesMap, function(v, k) {
        return attributes[k] !== undefined;
      });

      if (messageClass) {
        return new messageClass(attributes, options);
      } else {
        throw new Error("Unknown message type.");
      }
    },

    url: function() {
      return '/maps/' + this.story.id + '/historymobile.js';
    },

    fayeUrl: function() {
      return '/' + this.story.id;
    },

    initialize: function(models, options) {
      var me = this;

      if (options.story) {
        this.story = options.story;
      }

      this.chapters = 0;
      this._chaptersIndex = [];

      this.on('reset', function() { me._indexChapters(); });
    },

    uptoChapter: function(chapterIndex) {
      return this.models.slice(0, this._chaptersIndex[chapterIndex]);
    },

    forChapter: function(chapterIndex) {
      return this.models.slice(this._chaptersIndex[chapterIndex - 1] || 0, this._chaptersIndex[chapterIndex]);
    },

    eachChapter: function(iterator, context) {
      for (var i = 0; i < this.chapters; i++) {
        iterator.call(context, this.forChapter(i), i);
      }
    },

    // Subscribe to Faye messages
    subscribe: function() {
      if (this.subscription) return;
      var me = this;
      this.subscription = tww.fayeClient.subscribe(this.fayeUrl(), function(messageData) {
        // Ignore message if it was sent by this user
        if (messageData.senderId && messageData.senderId == tww.session.id) return;
        me.push(messageData).apply();
      });
      //this.subscription.callback(function() { alert("Subscription accepted."); });
      this.subscription.errback(function(error) { alert("Faye subscription failed: " + error.message); });
    },

    unsubscribe: function() {
      if (this.subscription) {
        this.subscription.cancel();
        this.subscription = null;
      }
    },

    _indexChapters: function() {
      this._chaptersIndex = [];
      for (var i = 0; i < this.length; i++) {
        if (this.models[i] instanceof MoveChapterMessage) {
          this._chaptersIndex.push(i);
        }
      }
      this.chapters = this._chaptersIndex.length + 1;
    }
  });

  window.tww.models.MessagesHistory = MessagesHistory;
})();
(function() {
  var Objective = Backbone.Model.extend({
    defaults: {
      fpValue:   20,
      played:    false,
      completed: false,
      used:      false,
      current:   false
    },

    current: function() {
      return this.get('played') && !this.get('completed');
    },

    complete: function() {
      return this.set({
        completed: true,
        used:      true
      });
    }
  });

  var Objectives = Backbone.Collection.extend({
    model: Objective
  });

  _.extend(window.tww.models, {
    Objective:  Objective,
    Objectives: Objectives
  });
})();
(function() {
  var root = this;
  var tww = this.tww;

  var associationsMap = {
    'godUser':  'getGodUser',
    'map':      'getMap',
    'messages': 'getMessagesHistory'
  };

  var Story = this.Backbone.Model.extend({
    url: function() {
      return '/maps/' + this.id + '/storydata.js';
    },

    initialize: function(attributes, options) {
      var me = this;

      // Link to the story's Map instance
      this.map = null;

      // Link to the story's message history
      this.messagesHistory = null;

      // Link to the god user
      this.godUser = null;

      // The game's state
      this.state = null;

      this.started = false;
    },

    parse: function(response) {
      // Story information comes from two
      // different endpoints: one for the
      // collection and a second one for
      // single stories, but there's no
      // overlapping of fields between the
      // two, so we need to check which
      // object is being fed here and parse
      // it accordingly.
      //
      if (typeof response.story_id !== 'undefined') {
        // Collection
        return {
          id:            response.story_id,
          title:         response.summary ? response.summary.trim() : '',
          my_turn:       response.mygo === 'mygo',
          mine:          response.my_story === 'my_story',

          // TODO: These two are redundant, refactor to keep just one
          has_character: response.has_character !== 0,
          character_id:  response.has_character !== 0 ? response.has_character : null,

          finished:      response.finished === 1,
          last_updated:  moment(response.lastupdated || 0),

          creator_id:    response.storycreatorid
        };
      } else {
        // Single resource
        var data = JSON.parse(response.storydata);

        return {
          type:           data.type,
          cast:           data.cast,
          items:          data.items,
          hero:           data.hero,
          hero_role_type: tww.data.roleTypes[response.pcArchType || "An Unknown Role"],
          join_requests:  response.joinrequests,
          chapters:       data.chapters
        };
      }
    },

    hasJoinRequests: function() {
      return _.any(this.get('join_requests'));
    },

    hasJoinRequestByUser: function(id) {
      id == id ? id : tww.session.id;
      return _.any(this.get('join_requests'), function(j) {
        return j.user === id;
      });
    },

    canApplyToJoin: function() {
      return !this.get('mine') && !this.get('has_character') && !this.hasJoinRequests();
    },

    appliedToJoin: function() {
      return !this.get('mine') && !this.get('has_character') && this.hasJoinRequestByUser();
    },

    mapTileForChapter: function(chapterIndex) {
      var chapter = this.get('chapters')[chapterIndex];
      return this.getMap().at(+chapter.locationX, +chapter.locationY);
    },

    findCastByName: function(name) {
      return _.find(this.get('cast'), function(castMember) {
        return castMember.name == name;
      });
    },

    findChapterByName: function(name) {
      return _.find(this.get('chapters'), function(chapter) {
        return chapter.name == name
      });
    },

    findItemByName: function(name) {
      return _.find(this.get('items'), function(item) {
        return item.name == name;
      });
    },

    addCast: function(castObject) {
      var cast = this.attributes.cast || (this.attributes.cast = []);
      cast.push(castObject);
      this.trigger('change');
      this.trigger('change:cast');
      this.trigger('change:cast:add', castObject);
    },

    addItem: function(itemObject) {
      var items = this.attributes.items || (this.attributes.items = []);
      items.push(itemObject);
      this.trigger('change');
      this.trigger('change:items');
      this.trigger('change:items:add', itemObject);
    },

    addEncounter: function(encounterObject, chapter) {
      var chapterEncounters = chapter.encounters || (chapter.encounters = []);
      chapterEncounters.push(encounterObject);
      this.trigger('change');
      this.trigger('change:chapters');
      this.trigger('change:chapters:change', chapter);
      this.trigger('change:chapters:change:add_encounter', chapter, encounterObject);
    },

    addChapter: function(chapterObject) {
      var chapters = this.attributes.chapters || (this.attributes.chapters = []);
      chapters.push(chapterObject);
      this.trigger('change');
      this.trigger('change:chapters');
      this.trigger('change:chapters:add');
    },

    eachChapter: function(callback, context) {
      var me = this;
      _.each(this.get('chapters') || [], function(chapter, i) {
        callback.call(context, chapter, i, me.mapTileForChapter(i));
      });
    },

    eachVisitedChapter: function(callback, context) {
      var me = this;
      var chapters = this.get('chapters');
      this.getMessagesHistory().eachChapter(function(chapterMessages, i) {
        callback.call(context, chapters[i], chapterMessages, me.mapTileForChapter(i), i);
      }, context);
    },

    // Asynchronously fetches a list of given
    // associations (e.g. map, messages, godUser),
    // and fires the success method given in
    // the options after all were loaded.
    fetchAssociations: function(associations, options) {
      var me = this;
      options || (options = {});

      var associationObjects = _.compact(_.map(associations, function(assoc) {
        if (_.has(associationsMap, assoc)) {
          return me[associationsMap[assoc]]();
        }
      }));

      var count = associationObjects.length;

      var success = function() {
        if (!--count) {
          options.success && options.success();
        }
      };

      _.invoke(associationObjects, 'fetch', {
        reset: true,
        success: success
      });
    },

    getGodUser: function() {
      return this.godUser || (this.godUser = new tww.models.User({id: this.get('creator_id')}));
    },

    getMap: function() {
      return this.map || (this.map = new tww.models.Map(null, {story: this}));
    },

    getMessagesHistory: function() {
      return this.messagesHistory || (this.messagesHistory = new tww.models.MessagesHistory(undefined, {story: this}));
    },

    // Fetches map and messages and
    // initializes the game state.
    //
    // Takes a success callback in
    // options, which will get called
    // even if the game was already
    // started before, useful to call
    // a render method...
    start: function(options) {
      options || (options = {});

      var me = this;

      if (this.started) {
        // Make sure we're subscribed to incoming messages
        this.messagesHistory.subscribe();
        options.success && options.success(this);
        return;
      }

      this.fetchAssociations(['map', 'messages'], {
        success: function() {
          me.state = new tww.models.GameState(me);
          me.messagesHistory.invoke('apply');
          me.messagesHistory.subscribe();
          me.started = true;
          options.success && options.success(me);
          me.trigger("start", options);
        }
      });

      return true;
    },

    stop: function() {
      this.getMessagesHistory().unsubscribe();
      this.started = false;
      this.trigger("stop");
    }
  });

  var Stories = this.Backbone.Collection.extend({
    model: Story,

    url: '/mobileendpoint.js',

    comparator: function(story) {
      return story.has('last_updated') ?
        story.get('last_updated').unix() :
        0;
    },

    myTurn: function() {
      return new Stories(this.where({my_turn: true}));
    },

    toRead: function() {
      return new Stories(this.where({finished: true}));
    },

    heroWanted: function() {
      return new Stories(this.where({has_character: false}));
    },

    withCharacter: function(characterOrId) {
      var id = _.isNumber(characterOrId) ? characterOrId : characterOrId.id;
      return this.where({character_id: id});
    },

    byGod: function(userOrId) {
      var id = _.isNumber(userOrId) ? userOrId : userOrId.id;
      return new Stories(this.where({creator_id: id}));
    }
  });

  _.extend(tww.models, {
    Story:   Story,
    Stories: Stories
  });
}).call(this);
(function() {
  var User = Backbone.Model.extend({
    url: function() {
      return '/users/' + this.id + '.js'
    },

    parse: function(response) {
      return response.user;
    }
  });

  window.tww.models.User = User;
})();
(function() {
  var verticalPadding = function(el) {
    return parseInt($(el).css('padding-top'), 10) + parseInt($(el).css('padding-bottom'), 10);
  };

  // Mixin that provides views with a method to adjust
  // their height to span the entire screen
  this.tww.lib.AdjustableHeight = {
    adjustHeight: function() {
      this.$el.css('min-height', $(window).height() - verticalPadding(this.$el) - verticalPadding(document.body));
      this.trigger('resize');
      return this;
    },

    onShow: function() {
      this.adjustHeight();
    }
  };
}).call(this);
(function() {
  var tww = this.tww;

  var AppliedToJoin = Marionette.View.extend(_.extend({}, tww.lib.AdjustableHeight, {
    className: 'page book-left applied-to-join',

    events: {
      'click .applied-ok': 'showStory',
      'click .applied-to-join-story': 'showStory',
      'click .applied-to-join-hero': 'showHero',
      'click .applied-to-join-god': 'showUser'
    },

    initialize: function(options) {
      this.story = options.story;
      this.hero = options.hero;
      this.story.fetch();
    },

    render: function() {
      this.$el.html(tww.t.applied_to_join({
        story: this.story,
        hero: this.hero
      }));
      return this;
    },

    showStory: function() {
      tww.router.navigate('stories/' + this.story.id, {trigger: true});
    },

    showHero: function() {
      tww.router.navigate('characters/' + this.hero.id, {trigger: true});
    },

    showUser: function() {
      tww.router.navigate('users/' + this.story.get('creator_id'), {trigger: true});
    },

    close: function() {
      this.undelegateEvents();
    }
  }));

  tww.views.AppliedToJoin = AppliedToJoin;
}).call(this);
(function() {
  var tww = this.tww;

  var BOOKSHELF_TOP_HEIGHT = 22;
  var BOOKSHELF_SHELF_HEIGHT = 273;
  var BOOKSHELF_HORIZONTAL_MARGIN = 35;
  var BOOKSHELF_VERTICAL_MARGIN = 19;

  // How many items to show in the unexpanded view
  var BOOKSHELF_COMPACT_LIMIT = 3;

  var validOptions = [
    "title",
    "collection",
    "filter",
    "expanded",
    "expandedRoute",
    "fetch",
    "showAddButton"
  ];

  var Bookshelf = Marionette.View.extend({
    className: "bookshelf section",

    events: {
      "click .bookshelf-header": "handleBookshelfHeaderClick"
    },

    initialize: function(options) {
      var me = this;
      options = options || {};

      if (options.preset) {
        _.defaults(options, this.presets[options.preset]);
        delete options.preset;
      }

      _.extend(this, _.pick(options, validOptions));

      this.listenTo(this.collection, "reset", function() {
        me.renderItems();
      });
    },

    render: function() {
      this.$el.html(JST["bookshelf"]({
        title:         _.result(this, 'title'),
        showAddButton: !!this.showAddButton,
        toggleButton:  !!this.expandedRoute 
      })).addClass(this.expanded ? 'expanded' : 'compact');

      // Keep a reference to the content child element
      // for rendering items
      this.$contentEl = this.$('.bookshelf-content');

      // Render items if any are available
      if (this.collection.length) {
        this.renderItems();
      }

      return this;
    },

    renderItems: function() {
      var filtered = this.filteredCollection();
      this.$contentEl.html(JST[this.itemsTemplate]({
        collection: filtered
      }));
    },

    filteredCollection: function() {
      var filtered;

      if (this.filter) {
        if (_.isFunction(this.filter)) {
          filtered = this.filter(this.collection);
        } else {
          filtered = _.result(this.collection, this.filter);
        }
      } else {
        filtered = this.collection;
      }

      if (this.expanded) {
        return filtered.models;
      } else {
        return filtered.first(BOOKSHELF_COMPACT_LIMIT);
      }
    },

    // Manually position items within the shelves
    // so they are evenly distributed and new shelves
    // are added if needed.
    reflow: function() {
      var scale       = window.innerWidth <= 640 ? 0.5 : 1,
          bookEls     = this.$('.book, .hero'),
          wrapperEl   = this.$('.bookshelf-content-wrapper'),
          contentEl   = this.$contentEl,
          bookWidth   = bookEls.outerWidth(),
          bookHeight  = bookEls.outerHeight(),
          shelfWidth  = contentEl.width() - (BOOKSHELF_HORIZONTAL_MARGIN * scale * 2),
          booksPerRow = Math.floor(shelfWidth / bookWidth),
          shelves     = Math.max(Math.ceil(bookEls.length / booksPerRow), 1),
          gutterWidth = Math.round((shelfWidth - (booksPerRow * bookWidth)) / (booksPerRow - 1));

      contentEl.css('height', Math.round(scale * (BOOKSHELF_TOP_HEIGHT + BOOKSHELF_SHELF_HEIGHT * shelves)));

      bookEls.each(function(i, book) {
        var row = Math.floor(i / booksPerRow),
            col = i % booksPerRow;

        $(book).css({
          left: Math.round(scale * BOOKSHELF_HORIZONTAL_MARGIN) + col * (bookWidth + (col ? gutterWidth : 0)),
          top:  Math.round(scale * (BOOKSHELF_TOP_HEIGHT + BOOKSHELF_VERTICAL_MARGIN + row * BOOKSHELF_SHELF_HEIGHT))
        });
      });

      if (this.expanded) {
        wrapperEl.css({
          height:   window.innerHeight - this.$('.bookshelf-header').height(),
          overflow: 'auto'
        });
      }

      return this;
    },

    onShow: function() {
      this.reflow();
    },

    toggle: function() {
      if (this.expandedRoute) {
        //tww.router.navigate(this.expanded ? '' : this.expandedRoute, {trigger: true});
        this.trigger("bookshelf:toggle", this, this.collection);
      }
    },

    handleBookshelfHeaderClick: function(e) {
      if ($(e.target).is('.bookshelf-header, .bookshelf-toggle, .bookshelf-toggle *')) {
        this.toggle();
      }
    },

    showItem: function(e) {
      var target = $(e.target);

      if (target.hasClass('book')) {
        var bookId = target.data('book-id');
        tww.router.navigate('stories/' + bookId, {trigger: true});
      } else if (target.hasClass('hero')) {
        var charId = target.data('character-id');
        tww.router.navigate('characters/' + charId, {trigger: true});
      }
    }
  });

  tww.views.Bookshelf = Bookshelf;
}).call(this);
(function() {
  var tww = this.tww;

  tww.views.ForcePoints = Marionette.ItemView.extend({
    className: "force-points",

    template: "force_points",

    events: {
      "click .force-points-buy-more": "buy"
    },

    modelEvents: {
      "change:fp": "render"
    },
    
    buy: function() {
      alert("Buy");
      tww.execute("fp:buy");
    }
  });
}).call(this);
(function() {
  var tww = this.tww;

  var HeroesBookshelf = tww.views.Bookshelf.extend({
    className: 'section bookshelf heroes-bookshelf',

    itemsTemplate: 'heroes',

    events: _.extend({}, tww.views.Bookshelf.prototype.events, {
      "click .bookshelf-add": "createCharacter"
    }),

    presets: {
      yourHeroes: {
        title: "Your Heroes.",
        filter: 'mine',
        expandedRoute: 'your-heroes',
        showAddButton: true
      }
    },

    createCharacter: function() {
      tww.execute("character:edit");
    }
  });

  tww.views.HeroesBookshelf = HeroesBookshelf;
}).call(this)
;
(function() {
  var Notifications = Backbone.View.extend({
    el: '#tww-notifications',

    events: {
      'click .notification': 'openNotification'
    },

    initialize: function() {
      var me = this;

      this.$containerEl = $('#tww-notifications-container');

      this.collection.on('reset', function() {
        me.render();
      }, this);

      this.collection.fetch({data: {email: tww.session.email}});
    },

    render: function() {
      this.$containerEl.html(tww.t.notifications({
        notifications: this.collection.myTurn()
      }));
    },

    close: function() {
      this.undelegateEvents();
      this.collection.off(null, null, this);
    },

    show: function() {
      this.$el.show();

      this.$containerEl.css({
        height: $(window).height() - parseInt(this.$el.css('top'))
      });

      return this;
    },

    hide: function() {
      this.$el.hide();

      return this;
    },

    openNotification: function(e) {
    }
  });

  window.tww.views.Notifications = Notifications;
})();
(function() {
  var tww = this.tww;

  var RoleTypeSummary = Backbone.View.extend(_.extend({}, tww.lib.AdjustableHeight, {
    className: 'page book-left role-type-summary',

    render: function() {
      this.$el.html(tww.t.role_type_summary({
        story: this.model
      }));
      return this;
    }
  }));

  tww.views.RoleTypeSummary = RoleTypeSummary;
}).call(this);
(function() {
  var tww = this.tww;

  var StoriesBookshelf = tww.views.Bookshelf.extend({
    className: 'section bookshelf stories-bookshelf',

    itemsTemplate: 'books',

    presets: {
      yourTurn: {
        title: "It's your turn!",
        filter: 'myTurn',
        expandedRoute: 'your-turn'
      },

      toRead: {
        title: "You might like to read&hellip;",
        filter: 'toRead',
        expandedRoute: 'to-read'
      },

      heroWanted: {
        title: "Hero wanted.",
        filter: 'heroWanted',
        expandedRoute: 'hero-wanted'
      }
    }
  });

  tww.views.StoriesBookshelf = StoriesBookshelf;
}).call(this)
;
(function() {
  this.tww.module("browse", function(module, app, Backbone, Marionette, $, _) {
    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        "":             "showIndex",
        "your-turn":    "showUserTurnStories",
        "to-read":      "showToReadStories",
        "hero-wanted":  "showHeroWantedStories",
        "your-heroes":  "showUserHeroes"
      }
    });

    var api = {
      showIndex: function() {
        $.when(
          app.request("stories"),
          app.request("characters")
        ).done(_.bind(this._showIndex, this));
      },

      showUserTurnStories: function() {
        var me = this;
        $.when(app.request("stories")).done(function(stories) {
          me._showBookshelf('yourTurn', 'your-turn', 'StoriesBookshelf', stories);
        });
      },

      showToReadStories: function() {
        var me = this;
        $.when(app.request("stories")).done(function(stories) {
          me._showBookshelf('toRead', 'to-read', 'StoriesBookshelf', stories);
        });
      },

      showHeroWantedStories: function() {
        var me = this;
        $.when(app.request("stories")).done(function(stories) {
          me._showBookshelf('heroWanted', 'hero-wanted', 'StoriesBookshelf', stories);
        });
      },

      showUserHeroes: function() {
        var me = this;
        $.when(app.request("characters")).done(function(characters) {
          me._showBookshelf('yourHeroes', 'your-heroes', 'HeroesBookshelf', characters);
        });
      },

      _showIndex: function(stories, characters) {
        var me = this;
        var view = new module.views.Index({
          stories:    stories,
          characters: characters
        });

        view.on("yourTurn:toggle", function(view, collection) {
          me._showBookshelf('yourTurn', 'your-turn', 'StoriesBookshelf', collection);
        });
        view.on("toRead:toggle", function(view, collection) {
          me._showBookshelf('toRead', 'to-read', 'StoriesBookshelf', collection);
        });
        view.on("heroWanted:toggle", function(view, collection) {
          me._showBookshelf('heroWanted', 'hero-wanted', 'StoriesBookshelf', collection);
        });
        view.on("yourHeroes:toggle", function(view, collection) {
          me._showBookshelf('yourHeroes', 'your-heroes', 'HeroesBookshelf', collection);
        });

        app.mainRegion.show(view);
        app.navigate("");
      },

      // Generic display of a bookshelf with a preset
      _showBookshelf: function(preset, route, view, collection) {
        var me = this;
        var view = new app.views[view]({
          preset:      preset,
          collection:  collection,
          expanded:    true
        });
        view.on("bookshelf:toggle", function() {
          me.showIndex();
        });
        app.mainRegion.show(view);
        app.navigate(route);
      }
    };

    app.addInitializer(function() {
      new Router({controller: api});
    });
  });
}).call(this);
(function() {
  this.tww.module("browse.views", function(module, app, Backbone, Marionette) {
    module.ForcePoints = app.views.ForcePoints.extend({
      className: "force-points section",
      template: "index/force_points"
    });
  });
}).call(this);
(function() {
  this.tww.module("browse.views", function(module, app, Backbone, Marionette) {
    module.Index = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: "index",

      initialize: function(options) {
        var me = this;

        this.stories = options.stories;
        this.characters = options.characters;

        // Your Turn
        this.yourTurnSubview = new tww.views.StoriesBookshelf({
          preset: 'yourTurn',
          collection: this.stories
        });
        this.listenTo(this.yourTurnSubview, "bookshelf:toggle", function(view, collection) {
          me.trigger("yourTurn:toggle", view, collection)
        });

        // To Read
        this.toReadSubview = new tww.views.StoriesBookshelf({
          preset: 'toRead',
          collection: this.stories
        });
        this.listenTo(this.toReadSubview, "bookshelf:toggle", function(view, collection) {
          me.trigger("toRead:toggle", view, collection);
        });

        // Hero Wanted
        this.heroWantedSubview = new tww.views.StoriesBookshelf({
          preset: 'heroWanted',
          collection: this.stories
        });
        this.listenTo(this.heroWantedSubview, "bookshelf:toggle", function(view, collection) {
          me.trigger("heroWanted:toggle", view, collection);
        });

        // Your Heroes
        this.yourHeroesSubview = new tww.views.HeroesBookshelf({
          preset: 'yourHeroes',
          collection: this.characters
        });
        this.listenTo(this.yourHeroesSubview, "bookshelf:toggle", function(view, collection) {
          me.trigger("yourHeroes:toggle", view, collection);
        });

        // Force Points
        this.forcePointsSubview = new module.ForcePoints({
          model: app.request("session:data")
        });

        this.subviews = [
          this.yourTurnSubview,
          this.toReadSubview,
          this.heroWantedSubview,
          this.yourHeroesSubview,
          this.forcePointsSubview
        ];
      },

      render: function() {
        var me = this;
        _.each(this.subviews, function(s) {
          me.$el.append(s.render().el);
        });
        this.triggerMethod("render", this);
        return this;
      },

      onShow: function() {
        _.each(this.subviews, function(subview) {
          Marionette.triggerMethod.call(subview, "show");
        });
        this.adjustHeight();
      }
    }));
  });
}).call(this);
(function() {
  this.tww.module("characters", function(module, app, Backbone, Marionette) {
    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        "characters/:id":  "showCharacterDetails"
      }
    });

    var api = {
      showCharacterDetails: function(id) {
        $.when(
          app.request("character", id),
          app.request("stories")
        ).done(this._showCharacterDetails);
      },

      _showCharacterDetails: function(character, stories) {
        var view = new module.views.CharacterDetails({
          model: character,
          stories: stories
        });
        app.mainRegion.show(view);
        app.navigate("characters/" + character.id);
      }
    };

    app.commands.setHandler("character:show", function(characterOrId) {
      api.showCharacterDetails(characterOrId instanceof Backbone.Model ? characterOrId.id : characterOrId);
    });

    app.addInitializer(function() {
      new Router({controller: api});
    });
  });
}).call(this);
(function() {
  this.tww.module("characters.editor", function(module, app, Backbone, Marionette) {
    module.CharacterEditController = Marionette.Controller.extend({
      initialize: function(options) {
        this.model = options.model;
        this._setupLayout();
      },

      start: function() {
        this.editNameAndGender();
      },

      editNameAndGender: function() {
        var view = this._changeView('NameAndGender');
        var controller = this;
        this.listenToOnce(view, "done", function() {
          controller.pickBodyType();
        });
      },

      pickBodyType: function() {
        var view = this._changeView('BodyType');
        var controller = this;
        this.listenToOnce(view, "done", function() {
          //controller.
          //alert("TODO: Jump to body customizer");
          controller.editQuestions();
        });
      },

      editQuestions: function() {
        var view = this._changeView('Questions', {
          questions: app.data.characterQuestions[0]
        });
        var controller = this;
        this.listenToOnce(view, "done", function() {
          controller.editItems();
        });
      },

      editItems: function() {
        var view = this._changeView('Items', {
        });
      },

      save: function() {
        var me = this;
        $.when(
          app.request("characters")
        ).done(function(collection) {
          collection.add(me.model);
          me.model.save();
        });
      },

      _changeView: function(viewName, options) {
        options || (options = {});
        var view = new module.views[viewName](
          _.extend({model: this.model}, options)
        );
        this.layout.body.show(view);
        this.trigger("view:change", view, viewName);
        return view;
      },

      _setupLayout: function() {
        this.layout = new module.views.Layout;
        // Listen to toolbar events
        this.listenTo(this.layout, "toolbar:body",  _.bind(this.pickBodyType, this));
        this.listenTo(this.layout, "toolbar:name",  _.bind(this.editNameAndGender, this));
        this.listenTo(this.layout, "toolbar:story", _.bind(this.editQuestions, this));
        this.listenTo(this.layout, "toolbar:items", _.bind(this.editItems, this));
        this.listenTo(this.layout, "toolbar:save",  _.bind(this.save, this));
        // Add layout to main region
        app.mainRegion.show(this.layout);
      }
    });
  });
}).call(this);
(function() {
  this.tww.module("characters.editor", function(module, app, Backbone, Marionette) {
    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        "characters/edit": "showCharacterEditMain"
      }
    });

    var api = {
      showCharacterEditMain: function() {
        var view = new module.views.Main();
        app.mainRegion.show(view);
        app.navigate("characters/edit");
      },

      showCharacterPicker: function() {
        $.when(app.request("characters")).done(function(characters) {
          var view = new module.views.CharacterPicker({
            collection: characters
          });
          app.mainRegion.show(view);
        });
      },

      showArchetypePicker: function() {
        $.when(app.request("archetypes")).done(function(archetypes) {
          var view = new module.views.ArchetypePicker({collection: archetypes});
          app.mainRegion.show(view);
        });
      }
    };

    // Shows the character picker for editing an existing character
    app.commands.setHandler("character:edit:create", function() {
      api.showArchetypePicker();
    });

    // Shows the character picker for editing an existing character
    app.commands.setHandler("character:edit:pick", function() {
      api.showCharacterPicker();
    });

    app.commands.setHandler("character:edit", function(character) {
      api.showCharacterEditMain();
    });

    // Starts the character builder wizard
    app.commands.setHandler("character:edit:build", function(characterOrArchetype) {
      if (characterOrArchetype instanceof app.models.Character) {
        var character = characterOrArchetype;
      } else {
        var character = new tww.models.Character({
          archetype: characterOrArchetype,
          user_id:   app.request("session:data").get("id"),
          mine:      true
        });
      }

      var controller = new module.CharacterEditController({
        model: character
      });

      controller.start();
    });

    app.addInitializer(function() {
      new Router({controller: api});
    });
  });
}).call(this);
(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.ArchetypePicker = Marionette.View.extend({
      className: 'archetype-picker section',

      events: {
        'click .archetype': 'pickArchetype'
      },

      render: function() {
        this.$el.html(tww.t['character_editor/archetype_picker']({
          archetypes: this.collection
        }));
        return this;
      },

      pickArchetype: function(e) {
        var archetypeEl = $(e.target).closest('.archetype');
        app.execute("character:edit:build", archetypeEl.data('archetype-name'));
      }
    });
  });
}).call(this);
(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.BodyType = Marionette.ItemView.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: "page book-right character-edit-body",

      template: "character_editor/body_type",

      templateHelpers: function() {
        return { bodyTypes: app.data.bodyTypes }
      },

      events: {
        "click .character-body-type": "pick",
        "click #character-body-ok":   "done"
      },

      onRender: function() {
        this.$bodyTypes = this.$(".character-body-type");
        var current;
        if (this.model.get("body_type")) {
          current = this.$bodyTypes.filter("[data-id=" + this.model.get("body_type") + "]");
        } else {
          current = this.$bodyTypes.first();
        }
        this._setCurrent(current);
      },

      pick: function(e) {
        this._setCurrent($(e.target).closest(".character-body-type"));
      },

      done: function(e) {
        e.preventDefault();
        this.model.set("body_type", this._getCurrent().data("id"));
        this.trigger("done");
      },

      _setCurrent: function(el) {
        this._getCurrent().removeClass("-current");
        $(el).addClass("-current");
      },

      _getCurrent: function() {
        return this.$bodyTypes.filter(".-current");
      }
    }));
  });
}).call(this);
(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.CharacterPicker = app.views.HeroesBookshelf.extend({
      title: "Which Hero would you like to Edit?",

      expanded: true,

      events: {
        "click .hero": "pickHero"
      },

      pickHero: function(e) {
        e.preventDefault();
        var heroEl = $(e.target).closest(".hero");
        $.when(
          app.request("character", heroEl.data("id"))
        ).done(function(character) {
          app.execute("character:edit:build", character);
        });
      }
    });
  });
}).call(this);
(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.Items = Marionette.Layout.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: "character-edit-items",

      template: "character_editor/items/layout",

      regions: {
        forcePoints: ".force-points-container"
      },

      events: {
        "click .force-points-buy-more": "buy"
      },

      onRender: function() {
        this._showForcePoints();
      },

      buy: function() {
        app.execute("fp:buy");
      },

      _showForcePoints: function() {
        if (!this.forcePointsView) {
          this.forcePointsView = new app.views.ForcePoints({
            model: app.request("session:data")
          });
        }
        this.forcePoints.show(this.forcePointsView);
      }
    }));
  });
}).call(this);
(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.Layout = Marionette.Layout.extend({
      id: "character-editor-layout",

      template: "character_editor/layout",

      regions: {
        body: "#character-editor-body"
      },

      triggers: {
        // Toolbar events
        "click #character-editor-goto-body":      "toolbar:body",
        "click #character-editor-goto-items":     "toolbar:items",
        "click #character-editor-goto-purchased": "toolbar:purchased",
        "click #character-editor-goto-name":      "toolbar:name",
        "click #character-editor-goto-story":     "toolbar:story",
        "click #character-editor-goto-looks":     "toolbar:looks",
        "click #character-editor-save":           "toolbar:save"
      },

      onRender: function() {
        $('body').addClass('with-top-nav with-bottom-nav');
      },

      onClose: function() {
        $('body').removeClass('with-top-nav with-bottom-nav');
      }
    });
  });
}).call(this);
(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.Main = Marionette.ItemView.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: 'page book-left character-edit-main',

      template: "character_editor/main",

      events: {
        "click .character-new":  "create",
        "click .character-edit": "edit"
      },

      create: function() {
        app.execute("character:edit:create");
      },

      edit: function() {
        app.execute("character:edit:pick");
      }
    }));
  });
}).call(this);
(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.NameAndGender = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: "page book-right character-edit-name-and-gender",

      events: {
        "submit #character-name-and-gender-form": "done"
      },

      render: function() {
        this.$el.html(tww.t["character_editor/name_and_gender"]({
          character: this.model
        }));
        return this;
      },

      done: function(e) {
        e.preventDefault();
        this.model.set("name", this.$("#character-name").val());
        this.model.set("gender", this.$("#character-gender").val());
        this.trigger("done");
      }
    }));
  });
}).call(this);
(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.Question = Marionette.View.extend({
      className: "character-question",

      initialize: function(options) {
        this.question = options.question;
      },

      render: function() {
      }
    });

    module.Questions = Marionette.View.extend({
      className: "page book-right character-edit-questions",

      events: {
        "click .character-questions-ok": "done"
      },

      initialize: function(options) {
        this.questions = options.questions;
        this.questionViews = [];
        this._loadExistingQuestionViews();
      },

      render: function() {
        this.$el.html(tww.t["character_editor/questions"]({
          character: this.model,
          questions: this.questions
        }));
        return this;
      },

      done: function() {
        this.trigger("done");
      },

      _loadExistingQuestionViews: function() {
        //_.each(this.model.questions, function(question) {
        //  this.questionViews.push();
        //})
        _.each(this.questions.questions, function(question) {
          
        });
      }
    });
  });
}).call(this);
(function() {
  this.tww.module("characters.views", function(module, app, Backbone, Marionette) {
    module.CharacterDetails = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: 'hero-details',

      initialize: function(options) {
        this.stories = options.stories;
        this.characterStories = new tww.models.Stories(this.stories.withCharacter(this.model));
        this.bookshelfView = new tww.views.StoriesBookshelf({
          title: "This Hero was featured in",
          collection: this.characterStories
        });
      },

      render: function() {
        this.$el.html(tww.t.hero_details({
          hero: this.model
        }));
        this.$el.append(this.bookshelfView.render().el);
        return this;
      },

      onShow: function() {
        Marionette.triggerMethod.call(this.bookshelfView, 'show');
        this.adjustHeight();
      }
    }));
  });
}).call(this);
(function() {
  this.tww.module("entities", function(module, app, Backbone, Marionette, $, _) {
    module._userScopedCollections = {};

    module.fetchUserScopedCollection = function(name, collectionClass) {
      if (module._userScopedCollections[name]) return module._userScopedCollections[name];
      var defer = $.Deferred();
      var userData = app.request("session:data");
      var collection = new collectionClass;
      collection.fetch({
        data: _.pick(userData, 'email'),
        success: function() {
          module._userScopedCollections[name] = collection;
          defer.resolve(collection);
        },
        error: function() { defer.resolve(undefined); }
      });
      return defer.promise();
    };
  });
}).call(this);
(function() {
  this.tww.module("entities.archetypes", function(module, app, Backbone, Marionette) {
    app.reqres.setHandler("archetypes", function() {
      return _.values(app.data.roleTypes);
    });
  })
}).call(this);
(function() {
  this.tww.module("entities.characters", function(module, app, Backbone, Marionette, $, _) {
    app.reqres.setHandler("characters", function() {
      return app.entities.fetchUserScopedCollection("characters", app.models.Characters);
    });

    app.reqres.setHandler("character", function(id) {
      var defer = $.Deferred();
      $.when(
        app.request("characters")
      ).done(function(characters) {
        defer.resolve(characters.get(id));
      });
      return defer.promise();
    });
  });
}).call(this);
(function() {
  this.tww.module("entities.stories", function(module, app, Backbone, Marionette, $, _) {
    app.reqres.setHandler("stories", function() {
      return app.entities.fetchUserScopedCollection("stories", app.models.Stories);
    });

    app.reqres.setHandler("story", function(id, associations) {
      var me = this;
      var defer = $.Deferred();
      $.when(
        app.request("stories")
      ).done(function(stories) {
        if (!stories) return defer.resolve(undefined);
        var story = stories.get(id);
        story.fetch({
          success: function() {
            if (associations) {
              story.fetchAssociations(associations, {
                success: function() {
                  defer.resolve(story);
                }
              });
            } else {
              defer.resolve(story);
            }
          },
          error: function() {
            defer.resolve(undefined);
          }
        });
      });
      return defer.promise();
    });
  });
}).call(this);
(function() {
  this.tww.module("entities.users", function(module, app) {
    app.reqres.setHandler("user", function(id) {
      var user = new tww.models.User({id: +id});
      var defer = $.Deferred();
      user.fetch({
        success: function() {
          defer.resolve(user);
        },
        error: function() {
          defer.resolve(undefined);
        }
      });
      return defer.promise();
    });

    app.reqres.setHandler("user:stories", function(id) {
      var stories = new tww.models.Stories;
      var defer = $.Deferred();
      stories.fetch({
        data: {userid: +id},
        success: function(stories) {
          defer.resolve(stories);
        },
        error: function() {
          defer.resolve(undefined);
        }
      });
      return defer.promise();
    });
  });
}).call(this);
(function() {
  this.tww.module("forcePoints", function(module, app, Backbone, Marionette) {
    app.commands.setHandler("fp:buy", function() {
      forge.payments.purchaseProduct("100forcepoints");
    });

    app.on("start", function() {
      forge.payments.transactionReceived.addListener(function(data, confirm) {
        if (data.purchaseState == "PURCHASED") {
          var session = app.request("session:data");
          session.addForcePoints(100);
        }
        confirm();
      });
    });
  });
}).call(this);
(function() {
  this.tww.module("game", function(module, app, Backbone, Marionette, $, _) {
    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        "game/:id":       "showHistory",
        "game/:id/menu":  "showMenu",
        "game/:id/map":   "showMap",
        "game/:id/write": "newMessage"
      }
    });

    // Public controller methods (showHistory, showMenu, etc.)
    // can be called without an id, in which case they'll
    // act on the current story (if set).
    this.controller = {
      showHistory: function(id) {
        $.when(this._ensureCurrentStory(id)).done(this._showHistory);
      },

      showMenu: function(id) {
        $.when(this._ensureCurrentStory(id)).done(this._showMenu);
      },

      showMap: function(id) {
        $.when(this._ensureCurrentStory(id)).done(this._showMap);
      },

      newMessage: function(id) {
        $.when(this._ensureCurrentStory(id)).done(this._newMessage);
      },

      endTurn: function() {
        //var gameState = tww.router.currentStory.state;
        //if (gameState.isHeroTurn()) {
        //  gameState.endTurn({publish: true});
        //} else {
        //  alert("It's not your turn.");
        //}
      },

      _showHistory: function(story) {
        this._gameView(story, "History");
      },

      _showMenu: function(story) {
        this._gameView(story, "Menu", "/menu");
      },

      _showMap: function(story) {
        this._gameView(story, "Map", "/map");
      },

      _newMessage: function(story) {
        this._gameView(story, "NewMessage", "/write");
      },

      // Helper method to perform the common task
      // of showing a game view and updating the URL.
      _gameView: function(story, view, path) {
        app.mainRegion.show(new module.views[view]({model: story}));
        app.navigate("game/" + story.id + (path || ""));
      },

      // Returns the current game if it matches
      // the given id; or fetches, starts and sets
      // the current story from the given id.
      //
      // If no id is given it returns the current
      // story (if available), or raises an exception.
      _ensureCurrentStory: function(id) {
        // Get the current story
        var current = app.request("game:current");
        // If no id was given try to return
        // the current story, or raise an exception.
        if (id === undefined) {
          if (current) return current;
          else throw "No current game set.";
        }
        // Return the current story if it matches
        // the given id.
        if (current && current.id == id) return current;
        // Otherwise fetch the story by id.
        var defer = $.Deferred();
        $.when(app.request("story", id))
        .done(function(story) {
          story.once("start", function() {
            defer.resolve(story);
          });
          app.execute("game:start", story);
        });
        return defer.promise();
      }
    };
    // Bind controller methods to itself.
    _.bindAll(this.controller,
      '_showHistory',
      '_showMenu',
      '_showMap',
      '_newMessage'
    );

    // Show the game history whenever a story
    // is started
    app.vent.on("game:started", function(story) {
      module.controller._showHistory(story);
    });

    app.addInitializer(function() {
      new Router({controller: module.controller});
    });
  });
}).call(this);
(function() {
  this.tww.module("game", function(module, app, Backbone, Marionette, $, _) {
    // The reference to the current story.
    // Only the current story should be started (i.e.
    // listening to a faye endpoint) at a time.
    var currentStory;

    // Given a story or story id it calls
    // start() on it and sets it as the current
    // game, stopping the previous one if set.
    //
    // If passed the option trigger: true it fires
    // the event game:started on app.vent, passing
    // it the started story. The event is fired
    // even if the story had already been started.
    app.commands.setHandler("game:start", function(storyOrId, options) {
      options || (options = {});

      var deferredStory = (storyOrId instanceof app.models.Story) ?
        storyOrId :
        app.request("story", storyOrId);

      $.when(deferredStory).done(function(story) {
        if (currentStory && currentStory == story.id) {
          options.trigger && app.vent.trigger("game:started", story);
        } else {
          // Stop previous game.
          app.execute("game:stop");
          // Set current game.
          currentStory = story;
          // Start the game and trigger events.
          story.start({
            success: function() {
              options.trigger && app.vent.trigger("game:started", story);
            }
          });
        }
      });
    });

    // Stops the current story (if set).
    app.commands.setHandler("game:stop", function() {
      if (!currentStory) return;
      currentStory.stop();
      app.vent("game:stopped", currentStory);
    });

    // Returns the current story.
    app.reqres.setHandler("game:current", function() {
      return currentStory;
    });
  });
}).call(this);
(function() {
  this.tww.module("game", function(module, app, Backbone, Marionette, $, _) {
    var tint = [242, 194, 94, 255]; // #F2C25E

    app.addInitializer(function(options) {
      // Set the tabbar's color
      forge.tabbar.setTint(tint);

      var noop = function() {};

      forge.tabbar.addButton({
        icon: "images/messages-button-icon.png",
        text: "Menu",
        index: 0
      }, function(button) {
        button.onPressed.addListener(function() {
          module.controller.showMenu();
        }, noop);
      });

      forge.tabbar.addButton({
        icon: "images/messages-button-icon.png",
        text: "History",
        index: 2
      }, function(button) {
        button.onPressed.addListener(function() {
          module.controller.showHistory();
        }, noop);
      });

      forge.tabbar.addButton({
        icon: "images/messages-button-icon.png",
        text: "Enter text",
        index: 2
      }, function(button) {
        button.onPressed.addListener(function() {
          module.controller.newMessage();
        }, noop);
      });

      forge.tabbar.addButton({
        icon: "images/messages-button-icon.png",
        text: "End turn",
        index: 2
      }, function(button) {
        button.onPressed.addListener(function() {
          module.controller.endTurn();
        }, noop);
      });

      forge.tabbar.addButton({
        icon: "images/messages-button-icon.png",
        text: "Map",
        index: 2
      }, function(button) {
        button.onPressed.addListener(function() {
          module.controller.showMap();
        }, noop);
      });

      // Hide tabbar by default.
      forge.tabbar.hide();

      // Show or hide tabbar when changing main views.
      this.mainRegion.on("show", function(view) {
        forge.tabbar[view.gameView ? "show" : "hide"]();
      });
    });
  });
}).call(this);
(function() {
  this.tww.module("game.views", function(module, app, Backbone, Marionette, $, _) {
    module.History = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      gameView: true,

      className: "page book-right story-page",

      initialize: function(options) {
        var me = this;

        this.listenTo(this.model.getMessagesHistory(), "add", function(message) {
          me.appendMessage(message);
        });

        this.listenTo(this.model.state, "chapter:change", function(chapter, index, mapTile) {
          me.appendChapter(chapter, index, mapTile);
        });
      },

      render: function() {
        this.$el.html(tww.t["story_page"]({
          story: this.model
        }));

        return this;
      },

      appendMessage: function(message) {
        var template = tww.t[_.result(message, 'renderWith')];
        if (!template) return;
        var messagesContainer = this.$('.chapter .chapter-messages').last();
        messagesContainer.append(template({message: message}));
        this.scrollToBottom();
      },

      appendChapter: function(chapter, index, mapTile) {
        this.$el.append(tww.t.chapter({
          chapter:  chapter,
          index:    index,
          mapTile:  mapTile,
          messages: []
        }));
        this.scrollToBottom();
      },

      scrollToBottom: function() {
        $.scroll($(document.body).height() - $(window).height(), 1000);
      }
    }));
  });
}).call(this);
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
(function() {
  this.tww.module("game.views", function(module, app, Backbone, Marionette, $, _) {
    module.Menu = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      gameView: true,

      className: 'story-writing-menu book-cover',

      initialize: function(options) {
        var me = this;
        this.listenTo(this.model.state, "herofp:change", function() {
          me.updateForcePoints();
        });
      },

      render: function() {
        this.$el.html(tww.t.story_writing_menu({
          story: this.model
        }));
        this.$fp = this.$('.force-points-count');
        return this;
      },

      updateForcePoints: function() {
        var fp = this.model.state.forcePoints;
        this.$fp.html(fp).attr("title", fp);
      }
    }));
  });
}).call(this);
(function() {
  this.tww.module("game.views", function(module, app, Backbone, Marionette, $, _) {
    module.NewMessage = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      gameView: true,

      className: 'story-enter-text',

      events: {
        'submit .story-enter-text-form': 'submit'
      },

      initialize: function(options) {
        var me = this;
        this.listenTo(this.model.state, "turn:switch", function() {
          me.updateInput();
        });
      },

      render: function() {
        var me = this;
        this.$el.html(tww.t.story_enter_text({
          story: this.model
        }));
        this.$input = this.$('.story-enter-text-input');
        this.updateInput();
        return this;
      },

      submit: function(event) {
        event.preventDefault();

        var text = this.$input.val();

        this.model.getMessagesHistory().push({
          sendText: text,
          who:      "hero",
          actions:  0,
          channel:  "meta",
          type:     "normal"
        }).apply().publish();

        this.$input.val('');
      },

      updateInput: function() {
        if (this.model.state.isHeroTurn()) {
          this.$input.removeAttr('disabled');
          this.$input.trigger('click');
        } else {
          this.$input.attr('disabled', 'disabled');
        }
      }
    }));
  });
}).call(this);
(function() {
  var tww = this.tww, Backbone = this.Backbone;

  var MainRegion = Backbone.Marionette.Region.extend({
    el: "#tww-main",

    transitionBufferEl: "#tww-transition-buffer",

    // Override close to slide the current view
    // out before removing it
    close: function() {
      if (this.currentView) {
        this.slideOut();
      }
      Backbone.Marionette.Region.prototype.close.call(this);
    },

    onShow: function(view) {
      this.scrollToTop();
    },

    ensureTransitionBuffer: function() {
      if (!this.$transitionBuffer || this.$transitionBuffer.length === 0) {
        this.$transitionBuffer = Backbone.$(this.transitionBufferEl);
      }
    },

    slideOut: function() {
      var region = this;
      this.ensureTransitionBuffer();
      this.ensureEl();
      this.$transitionBuffer.html(this.$el.children().clone()).css({left: 0}).show();
      _.defer(function() {
        region.$transitionBuffer.animate({
          left: -$(window).width()
        }, {
          duration: 400,
          complete: function() {
            region.$transitionBuffer.empty().hide();
            //region._scrollToTop();
          }
        });
      });
    },

    scrollToTop: function() {
      $(document.body).animate({scrollTop: 0}, 100);
    }
  });

  tww.addRegions({
    mainRegion: MainRegion
  });
}).call(this);

(function() {
  this.tww.module('notifications', function(module, app, Backbone, Marionette, $, _) {
    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        "notifications": "show"
      }
    });

    var NotificationsView = Marionette.View.extend({
      el: '#tww-notifications',

      events: {
        'click .notification': 'openNotification'
      },

      initialize: function() {
        var me = this;
        this.$container = $('#tww-notifications-list');
        this.listenTo(this.collection, 'reset', _.bind(this.render, this));
      },

      render: function() {
        this.$container.html(tww.t["notifications"]({
          notifications: this.collection.myTurn()
        }));
        return this;
      },

      close: function() {
        this.undelegateEvents();
        this.collection.off(null, null, this);
      },

      show: function() {
        this.$el.show();
        this.$container.css({
          height: $(window).height() - parseInt(this.$el.css('top'))
        });
        return this;
      },

      hide: function() {
        this.$el.hide();
        return this;
      },

      openNotification: function(e) {
      }
    });

    var api = {
      show: function() {
        $.when(
          this._getView()
        ).done(function(view) {
          view.show();
        })
        app.navigate('notifications');
      },

      hide: function() {
        if (this._notificationsView) {
          this._notificationsView.hide();
        }
      },

      _getView: function() {
        if (this._notificationsView) return this._notificationsView;
        var defer = $.Deferred(), me = this;
        $.when(
          app.request("stories")
        ).done(function(stories) {
          var view = me._notificationsView = new NotificationsView({
            collection: stories
          });
          defer.resolve(view.render());
        });
        return defer.promise();
      }
    };

    // Hide notifications on show of main region
    app.mainRegion.on('show', function() {
      api.hide();
    });

    app.addInitializer(function() {
      new Router({controller: api});
    });
  });
}).call(this);
(function() {
  var env = this;

  this.tww.module('session', function(module, app, Backbone, Marionette, $, _) {
    var Session = Backbone.Model.extend({
      defaults: {
        fp: 3000
      },

      addForcePoints: function(n) {
        this.set('fp', this.get('fp') + n);
      }
    });

    var sessionData;

    var login = function() {
      env.forge.facebook.authorize(function() {
        env.forge.facebook.api('me', function(facebookData) {
          // We need the user id as well, so here's
          // yet another server roundtrip...
          env.forge.ajax({
            url:       env.ForgeSync.baseURL + '/userid.js',
            type:      'GET',
            dataType:  'json',
            data:      { email: facebookData.email },

            success: function(response) {
              sessionData = new Session({
                id:    response.userid || response.id,
                email: facebookData.email
              });
              app.vent.trigger("session:start");
            }
          });
        });
      },

      function() {
        alert('Authorization failed!');
      });
    };

    var LoginView = Marionette.ItemView.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: "page book-left login-screen",

      template: "login",

      events: {
        "click #facebook-login-button": "login"
      },

      initialize: function() {
        this.on('resize', _.bind(this._centerButton, this));
      },

      login: function() {
        login();
      },

      _centerButton: function() {
        var loginButton = this.$('#facebook-login-button');
        loginButton.css({
          marginTop: Math.round(this.$el.height() / 2 - loginButton.height() / 2)
        });
      }
    }));

    module.controller = {
      login: function() {
        if (app.request("session:data")) {
          app.vent.trigger("session:start");
        } else {
          app.mainRegion.show(new LoginView);
        }
      }
    };

    app.reqres.setHandler("session:data", function() {
      return sessionData;
    });

    app.reqres.setHandler("session:currentUser", function() {
      if (!sessionData) throw "User session has not been started.";
      var defer = new $.Deferred();
      var user = new app.models.User({id: sessionData.id});
      user.fetch({
        success: function() {
          defer.resolve(user);
        },
        error: function() {
          defer.resolve(undefined);
        }
      });
      return defer.promise();
    });

    app.on("start", function() {
      module.controller.login();
    });
  });
}).call(this);
(function() {
  this.tww.module("stories", function(module, app, Backbone, Marionette) {
    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        "stories/:id":       "showStoryDetails",
        "stories/:id/role":  "showRoleTypeSummary",
        "stories/:id/type":  "showStoryTypeSummary"
      }
    });

    var api = {
      showStoryDetails: function(id) {
        $.when(
          app.request("story", id, ['godUser'])
        ).done(_.bind(this._showStoryDetails, this));
      },

      showRoleTypeSummary: function(id) {
        $.when(
          app.request("story", id)
        ).done(_.bind(this._showRoleTypeSummary, this));
      },

      showStoryTypeSummary: function(id) {
        $.when(
          app.request("story", id)
        ).done(_.bind(this._showStoryTypeSummary, this));
      },

      showChooseHero: function(id) {
        $.when(
          app.request("story", id),
          app.request("characters")
        ).done(_.bind(this._showChooseHero, this));
      },

      _showStoryDetails: function(story) {
        var me = this;
        var view = new module.views.StoryDetails({
          model: story
        });

        view.on("story:zoom:god", function() {
          app.execute("user:show", story.getGodUser());
        });

        view.on("story:zoom:hero", function() {
          app.execute("character:show", story.get("character_id"));
        });

        view.on("story:zoom:roles", function() {
          me._showRoleTypeSummary(story);
        });

        view.on("story:zoom:type", function() {
          me._showStoryTypeSummary(story);
        });

        view.on("story:apply", function() {
          me.showChooseHero(story.id);
        });

        view.on("story:read", function() {
          app.execute("game:start", story.id, {trigger: true});
        });

        app.mainRegion.show(view);
        app.navigate("stories/" + story.id);
      },

      _showChooseHero: function(story, characters) {
        var view = new module.views.ChooseHero({
          model: story,
          collection: characters
        });
        app.mainRegion.show(view);
      },

      _showStoryTypeSummary: function(story) {
        var view = new module.views.StoryTypeSummary({
          model: story
        });
        app.mainRegion.show(view);
        app.navigate("stories/" + story.id + "/type");
      },

      _showRoleTypeSummary: function(story) {
        var view = new module.views.RoleTypeSummary({
          model: story
        });
        app.mainRegion.show(view);
        app.navigate("stories/" + story.id + "/role");
      }
    };

    app.addInitializer(function() {
      new Router({controller: api});
    });
  });
}).call(this);
(function() {
  this.tww.module("stories.views", function(module, app, Backbone, Marionette) {
    module.ChooseHero = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: 'page book-left choose-hero',

      events: {
        "click .create-new-hero": "createNewHero"
        //'click .hero': 'chooseHero'
      },

      render: function() {
        this.$el.html(app.t['choose_hero']({
          characters: this.collection
        }));
        return this;
      },

      //chooseHero: function(e) {
      //  var me = this;

      //  var heroId = $(e.target).closest('.hero').data('hero-id');
      //  var hero = this.collection.get(heroId);

      //  var joinRequest = new app.models.JoinRequest();

      //  joinRequest.save({
      //    map:  this.model.id,
      //    user: heroId
      //  }, {
      //    success: function() {
      //      // Change the view directly, without changing the route
      //      app.router.changeView(new app.views.AppliedToJoin({
      //        story: me.model,
      //        hero:  hero
      //      }));
      //    }
      //  });
      //},

      createNewHero: function(e) {
        app.execute("character:edit");
      }
    }));
  });
}).call(this);
(function() {
  this.tww.module("stories.views", function(module, app, Backbone, Marionette) {
    module.RoleTypeSummary = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: 'page book-left role-type-summary',

      render: function() {
        this.$el.html(app.t['role_type_summary']({
          story: this.model
        }));
        return this;
      }
    }));
  });
}).call(this);
(function() {
  this.tww.module("stories.views", function(module, app, Backbone, Marionette, $, _) {
    module.StoryDetails = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: 'page book-left story-details',

      triggers: {
        'click .story-god':   'story:zoom:god',
        'click .story-type':  'story:zoom:type'
      },

      events: {
        'click .story-hero':   'onHeroZoomed',
        'click .story-action': 'onMainAction'
      },

      render: function() {
        this.$el.html(tww.t['story_details']({
          story: this.model
        }));
        return this;
      },

      onHeroZoomed: function(e) {
        if (this.model.get('has_character')) {
          //tww.router.navigate('characters/' + this.model.get('character_id'), {trigger: true});
          this.trigger("story:zoom:hero", {model: this.model});
        } else {
          //tww.router.navigate('stories/' + this.model.id + '/role', {trigger: true});
          this.trigger("story:zoom:roles", {model: this.model});
        }
      },

      onMainAction: function(e) {
        if (!$(e.target).closest('button:enabled').length) return;
        if (this.model.canApplyToJoin()) {
          this.trigger("story:apply", {model: this.model});
        } else {
          this.trigger("story:read", {model: this.model});
        }
      }

      //storyAction: function(e) {
      //  // Do nothing if button is disabled
      //  if (!$(e.target).closest('button:enabled').length) return;
      //  if (this.model.canApplyToJoin()) {
      //    this.applyToJoin();
      //  } else {
      //    this.readStory();
      //  }
      //},

      //applyToJoin: function() {
      //  tww.router.navigate('stories/' + this.model.id + '/apply', {trigger: true});
      //},

      //readStory: function() {
      //  tww.router.navigate('stories/' + this.model.id + '/read', {trigger: true});
      //},
    }));
  });
}).call(this);
(function() {
  this.tww.module("stories.views", function(module, app, Backbone, Marionette) {
    module.StoryTypeSummary = Backbone.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: 'page book-left story-type-summary',

      render: function() {
        this.$el.html(app.t['story_type_summary']({
          type:  app.data.storyTypes[this.model.get('type')],
          story: this.model
        }));
        return this;
      }
    }));
  });
}).call(this);
(function() {
  this.tww.module("users", function(module, app, Backbone, Marionette) {
    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        "users/:id":  "showUserDetails"
      }
    });

    var api = {
      showUserDetails: function(id) {
        $.when(
          app.request("user", id),
          app.request("user:stories", id),
          app.request("stories"),
          app.request("characters")
        ).done(this._showUserDetails);
      },

      _showUserDetails: function(user, userStories, stories, characters) {
        var view = new module.views.UserDetails({
          user:         user,
          userStories:  userStories,
          stories:      stories,
          characters:   characters
        });
        app.mainRegion.show(view);
        app.navigate("users/" + user.id);
      }
    };

    app.commands.setHandler("user:show", function(userOrId) {
      api.showUserDetails(userOrId instanceof Backbone.Model ? userOrId.id : userOrId);
    });

    app.addInitializer(function() {
      new Router({controller: api});
    });
  });
}).call(this);
(function() {
  this.tww.module("users.views", function(module, app, Backbone, Marionette) {
    module.UserDetails = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: 'user-details',

      initialize: function(options) {
        var me = this;

        this.user = options.user;
        this.stories = options.stories;
        this.characters = options.characters;
        this.userStories = options.userStories;

        this.asGodBookshelf = new tww.views.StoriesBookshelf({
          title: "Written as a God",
          collection: this.stories,
          filter: function(c) { return c.byGod(me.user); }
        });

        this.asHeroBookshelf = new tww.views.StoriesBookshelf({
          title: "Player as a Hero",
          collection: this.userStories
        });

        this.heroesBookshelf = new tww.views.HeroesBookshelf({
          title: function() {
            if (me.user.get('firstname').match(/s$/)) {
              return me.user.get('firstname') + "' Heroes";
            } else {
              return me.user.get('firstname') + "'s Heroes";
            }
          },
          collection: this.characters,
          filter: function(c) { return c.byUser(me.user.id); }
        });

        this.bookshelfViews = [
          this.asGodBookshelf,
          this.asHeroBookshelf,
          this.heroesBookshelf
        ];
      },

      render: function() {
        this.$el.html(tww.t.user_details({
          user: this.user
        }));
        this._renderBookshelves();
        return this;
      },

      onClose: function() {
        _.invoke(this.bookshelfViews, 'close');
      },

      onShow: function() {
        _.each(this.bookshelfViews, function(subview) {
          Marionette.triggerMethod.call(subview, "show");
        });
        this.adjustHeight();
      },

      _renderBookshelves: function() {
        var me = this;
        _.each(this.bookshelfViews, function(b) {
          me.$el.append(b.render().el);
        });
      }
    }));
  });
}).call(this);
(function() {
  var tww = this.tww;

  tww.data = tww.data || {};

  tww.data.bodyTypes = [
    {
      id:    "1",
      label: "Dummy 1",
      image: "hero-large.png"
    },
    {
      id:    "2",
      label: "Dummy 2",
      image: "hero-large.png"
    },
    {
      id:    "3",
      label: "Dummy 3",
      image: "hero-large.png"
    }
  ];
}).call(this);
(function() {
  var tww = this.tww;

  tww.data = tww.data || {};

  tww.data.characterQuestions = [
    {
      name: "The Beginning",
      questions: [
        {
          id: 1,
          question: "What does %name% look like?"
        }
      ]
    }
  ];
}).call(this);
(function() {
  var tww = this.tww;

  tww.data = tww.data || {};

  // TODO:
  // - rename this to archetypes
  // - maybe use a Backbone model instead of plain objects?
  // - use "archetypes" request instead of directly accessing
  //   the object
  tww.data.roleTypes = {
    "A Villain": {
      name: "A Villain",
      shortName: "Villain",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Winner": {
      name: "A Winner",
      shortName: "Winner",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Fugitive": {
      name: "A Fugitive",
      shortName: "Fugitive",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Tyrant": {
      name: "A Tyrant",
      shortName: "Tyrant",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Helpful God": {
      name: "A Helpful God",
      shortName: "Helpful God",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Ghost": {
      name: "A Ghost",
      shortName: "Ghost",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Judge": {
      name: "A Judge",
      shortName: "Judge",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Victim": {
      name: "A Victim",
      shortName: "Victim",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Loser": {
      name: "A Loser",
      shortName: "Loser",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Problem": {
      name: "A Problem",
      shortName: "Problem",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Hero": {
      name: "A Hero",
      shortName: "Hero",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Friend": {
      name: "A Friend",
      shortName: "Friend",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Traitor": {
      name: "A Traitor",
      shortName: "Traitor",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Messenger": {
      name: "A Messenger",
      shortName: "Messenger",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Lawman": {
      name: "A Lawman",
      shortName: "Lawman",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "Someone Desired": {
      name: "Someone Desired",
      shortName: "Someone Desired",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Lover": {
      name: "A Lover",
      shortName: "Lover",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Monster": {
      name: "A Monster",
      shortName: "Monster",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Mad Person": {
      name: "A Mad Person",
      shortName: "Mad Person",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Priest": {
      name: "A Priest",
      shortName: "Priest",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Mentor": {
      name: "A Mentor",
      shortName: "Mentor",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Hunter": {
      name: "A Hunter",
      shortName: "Hunter",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Person Owed": {
      name: "A Person Owed",
      shortName: "Person Owed",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Helper": {
      name: "A Helper",
      shortName: "Helper",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Killer": {
      name: "A Killer",
      shortName: "Killer",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "An Unknown Role": {
      name: "An Unknown Role",
      shortName: "Unkown",
      description: "The actual role type is missing."
    }
  };
}).call(this);
(function() {
  var tww = this.tww;

  tww.data = tww.data || {};

  tww.data.storyTypes = {
    "Vengeance": {
      name: "Vengeance",
      description: "In a story of Vengeance ..."
    }
  };
}).call(this);
(function() {
  var _ = this._, tww = this.tww;

  tww.helpers = tww.helpers || {};

  _.extend(tww.helpers, {
    simpleFormat: function(text) {
      return '<p>' + text.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br/>') + '</p>';
    }
  });
}).call(this);
(function() {
  var tww = this.tww;

  tww.addInitializer(function(options) {
    ForgeSync.baseURL = options.baseAjaxURL;
    Backbone.sync = ForgeSync.sync;
  });
}).call(this);
(function() {
  var tww = this.tww;

  tww.addInitializer(function(options) {
    this.fayeClient = new Faye.Client(options.fayeURL);
  });
}).call(this);
(function() {
  var tww = this.tww, env = this;
  tww.addInitializer(function(options) {
    tww.t = env.JST;
  });
}).call(this);
(function() {
  var tww = this.tww;

  var TOPBAR_TINT = [250, 249, 248, 255]; // #FAF9F8
  var TITLE_IMAGE = 'images/logo.png';

  tww.addInitializer(function(options) {
    if (!(forge && forge.topbar)) return;

    forge.topbar.setTitleImage(TITLE_IMAGE);

    forge.topbar.setTint(TOPBAR_TINT);

    forge.topbar.addButton({
      text:     "Back",
      position: "left",
      style:    "back",
      type:     "back",
      tint:     TOPBAR_TINT
    });

    forge.topbar.addButton({
      icon:     "images/messages-button-icon.png",
      position: "right",
      tint:     [220, 220, 220, 150]
    }, function() {
      // XXX: Refactor this to not use trigger: true!
      tww.router.navigate('notifications', {trigger: true});
    });
  });
}).call(this);
(function() {
  var tww = this.tww;

  //var NotificationsRegion = Backbone.Marionette.Region.extend({
  //  hide: function() {
  //    this.currentView.hide();
  //  }
  //});

  //tww.addRegions({
  //  notificationsRegion: "#tww-notifications"
  //});

  //tww.addInitializer(function() {
  //  tww.mainRegion.on("show", function(view) {
  //    tww.notificationsRegion.hide();
  //  });
  //});
}).call(this);
