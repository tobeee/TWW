(function() {
  var forge = this.forge || (this.forge = {});

  var dummyPurchase = {
    purchaseState: "PURCHASED"
  };

  var purchaseConfirm = function() {
    alert("Payment Confirm");
  };

  var listeners = [];

  forge.payments = {
    transactionReceived: {
      addListener: function(callback) {
        listeners.push(callback);
      }
    },

    purchaseProduct: function() {
      _.each(listeners, function(listener) {
        listener(dummyPurchase, purchaseConfirm);
      });
    }
  };
}).call(this);
