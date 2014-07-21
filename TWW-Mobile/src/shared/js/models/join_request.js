(function() {
  var JoinRequest = Backbone.Model.extend({
    url: '/l_requests',

    parse: function() {
      return {};
    }
  });

  window.tww.models.JoinRequest = JoinRequest;
})();
