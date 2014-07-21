(function() {
  this.tww.module("game.views", function(module, app, Backbone, Marionette, $, _) {
    module.History = Marionette.View.extend(_.extend({}, app.lib.AdjustableHeight, {
      gameView: true,

      className: "page book-right story-page",

      initialize: function(options) {
        var me = this;

        this.listenTo(this.model.getMessagesHistory(), "add", function(message) {
          me.appendMessage(message);
        });

        this.listenTo(this.model.state, "chapter:change", function(chapter, index, mapTile) {
          me.appendChapter(chapter, index, mapTile);
        });
      },

      render: function() {
        this.$el.html(tww.t["story_page"]({
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
      }
    }));
  });
}).call(this);
