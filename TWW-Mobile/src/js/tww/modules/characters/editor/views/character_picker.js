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
