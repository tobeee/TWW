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
