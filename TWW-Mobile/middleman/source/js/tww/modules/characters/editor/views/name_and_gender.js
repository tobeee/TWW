(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.NameAndGender = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: "page book-right character-edit-name-and-gender",

      events: {
        "submit #character-name-and-gender-form": "done"
      },

      render: function() {
        this.$el.html(tww.t["character_editor/name_and_gender"]({
          character: this.model
        }));
        return this;
      },

      done: function(e) {
        e.preventDefault();
        this.model.set("name", this.$("#character-name").val());
        this.model.set("gender", this.$("#character-gender").val());
        this.trigger("done");
      }
    }));
  });
}).call(this);
