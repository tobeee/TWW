//= require tww/models/item

(function() {
  var tww = this.tww, Backbone = this.Backbone;

  var Hero = Backbone.AssociatedModel.extend({
    relations: [
      {
        type: Backbone.Many,
        key: 'inventory',
        relatedModel: tww.models.Item
      }
    ]
  });

  tww.models.Hero = Hero;
}).call(this);
