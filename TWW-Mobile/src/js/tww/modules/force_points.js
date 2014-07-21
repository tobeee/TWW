(function() {
  this.tww.module("forcePoints", function(module, app, Backbone, Marionette) {
    app.commands.setHandler("fp:buy", function() {
      forge.payments.purchaseProduct("100forcepoints");
    });

    app.on("start", function() {
      forge.payments.transactionReceived.addListener(function(data, confirm) {
        if (data.purchaseState == "PURCHASED") {
          var session = app.request("session:data");
          session.addForcePoints(100);
        }
        confirm();
      });
    });
  });
}).call(this);
