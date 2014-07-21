// Backbone.View mixin
window.AdjustableHeight = {
  adjustHeight: function() {
    var verticalPadding = parseInt(this.$el.css('padding-top')) + parseInt(this.$el.css('padding-bottom'));
    this.$el.css('min-height', $(window).height() - verticalPadding);
    this.trigger('resize');
    return this;
  }
};
