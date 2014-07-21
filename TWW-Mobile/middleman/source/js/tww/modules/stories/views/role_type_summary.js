(function() {
  this.tww.module("stories.views", function(module, app, Backbone, Marionette) {
    module.RoleTypeSummary = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: 'page book-left role-type-summary',

      render: function() {
        this.$el.html(app.t['role_type_summary']({
          story: this.model
        }));
        return this;
      }
    }));
  });
}).call(this);
