(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.Items = Marionette.Layout.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: "character-edit-items",

      template: "character_editor/items/layout",

      regions: {
        forcePoints: ".force-points-container"
      },

      events: {
        "click .force-points-buy-more": "buy"
      },

      onRender: function() {
        this._showForcePoints();
      },

      buy: function() {
        app.execute("fp:buy");
      },

      _showForcePoints: function() {
        if (!this.forcePointsView) {
          this.forcePointsView = new app.views.ForcePoints({
            model: app.request("session:data")
          });
        }
        this.forcePoints.show(this.forcePointsView);
      }
    }));
  });
}).call(this);
