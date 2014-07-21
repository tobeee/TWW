(function() {
  var tww = this.tww;

  var AppliedToJoin = Marionette.View.extend(_.extend({}, tww.lib.AdjustableHeight, {
    className: 'page book-left applied-to-join',

    events: {
      'click .applied-ok': 'showStory',
      'click .applied-to-join-story': 'showStory',
      'click .applied-to-join-hero': 'showHero',
      'click .applied-to-join-god': 'showUser'
    },

    initialize: function(options) {
      this.story = options.story;
      this.hero = options.hero;
      this.story.fetch();
    },

    render: function() {
      this.$el.html(tww.t.applied_to_join({
        story: this.story,
        hero: this.hero
      }));
      return this;
    },

    showStory: function() {
      tww.router.navigate('stories/' + this.story.id, {trigger: true});
    },

    showHero: function() {
      tww.router.navigate('characters/' + this.hero.id, {trigger: true});
    },

    showUser: function() {
      tww.router.navigate('users/' + this.story.get('creator_id'), {trigger: true});
    },

    close: function() {
      this.undelegateEvents();
    }
  }));

  tww.views.AppliedToJoin = AppliedToJoin;
}).call(this);
