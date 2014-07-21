(function() {
  var tww = this.tww;

  var ChooseHero = Backbone.View.extend({
    className: 'page book-left choose-hero',

    events: {
      'click .create-new-hero': 'createNewHero',
      'click .hero': 'chooseHero'
    },

    initialize: function(options) {
      this.collection.on('reset', function() {
        this.render();
      }, this);

      this.collection.fetch({reset: true});
    },

    render: function() {
      this.$el.html(tww.t['choose_hero']({
        characters: this.collection.byUser(tww.session.id)
      }));

      return this;
    },

    destroy: function() {
      this.undelegateEvents();
      this.collection.off(null, null, this);
    },

    chooseHero: function(e) {
      var me = this;

      var heroId = $(e.target).closest('.hero').data('hero-id');
      var hero = this.collection.get(heroId);

      var joinRequest = new tww.m.JoinRequest();

      joinRequest.save({
        map:  this.model.id,
        user: heroId
      }, {
        success: function() {
          // Change the view directly, without changing the route
          tww.router.changeView(new tww.v.AppliedToJoin({
            story: me.model,
            hero:  hero
          }));
        }
      });
    },

    createNewHero: function(e) {
      tww.router.changeView(new tww.views.heroEdit.Entry({
      }));
    }
  });

  // Mixins
  _.extend(ChooseHero.prototype, AdjustableHeight);

  tww.views.ChooseHero = ChooseHero;
}).call(this);
