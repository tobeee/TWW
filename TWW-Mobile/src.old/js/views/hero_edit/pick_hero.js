(function() {
  var tww = this.tww;

  var PickHero = tww.views.HeroesBookshelf.extend({
    title: "Which Hero would you like to Edit?",

    expanded: true,

    events: {
      'click .hero': 'pickHero'
    },

    pickHero: function(e) {
      e.preventDefault();
      //tww.router._changeView(
    }
  });

  tww.views.heroEdit = tww.views.heroEdit || {};
  tww.views.heroEdit.PickHero = PickHero;
}).call(this);
