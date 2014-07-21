(function() {
  this.tww.module("characters.views", function(module, app, Backbone, Marionette) {
    module.CharacterDetails = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: 'hero-details',

      initialize: function(options) {
        this.stories = options.stories;
        this.characterStories = new tww.models.Stories(this.stories.withCharacter(this.model));
        this.bookshelfView = new tww.views.StoriesBookshelf({
          title: "This Hero was featured in",
          collection: this.characterStories
        });
      },

      render: function() {
        this.$el.html(tww.t.hero_details({
          hero: this.model
        }));
        this.$el.append(this.bookshelfView.render().el);
        return this;
      },

      onShow: function() {
        Marionette.triggerMethod.call(this.bookshelfView, 'show');
        this.adjustHeight();
      }
    }));
  });
}).call(this);
