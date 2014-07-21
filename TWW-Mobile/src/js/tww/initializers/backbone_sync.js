(function() {
  var tww = this.tww;

  tww.addInitializer(function(options) {
    ForgeSync.baseURL = options.baseAjaxURL;
    Backbone.sync = ForgeSync.sync;
  });
}).call(this);
