(function() {
  var tww = this.tww;

  tww.views.ForcePoints = Marionette.ItemView.extend({
    className: "force-points",

    template: "force_points",

    events: {
      "click .force-points-buy-more": "buy"
    },

    modelEvents: {
      "change:fp": "render"
    },
    
    buy: function() {
      alert("Buy");
      tww.execute("fp:buy");
    }
  });
}).call(this);
