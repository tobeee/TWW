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
