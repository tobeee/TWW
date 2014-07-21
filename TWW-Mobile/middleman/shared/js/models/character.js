(function() {
  var Character = Backbone.Model.extend({
    defaults: {
      name:      "Hero",
      archetype: "A Lawman",
      gender:    "m" // Sexist?
    },

    parse: function(response) {
      var r = {};

      if (response.attributes) {
        var data = JSON.parse(response.attributes.data);

        // Build a minimalist object with just the attributes we need
        r = {
          id:          response.attributes.id,
          user_id:     response.attributes.user_id,
          name:        data.char_name,
          description: data.desc,
          archetype:   data.archetype || data.archtype || this.defaults.archetype,
          mine:        response.char_mine === "mychar"
        };
      } else {
        r = {
          name:        response.name,
          description: response.desc,
          archetype:   response.type || response.archetype || response.archtype || this.defaults.archtype
        };
      }

      // Compact result object
      _.each(r, function(v, k) {
        if (v === undefined) delete r[k];
      });

      return r;
    }
  });

  var Characters = Backbone.Collection.extend({
    model: Character,

    url: '/mobileendpointcharacter.js',

    mine: function() {
      return new Characters(this.where({mine: true}));
    },

    byUser: function(userOrId) {
      var id = _.isNumber(userOrId) ? userOrId : userOrId.id;
      return new Characters(this.where({user_id: id}));
    }
  });

  _.extend(window.tww.models, {
    Character:  Character,
    Characters: Characters 
  });
})();
