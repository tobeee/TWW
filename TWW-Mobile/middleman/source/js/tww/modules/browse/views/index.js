(function() {
  this.tww.module("browse.views", function(module, app, Backbone, Marionette) {
    module.Index = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: "index",

      initialize: function(options) {
        var me = this;

        this.stories = options.stories;
        this.characters = options.characters;

        // Your Turn
        this.yourTurnSubview = new tww.views.StoriesBookshelf({
          preset: 'yourTurn',
          collection: this.stories
        });
        this.listenTo(this.yourTurnSubview, "bookshelf:toggle", function(view, collection) {
          me.trigger("yourTurn:toggle", view, collection)
        });

        // To Read
        this.toReadSubview = new tww.views.StoriesBookshelf({
          preset: 'toRead',
          collection: this.stories
        });
        this.listenTo(this.toReadSubview, "bookshelf:toggle", function(view, collection) {
          me.trigger("toRead:toggle", view, collection);
        });

        // Hero Wanted
        this.heroWantedSubview = new tww.views.StoriesBookshelf({
          preset: 'heroWanted',
          collection: this.stories
        });
        this.listenTo(this.heroWantedSubview, "bookshelf:toggle", function(view, collection) {
          me.trigger("heroWanted:toggle", view, collection);
        });

        // Your Heroes
        this.yourHeroesSubview = new tww.views.HeroesBookshelf({
          preset: 'yourHeroes',
          collection: this.characters
        });
        this.listenTo(this.yourHeroesSubview, "bookshelf:toggle", function(view, collection) {
          me.trigger("yourHeroes:toggle", view, collection);
        });

        // Force Points
        this.forcePointsSubview = new module.ForcePoints({
          model: app.request("session:data")
        });

        this.subviews = [
          this.yourTurnSubview,
          this.toReadSubview,
          this.heroWantedSubview,
          this.yourHeroesSubview,
          this.forcePointsSubview
        ];
      },

      render: function() {
        var me = this;
        _.each(this.subviews, function(s) {
          me.$el.append(s.render().el);
        });
        this.triggerMethod("render", this);
        return this;
      },

      onShow: function() {
        _.each(this.subviews, function(subview) {
          Marionette.triggerMethod.call(subview, "show");
        });
        this.adjustHeight();
      }
    }));
  });
}).call(this);
