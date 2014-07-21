(function() {
  this.tww.module("game.views", function(module, app, Backbone, Marionette, $, _) {
    module.Menu = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      gameView: true,

      className: 'story-writing-menu book-cover',

      initialize: function(options) {
        var me = this;
        this.listenTo(this.model.state, "herofp:change", function() {
          me.updateForcePoints();
        });
      },

      render: function() {
        this.$el.html(tww.t.story_writing_menu({
          story: this.model
        }));
        this.$fp = this.$('.force-points-count');
        return this;
      },

      updateForcePoints: function() {
        var fp = this.model.state.forcePoints;
        this.$fp.html(fp).attr("title", fp);
      }
    }));
  });
}).call(this);
