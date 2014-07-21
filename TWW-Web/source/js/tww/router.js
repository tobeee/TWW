(function() {
  var root = this;
  var tww = this.tww;

  var Router = this.Backbone.Router.extend({
    routes: {
      "": "index"
    },

    initialize: function() {
    },

    index: function() {
      var story = new tww.models.Story({id: 1});
      this.story = story;
      story.fetch({
        success: function() {
          //var map = new tww.models.Map({storyId: 1});
          var map = story.getMap();
          tww.ui.map = new tww.views.Map({collection: map});
          map.fetch();
        }
      });
    }
  });

  tww.Router = Router;
}).call(this);
