(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.Main = Marionette.ItemView.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: 'page book-left character-edit-main',

      template: "character_editor/main",

      events: {
        "click .character-new":  "create",
        "click .character-edit": "edit"
      },

      create: function() {
        app.execute("character:edit:create");
      },

      edit: function() {
        app.execute("character:edit:pick");
      }
    }));
  });
}).call(this);
