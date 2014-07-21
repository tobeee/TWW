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
