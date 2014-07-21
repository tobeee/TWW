//= require tww/models/character
//= require tww/models/item
//= require tww/models/hero
//= require tww/models/chapter

(function() {
  var root = this, tww = this.tww, Backbone = this.Backbone;

  var Story = Backbone.AssociatedModel.extend({
    url: function() {
      return '/maps/' + this.id + '/storydata.js';
    },

    relations: [
      {
        type: Backbone.Many,
        key: 'cast',
        relatedModel: tww.models.Character
      },
      {
        type: Backbone.Many,
        key: 'items',
        relatedModel: tww.models.Item
      },
      {
        type: Backbone.One,
        key: 'hero',
        relatedModel: tww.models.Hero
      },
      {
        type: Backbone.Many,
        key: 'chapters',
        relatedModel: tww.models.Chapter
      }
    ],

    initialize: function(attributes, options) {
      var me = this;

      // Link to the story's Map instance
      this.map = null;
    },

    parse: function(response) {
      var data = JSON.parse(response.storydata);

      return {
        type:           data.type,
        cast:           data.cast,
        items:          data.items,
        hero:           data.hero,
        hero_role_type: tww.data.roleTypes[response.pcArchType || "An Unknown Role"],
        join_requests:  response.joinrequests,
        chapters:       data.chapters
      };
    },

    getMap: function() {
      return this.map || (this.map = new tww.models.Map(undefined, {story: this}));
    }
  });

  tww.models.Story = Story;
}).call(this);
