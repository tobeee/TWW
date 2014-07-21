tww.views.ForcePoints = Backbone.View.extend({
  className: 'force-points section',

  render: function() {
    $(this.el).html(tww.t['force_points']({
      forcePoints: Math.round(Math.random() * 9999)
    }));
    return this;
  }
});
