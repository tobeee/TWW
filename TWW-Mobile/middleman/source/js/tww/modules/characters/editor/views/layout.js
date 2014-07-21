(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.Layout = Marionette.Layout.extend({
      id: "character-editor-layout",

      template: "character_editor/layout",

      regions: {
        body: "#character-editor-body"
      },

      triggers: {
        // Toolbar events
        "click #character-editor-goto-body":      "toolbar:body",
        "click #character-editor-goto-items":     "toolbar:items",
        "click #character-editor-goto-purchased": "toolbar:purchased",
        "click #character-editor-goto-name":      "toolbar:name",
        "click #character-editor-goto-story":     "toolbar:story",
        "click #character-editor-goto-looks":     "toolbar:looks",
        "click #character-editor-save":           "toolbar:save"
      },

      onRender: function() {
        $('body').addClass('with-top-nav with-bottom-nav');
      },

      onClose: function() {
        $('body').removeClass('with-top-nav with-bottom-nav');
      }
    });
  });
}).call(this);
