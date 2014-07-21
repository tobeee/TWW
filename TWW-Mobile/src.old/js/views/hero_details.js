(function() {
  var HeroDetails = Backbone.View.extend({
    className: 'hero-details',

    initialize: function(options) {
      var me = this;

      this.modelId = options.modelId;
      this.stories = options.stories;

      this.characterStories = new tww.m.Stories();

      this.bookshelfView = new tww.views.StoriesBookshelf({
        title: "This Hero was featured in",
        collection: this.characterStories
      });

      this.bookshelfView.render();

      this.collection.on('reset', function() {
        me._setModel();
        me.render();
      }, this);

      this.collection.fetch({reset: true});
    },

    render: function() {
      if (this.model) {
        this.$el.html(tww.t.hero_details({
          hero: this.model
        }));

        this.$el.append(this.bookshelfView.render().el);
      }

      return this;
    },

    destroy: function() {
      this.undelegateEvents();
      this.collection.off(null, null, this);
    },

    _setModel: function() {
      this.model = this.collection.get(this.modelId);
      this.characterStories.reset(this.stories.withCharacter(this.model));
    }
  });

  // Mixins
  _.extend(HeroDetails.prototype, AdjustableHeight);

  window.tww.views.HeroDetails = HeroDetails;
})();
