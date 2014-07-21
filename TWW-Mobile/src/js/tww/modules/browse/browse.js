(function() {
  this.tww.module("browse", function(module, app, Backbone, Marionette, $, _) {
    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        "":             "showIndex",
        "your-turn":    "showUserTurnStories",
        "to-read":      "showToReadStories",
        "hero-wanted":  "showHeroWantedStories",
        "your-heroes":  "showUserHeroes"
      }
    });

    var api = {
      showIndex: function() {
        $.when(
          app.request("stories"),
          app.request("characters")
        ).done(_.bind(this._showIndex, this));
      },

      showUserTurnStories: function() {
        var me = this;
        $.when(app.request("stories")).done(function(stories) {
          me._showBookshelf('yourTurn', 'your-turn', 'StoriesBookshelf', stories);
        });
      },

      showToReadStories: function() {
        var me = this;
        $.when(app.request("stories")).done(function(stories) {
          me._showBookshelf('toRead', 'to-read', 'StoriesBookshelf', stories);
        });
      },

      showHeroWantedStories: function() {
        var me = this;
        $.when(app.request("stories")).done(function(stories) {
          me._showBookshelf('heroWanted', 'hero-wanted', 'StoriesBookshelf', stories);
        });
      },

      showUserHeroes: function() {
        var me = this;
        $.when(app.request("characters")).done(function(characters) {
          me._showBookshelf('yourHeroes', 'your-heroes', 'HeroesBookshelf', characters);
        });
      },

      _showIndex: function(stories, characters) {
        var me = this;
        var view = new module.views.Index({
          stories:    stories,
          characters: characters
        });

        view.on("yourTurn:toggle", function(view, collection) {
          me._showBookshelf('yourTurn', 'your-turn', 'StoriesBookshelf', collection);
        });
        view.on("toRead:toggle", function(view, collection) {
          me._showBookshelf('toRead', 'to-read', 'StoriesBookshelf', collection);
        });
        view.on("heroWanted:toggle", function(view, collection) {
          me._showBookshelf('heroWanted', 'hero-wanted', 'StoriesBookshelf', collection);
        });
        view.on("yourHeroes:toggle", function(view, collection) {
          me._showBookshelf('yourHeroes', 'your-heroes', 'HeroesBookshelf', collection);
        });

        app.mainRegion.show(view);
        app.navigate("");
      },

      // Generic display of a bookshelf with a preset
      _showBookshelf: function(preset, route, view, collection) {
        var me = this;
        var view = new app.views[view]({
          preset:      preset,
          collection:  collection,
          expanded:    true
        });
        view.on("bookshelf:toggle", function() {
          me.showIndex();
        });
        app.mainRegion.show(view);
        app.navigate(route);
      }
    };

    app.addInitializer(function() {
      new Router({controller: api});
    });
  });
}).call(this);
