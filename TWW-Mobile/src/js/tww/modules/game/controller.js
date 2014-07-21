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
