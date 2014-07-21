(function() {
  var env = this;
  this.Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(id) {
    return env.JST[id];
  };
  this.Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(template) {
    return template;
  };
}).call(this);
