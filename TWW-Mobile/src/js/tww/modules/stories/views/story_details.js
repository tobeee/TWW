(function() {
  this.tww.module("stories.views", function(module, app, Backbone, Marionette, $, _) {
    module.StoryDetails = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: 'page book-left story-details',

      triggers: {
        'click .story-god':   'story:zoom:god',
        'click .story-type':  'story:zoom:type'
      },

      events: {
        'click .story-hero':   'onHeroZoomed',
        'click .story-action': 'onMainAction'
      },

      render: function() {
        this.$el.html(tww.t['story_details']({
          story: this.model
        }));
        return this;
      },

      onHeroZoomed: function(e) {
        if (this.model.get('has_character')) {
          //tww.router.navigate('characters/' + this.model.get('character_id'), {trigger: true});
          this.trigger("story:zoom:hero", {model: this.model});
        } else {
          //tww.router.navigate('stories/' + this.model.id + '/role', {trigger: true});
          this.trigger("story:zoom:roles", {model: this.model});
        }
      },

      onMainAction: function(e) {
        if (!$(e.target).closest('button:enabled').length) return;
        if (this.model.canApplyToJoin()) {
          this.trigger("story:apply", {model: this.model});
        } else {
          this.trigger("story:read", {model: this.model});
        }
      }

      //storyAction: function(e) {
      //  // Do nothing if button is disabled
      //  if (!$(e.target).closest('button:enabled').length) return;
      //  if (this.model.canApplyToJoin()) {
      //    this.applyToJoin();
      //  } else {
      //    this.readStory();
      //  }
      //},

      //applyToJoin: function() {
      //  tww.router.navigate('stories/' + this.model.id + '/apply', {trigger: true});
      //},

      //readStory: function() {
      //  tww.router.navigate('stories/' + this.model.id + '/read', {trigger: true});
      //},
    }));
  });
}).call(this);
