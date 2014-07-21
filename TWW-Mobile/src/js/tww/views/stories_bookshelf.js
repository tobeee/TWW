(function() {
  var tww = this.tww;

  var StoriesBookshelf = tww.views.Bookshelf.extend({
    className: 'section bookshelf stories-bookshelf',

    itemsTemplate: 'books',

    presets: {
      yourTurn: {
        title: "It's your turn!",
        filter: 'myTurn',
        expandedRoute: 'your-turn'
      },

      toRead: {
        title: "You might like to read&hellip;",
        filter: 'toRead',
        expandedRoute: 'to-read'
      },

      heroWanted: {
        title: "Hero wanted.",
        filter: 'heroWanted',
        expandedRoute: 'hero-wanted'
      }
    }
  });

  tww.views.StoriesBookshelf = StoriesBookshelf;
}).call(this)
;
