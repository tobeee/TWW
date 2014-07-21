(function() {
  var UserDetails = Backbone.View.extend({
    className: 'user-details',

    initialize: function(options) {
      var me = this;

      this.user = options.user;
      this.stories = options.stories;
      this.characters = options.characters;

      this.userStories = new tww.m.Stories;

      this.user.fetch({
        success: function() {
          me._renderBookshelves();
          me.stories.fetch({reset: true, data: {email: tww.session.email}});
          me.characters.fetch({reset: true, data: {email: tww.session.email}});
          me.userStories.fetch({reset: true, data: {userid: me.user.id}});
        }
      });
    },

    render: function() {
      this.$el.html(tww.t.user_details({
        user: this.user
      }));

      return this;
    },

    destroy: function() {
      this.undelegateEvents();
      this.user.off(null, null, this);
      if (this.bookshelfViews) _.invoke(this.bookshelfViews, 'destroy');
    },

    _renderBookshelves: function() {
      var me = this;

      if (!this.bookshelfViews) {
        this.asGodBookshelf = new tww.views.StoriesBookshelf({
          title: "Written as a God",
          collection: this.stories,
          filter: function(c) { return c.byGod(me.user); }
        });

        this.asHeroBookshelf = new tww.views.StoriesBookshelf({
          title: "Player as a Hero",
          collection: this.userStories
        });

        this.heroesBookshelf = new tww.views.HeroesBookshelf({
          title: function() {
            if (me.user.get('firstname').match(/s$/)) {
              return me.user.get('firstname') + "' Heroes";
            } else {
              return me.user.get('firstname') + "'s Heroes";
            }
          },
          collection: this.characters,
          filter: function(c) { return c.byUser(me.user.id); }
        });

        this.bookshelfViews = [
          this.asGodBookshelf,
          this.asHeroBookshelf,
          this.heroesBookshelf
        ];
      }

      _.each(this.bookshelfViews, function(b) {
        me.$el.append(b.render().el);
      });
    }
  });

  // Mixins
  _.extend(UserDetails.prototype, AdjustableHeight);

  window.tww.views.UserDetails = UserDetails;
})();
