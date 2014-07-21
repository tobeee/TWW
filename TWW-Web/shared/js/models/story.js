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

    // Never expire
    expireAfter: false,

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
      return this.getMap().get(+chapter.locationX, +chapter.locationY);
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
        success: success
      });
    },

    getGodUser: function() {
      return this.godUser || (this.godUser = new tww.models.User({id: this.get('creator_id')}));
    },

    getMap: function() {
      return this.map || (this.map = new tww.models.Map({story: this}));
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
        }
      });

      return true;
    }
  });

  var Stories = this.Backbone.Collection.extend({
    model: Story,

    renderWith: 'books',

    url: '/mobileendpoint.js',

    expireAfter: 60 * 30,

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
