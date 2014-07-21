(function() {
  var RoleTypeSummary = Backbone.View.extend({
    className: 'page book-left role-type-summary',

    events: {
    },

    initialize: function(options) {
    },

    render: function() {
      this.$el.html(tww.t.role_type_summary({
        story: this.model
      }));
      return this;
    },

    destroy: function() {
      this.undelegateEvents();
    }
  });

  // Mixins
  _.extend(RoleTypeSummary.prototype, AdjustableHeight);

  window.tww.views.RoleTypeSummary = RoleTypeSummary;
})();
