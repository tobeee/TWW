(function() {
  this.tww.module("stories.views", function(module, app, Backbone, Marionette) {
    module.StoryTypeSummary = Backbone.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: 'page book-left story-type-summary',

      render: function() {
        this.$el.html(app.t['story_type_summary']({
          type:  app.data.storyTypes[this.model.get('type')],
          story: this.model
        }));
        return this;
      }
    }));
  });
}).call(this);
