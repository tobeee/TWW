(function() {
  this.tww.module("game.views", function(module, app, Backbone, Marionette, $, _) {
    module.NewMessage = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      gameView: true,

      className: 'story-enter-text',

      events: {
        'submit .story-enter-text-form': 'submit'
      },

      initialize: function(options) {
        var me = this;
        this.listenTo(this.model.state, "turn:switch", function() {
          me.updateInput();
        });
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
    }));
  });
}).call(this);
