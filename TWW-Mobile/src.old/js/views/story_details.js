(function() {
  var StoryDetails = Backbone.View.extend({
    className: 'page book-left story-details',

    events: {
      'click .story-god':    'showGodDetails',
      'click .story-hero':   'showHeroDetails',
      'click .story-type':   'showStoryType',
      'click .story-action': 'storyAction'
    },

    initialize: function(options) {
      var me = this;

      this.modelId = options.modelId;

      this.collection.on('reset', function() {
        me._setModel();
        me.model.fetch();
      }, this);

      this.collection.fetch({reset: true, data: {email: tww.session.email}});
    },

    render: function() {
      if (this.model) {
        this.$el.html(tww.t.story_details({
          story: this.model
        }));
      }

      return this;
    },

    destroy: function() {
      this.undelegateEvents();
      if (this.model) this.model.off(null, null, this);
      this.collection.off(null, null, this);
    },

    storyAction: function(e) {
      // Do nothing if button is disabled
      if (!$(e.target).closest('button:enabled').length) return;

      if (this.model.canApplyToJoin()) {
        this.applyToJoin();
      } else {
        this.readStory();
      }
    },

    applyToJoin: function() {
      tww.router.navigate('stories/' + this.model.id + '/apply', {trigger: true});
    },

    readStory: function() {
      tww.router.navigate('stories/' + this.model.id + '/read', {trigger: true});
    },

    showHeroDetails: function() {
      if (this.model.get('has_character')) {
        tww.router.navigate('characters/' + this.model.get('character_id'), {trigger: true});
      } else {
        tww.router.navigate('stories/' + this.model.id + '/role', {trigger: true});
      }
    },

    showGodDetails: function() {
      tww.router.navigate('/users/' + this.model.get('creator_id'), {trigger: true});
    },

    showStoryType: function() {
      tww.router.navigate('stories/' + this.model.id + '/type', {trigger: true});
    },

    _setModel: function() {
      var me = this;

      this.model = this.collection.get(this.modelId);

      this.model.on('change', function() {
        me.model.getGodUser().fetch({
          success: function() { me.render(); }
        });
      }, this);

      return this;
    }
  });

  // Mixins
  _.extend(StoryDetails.prototype, AdjustableHeight);

  window.tww.views.StoryDetails = StoryDetails;
})();
