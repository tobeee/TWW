(function() {
  var StoryEnterText = Backbone.View.extend({
    gameView: true,

    className: 'story-enter-text',

    events: {
      'submit .story-enter-text-form': 'submit'
    },

    initialize: function(options) {
      var me = this;
      this.model.state.on('turn:switch', function() {
        me.updateInput();
      }, this);
    },

    render: function() {
      var me = this;

      this.$el.html(tww.t.story_enter_text({
        story: this.model
      }));

      this.$input = this.$('.story-enter-text-input');

      this.updateInput();

      return this;
    },

    destroy: function() {
      this.undelegateEvents();
      this.model.state.off(null, null, this);
    },

    submit: function(event) {
      event.preventDefault();

      var text = this.$input.val();

      this.model.getMessagesHistory().push({
        sendText: text,
        who:      "hero",
        actions:  0,
        channel:  "meta",
        type:     "normal"
      }).apply().publish();

      this.$input.val('');
    },

    updateInput: function() {
      if (this.model.state.isHeroTurn()) {
        this.$input.removeAttr('disabled');
        this.$input.trigger('click');
      } else {
        this.$input.attr('disabled', 'disabled');
      }
    }
  });

  // Mixins
  _.extend(StoryEnterText.prototype, AdjustableHeight);

  window.tww.views.StoryEnterText = StoryEnterText;
})();
