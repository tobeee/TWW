(function() {
  var User = Backbone.Model.extend({
    url: function() {
      return '/users/' + this.id + '.js'
    },

    parse: function(response) {
      return response.user;
    }
  });

  window.tww.models.User = User;
})();
