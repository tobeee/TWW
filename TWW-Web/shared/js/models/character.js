(function() {
  var Character = Backbone.Model.extend({
    defaults: {
      archtype: "A Lawman"
    },

    parse: function(response) {
      if (response.attributes) {
        var data = JSON.parse(response.attributes.data);

        // Build a minimalist object with just the attributes we need
        return {
          id:          response.attributes.id,
          user_id:     response.attributes.user_id,
          name:        data.char_name,
          description: data.desc,
          archtype:    data.archtype || this.defaults.archtype,
          mine:        response.char_mine === "mychar"
        };
      } else {
        return {
          name:        response.name,
          description: response.desc,
          archtype:    response.type || response.archetype || this.defaults.archtype
        };
      }
    },

    expireAfter: 60 * 30
  });

  var Characters = Backbone.Collection.extend({
    model: Character,

    renderWith: 'heroes',

    url: '/mobileendpointcharacter.js',

    expireAfter: 60 * 30,

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
