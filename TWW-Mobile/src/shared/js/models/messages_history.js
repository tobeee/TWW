(function() {
  var GameMessage = Backbone.Model.extend({
    expireAfter: 60 * 30,

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
        return this.objective = new tww.m.Objective({name: 'Unknown Objective', fpValue: 0});
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

    expireAfter: 60 * 30,

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
