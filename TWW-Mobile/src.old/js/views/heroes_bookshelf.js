(function() {
  var tww = this.tww;

  var HeroesBookshelf = tww.views.Bookshelf.extend({
    className: 'section bookshelf heroes-bookshelf',

    itemsTemplate: 'heroes',

    presets: {
      yourHeroes: {
        title: "Your Heroes.",
        filter: 'mine',
        expandedRoute: 'your-heroes',
        showAddButton: true
      }
    }
  });

  tww.views.HeroesBookshelf = HeroesBookshelf;
}).call(this)
