(function() {
  this.tww.module("users.views", function(module, app, Backbone, Marionette) {
    module.UserDetails = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: 'user-details',

      initialize: function(options) {
        var me = this;

        this.user = options.user;
        this.stories = options.stories;
        this.characters = options.characters;
        this.userStories = options.userStories;

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
      },

      render: function() {
        this.$el.html(tww.t.user_details({
          user: this.user
        }));
        this._renderBookshelves();
        return this;
      },

      onClose: function() {
        _.invoke(this.bookshelfViews, 'close');
      },

      onShow: function() {
        _.each(this.bookshelfViews, function(subview) {
          Marionette.triggerMethod.call(subview, "show");
        });
        this.adjustHeight();
      },

      _renderBookshelves: function() {
        var me = this;
        _.each(this.bookshelfViews, function(b) {
          me.$el.append(b.render().el);
        });
      }
    }));
  });
}).call(this);
