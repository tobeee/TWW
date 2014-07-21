// Overwrite Collection and Model's fetch to keep
// track of the last fetch, and not fetch from the
// server again if the expireAfter option is set and
// it hasn't expired yet.
(function(C, M) {
  var expired = function() {
    if (this.expireAfter === undefined) return true;
    // if expireAfter is false never expire
    if ((this.expireAfter === false) && this.lastFetched) return false;
    return this.lastFetched ?
      ((new Date).getTime() - this.lastFetched) / 1000 > this.expireAfter :
      true;
  };

  C.fetch = function(options) {
    options = options ? _.clone(options) : {};
    if (options.parse === undefined) options.parse = true;
    var collection = this;
    var success = options.success;
    if (!this.expired() && !options.forceFetch) {
      _.defer(function() { collection.trigger('reset'); });
      if (success) success(collection);
      return true;
    } else {
      options.success = function(resp, status, xhr) {
        collection.lastFetched = (new Date).getTime();
        collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
        if (success) success(collection, resp);
      };
      options.error = Backbone.wrapError(options.error, collection, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    }
  };

  M.fetch = function(options) {
    options = options ? _.clone(options) : {};
    var model = this;
    var success = options.success;
    if (!this.expired() && !options.forceFetch) {
      _.defer(function() { model.trigger('change'); });
      if (success) success(model);
      return true;
    } else {
      options.success = function(resp, status, xhr) {
        model.lastFetched = (new Date).getTime();
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp);
      };
      options.error = Backbone.wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    }
  };

  C.expired = M.expired = expired;
})(Backbone.Collection.prototype, Backbone.Model.prototype);
