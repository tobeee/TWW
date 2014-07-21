(function() {
  this.tww.module("stories.views", function(module, app, Backbone, Marionette) {
    module.ChooseHero = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: 'page book-left choose-hero',

      events: {
        "click .create-new-hero": "createNewHero"
        //'click .hero': 'chooseHero'
      },

      render: function() {
        this.$el.html(app.t['choose_hero']({
          characters: this.collection
        }));
        return this;
      },

      //chooseHero: function(e) {
      //  var me = this;

      //  var heroId = $(e.target).closest('.hero').data('hero-id');
      //  var hero = this.collection.get(heroId);

      //  var joinRequest = new app.models.JoinRequest();

      //  joinRequest.save({
      //    map:  this.model.id,
      //    user: heroId
      //  }, {
      //    success: function() {
      //      // Change the view directly, without changing the route
      //      app.router.changeView(new app.views.AppliedToJoin({
      //        story: me.model,
      //        hero:  hero
      //      }));
      //    }
      //  });
      //},

      createNewHero: function(e) {
        app.execute("character:edit");
      }
    }));
  });
}).call(this);
