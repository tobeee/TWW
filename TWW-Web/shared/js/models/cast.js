(function() {
  var CastMember = Backbone.Model.extend({
    defaults: {
    },

    parse: function(response) {
      return {
        name: response.name,
        desc: response.desc,
        // Spelling of archtype is not consistent
        // across all JSON objects, so we need to
        // normalize it
        archtype: response.archtype || response.archetype
      };
    }
  });

  var Cast = Backbone.Collection.extend({
    model: CastMember
  });

  _.extend(window.tww.models, {
    CastMember: CastMember,
    Cast: Cast
  });
})();
