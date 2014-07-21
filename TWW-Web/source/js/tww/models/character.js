(function() {
  var tww = this.tww, Backbone = this.Backbone;

  var Character = Backbone.AssociatedModel.extend({
    parse: function(response) {
      return {
        name: response.name,
        desc: response.desc,
        // Spelling of archetype is not consistent
        // across all JSON objects, so we need to
        // normalize it
        archetype: response.archetype || response.archtype
      };
    }
  });

  tww.models.Character = Character;
}).call(this);
