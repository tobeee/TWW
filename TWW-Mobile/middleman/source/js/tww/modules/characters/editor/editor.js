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
