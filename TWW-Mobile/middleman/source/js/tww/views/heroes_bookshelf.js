(function() {
  var tww = this.tww;

  var HeroesBookshelf = tww.views.Bookshelf.extend({
    className: 'section bookshelf heroes-bookshelf',

    itemsTemplate: 'heroes',

    events: _.extend({}, tww.views.Bookshelf.prototype.events, {
      "click .bookshelf-add": "createCharacter"
    }),

    presets: {
      yourHeroes: {
        title: "Your Heroes.",
        filter: 'mine',
        expandedRoute: 'your-heroes',
        showAddButton: true
      }
    },

    createCharacter: function() {
      tww.execute("character:edit");
    }
  });

  tww.views.HeroesBookshelf = HeroesBookshelf;
}).call(this)
