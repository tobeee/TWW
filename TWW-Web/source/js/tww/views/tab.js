//= require tww/views/base

(function() {
  var tww = this.tww;

  var Tab = tww.views.Base.extend({
    show: function() {
      this.$el.show();
      return this;
    },

    hide: function() {
      this.$el.hide();
      return this;
    }
  });

  tww.views.Tab = Tab;
}).call(this);
