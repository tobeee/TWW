(function() {
  var StoryTypeSummary = Backbone.View.extend({
    className: 'page book-left story-type-summary',

    initialize: function(options) {
    },

    render: function() {
      this.$el.html(tww.t.story_type_summary({
        type:  tww.data.storyTypes[this.model.get('type')],
        story: this.model
      }));

      return this;
    },

    destroy: function() {
      this.undelegateEvents();
    }
  });

  // Mixins
  _.extend(StoryTypeSummary.prototype, AdjustableHeight);

  window.tww.views.StoryTypeSummary = StoryTypeSummary;
})();
