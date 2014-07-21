(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.BodyType = Marionette.ItemView.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: "page book-right character-edit-body",

      template: "character_editor/body_type",

      templateHelpers: function() {
        return { bodyTypes: app.data.bodyTypes }
      },

      events: {
        "click .character-body-type": "pick",
        "click #character-body-ok":   "done"
      },

      onRender: function() {
        this.$bodyTypes = this.$(".character-body-type");
        var current;
        if (this.model.get("body_type")) {
          current = this.$bodyTypes.filter("[data-id=" + this.model.get("body_type") + "]");
        } else {
          current = this.$bodyTypes.first();
        }
        this._setCurrent(current);
      },

      pick: function(e) {
        this._setCurrent($(e.target).closest(".character-body-type"));
      },

      done: function(e) {
        e.preventDefault();
        this.model.set("body_type", this._getCurrent().data("id"));
        this.trigger("done");
      },

      _setCurrent: function(el) {
        this._getCurrent().removeClass("-current");
        $(el).addClass("-current");
      },

      _getCurrent: function() {
        return this.$bodyTypes.filter(".-current");
      }
    }));
  });
}).call(this);
