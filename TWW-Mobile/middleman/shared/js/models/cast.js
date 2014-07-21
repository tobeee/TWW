(function() {
  var tww = this.tww;

  var CastMember = Backbone.Model.extend({
    defaults: {
    },

    parse: function(response) {
      return {
        name: response.name,
        desc: response.desc,
        // Spelling of archetype is not consistent
        // across all JSON objects, so we need to
        // normalize it
        archetype: response.archtype || response.archetype
      };
    }
  });

  var Cast = Backbone.Collection.extend({
    model: CastMember
  });

  _.extend(tww.models, {
    CastMember: CastMember,
    Cast: Cast
  });
}).call(this);
