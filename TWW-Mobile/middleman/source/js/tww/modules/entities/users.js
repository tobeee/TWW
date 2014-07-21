(function() {
  this.tww.module("entities.users", function(module, app) {
    app.reqres.setHandler("user", function(id) {
      var user = new tww.models.User({id: +id});
      var defer = $.Deferred();
      user.fetch({
        success: function() {
          defer.resolve(user);
        },
        error: function() {
          defer.resolve(undefined);
        }
      });
      return defer.promise();
    });

    app.reqres.setHandler("user:stories", function(id) {
      var stories = new tww.models.Stories;
      var defer = $.Deferred();
      stories.fetch({
        data: {userid: +id},
        success: function(stories) {
          defer.resolve(stories);
        },
        error: function() {
          defer.resolve(undefined);
        }
      });
      return defer.promise();
    });
  });
}).call(this);
