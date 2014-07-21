(function() {
  var StoryPage = Backbone.View.extend({
    gameView: true,

    className: 'page book-right story-page',

    events: {
    },

    initialize: function(options) {
      var me = this;

      this.model.getMessagesHistory().on('add', function(message) {
        me.appendMessage(message);
      }, this);

      this.model.state.on('chapter:change', function(chapter, index, mapTile) {
        me.appendChapter(chapter, index, mapTile);
      }, this);
    },

    render: function() {
      this.$el.html(tww.t.story_page({
        story: this.model
      }));

      return this;
    },

    appendMessage: function(message) {
      var template = tww.t[_.result(message, 'renderWith')];
      if (!template) return;
      var messagesContainer = this.$('.chapter .chapter-messages').last();
      messagesContainer.append(template({message: message}));
      this.scrollToBottom();
    },

    appendChapter: function(chapter, index, mapTile) {
      this.$el.append(tww.t.chapter({
        chapter:  chapter,
        index:    index,
        mapTile:  mapTile,
        messages: []
      }));
      this.scrollToBottom();
    },

    scrollToBottom: function() {
      $.scroll($(document.body).height() - $(window).height(), 1000);
    },

    destroy: function() {
      this.undelegateEvents();
      this.model.getMessagesHistory().off(null, null, this);
      this.model.state.off(null, null, this);
    }
  });

  // Mixins
  _.extend(StoryPage.prototype, AdjustableHeight);

  window.tww.views.StoryPage = StoryPage;
})();
