(function() {
  var verticalPadding = function(el) {
    return parseInt($(el).css('padding-top'), 10) + parseInt($(el).css('padding-bottom'), 10);
  };

  // Mixin that provides views with a method to adjust
  // their height to span the entire screen
  this.tww.lib.AdjustableHeight = {
    adjustHeight: function() {
      this.$el.css('min-height', $(window).height() - verticalPadding(this.$el) - verticalPadding(document.body));
      this.trigger('resize');
      return this;
    },

    onShow: function() {
      this.adjustHeight();
    }
  };
}).call(this);
