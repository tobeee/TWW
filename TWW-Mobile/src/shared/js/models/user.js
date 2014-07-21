(function() {
  var User = Backbone.Model.extend({
    url: function() {
      return '/users/' + this.id + '.js'
    },

    expireAfter: 60 * 60,

    parse: function(response) {
      return response.user;
    }
  });

  window.tww.models.User = User;
})();
