(function() {
  var Index = Backbone.View.extend({
    className: 'index',

    initialize: function(options) {
      var me = this;

      this.stories = options.stories;
      this.characters = options.characters;

      this.yourTurnSubview = new tww.views.StoriesBookshelf({
        preset: 'yourTurn',
        collection: this.stories
      });

      this.toReadSubview = new tww.views.StoriesBookshelf({
        preset: 'toRead',
        collection: this.stories
      });

      this.heroWantedSubview = new tww.views.StoriesBookshelf({
        preset: 'heroWanted',
        collection: this.stories
      });

      this.yourHeroesSubview = new tww.views.HeroesBookshelf({
        preset: 'yourHeroes',
        collection: this.characters
      });

      this.forcePointsSubview = new tww.views.ForcePoints();

      this.sections = [
        this.yourTurnSubview,
        this.toReadSubview,
        this.heroWantedSubview,
        this.yourHeroesSubview,
        this.forcePointsSubview
      ];

      this.stories.fetch({reset: true, data: {email: tww.session.email}});
      this.characters.fetch({reset: true, data: {email: tww.session.email}});
    },

    render: function() {
      var me = this;

      _.each(this.sections, function(s) {
        me.$el.append(s.render().el);
      });

      return this;
    },

    destroy: function() {
      this.undelegateEvents();
    }
  });

  // Mixins
  _.extend(Index.prototype, AdjustableHeight);

  window.tww.views.Index = Index;
})();
