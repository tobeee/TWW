(function() {
  var tww = this.tww;

  tww.addInitializer(function(options) {
    this.fayeClient = new Faye.Client(options.fayeURL);
  });
}).call(this);
