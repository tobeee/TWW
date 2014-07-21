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
