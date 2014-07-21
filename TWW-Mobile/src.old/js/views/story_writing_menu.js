(function() {
  var StoryWritingMenu = Backbone.View.extend({
    gameView: true,

    className: 'story-writing-menu',

    events: {
    },

    initialize: function(options) {
      this.setupListeners();
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
      this.$fp.html(fp).attr('title', fp);
    },

    setupListeners: function() {
      var me = this;

      //this.model.state.objectives.on('change:completed', function() {
      //  console.log('view objective completed');
      //}, this);

      this.model.state.on('herofp:change', function() {
        me.updateForcePoints();
      }, this);
    },

    destroy: function() {
      this.undelegateEvents();
      //this.model.state.objectives.off(null, null, this);
      this.model.state.off(null, null, this);
    }
  });

  // Mixins
  _.extend(StoryWritingMenu.prototype, AdjustableHeight);

  tww.views.StoryWritingMenu = StoryWritingMenu;
})();
