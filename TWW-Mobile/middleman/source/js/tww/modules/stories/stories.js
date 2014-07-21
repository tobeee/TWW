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
