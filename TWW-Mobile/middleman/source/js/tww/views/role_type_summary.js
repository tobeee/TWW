(function() {
  var tww = this.tww;

  var RoleTypeSummary = Backbone.View.extend(_.extend({}, tww.lib.AdjustableHeight, {
    className: 'page book-left role-type-summary',

    render: function() {
      this.$el.html(tww.t.role_type_summary({
        story: this.model
      }));
      return this;
    }
  }));

  tww.views.RoleTypeSummary = RoleTypeSummary;
}).call(this);
