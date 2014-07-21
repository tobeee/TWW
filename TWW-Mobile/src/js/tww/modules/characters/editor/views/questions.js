(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.Question = Marionette.View.extend({
      className: "character-question",

      initialize: function(options) {
        this.question = options.question;
      },

      render: function() {
      }
    });

    module.Questions = Marionette.View.extend({
      className: "page book-right character-edit-questions",

      events: {
        "click .character-questions-ok": "done"
      },

      initialize: function(options) {
        this.questions = options.questions;
        this.questionViews = [];
        this._loadExistingQuestionViews();
      },

      render: function() {
        this.$el.html(tww.t["character_editor/questions"]({
          character: this.model,
          questions: this.questions
        }));
        return this;
      },

      done: function() {
        this.trigger("done");
      },

      _loadExistingQuestionViews: function() {
        //_.each(this.model.questions, function(question) {
        //  this.questionViews.push();
        //})
        _.each(this.questions.questions, function(question) {
          
        });
      }
    });
  });
}).call(this);
