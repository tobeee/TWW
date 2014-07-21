(function() {
  var Item = Backbone.Model.extend({
  });

  var Inventory = Backbone.Collection.extend({
    model: Item
  });

  _.extend(window.tww.models, {
    Item: Item,
    Inventory: Inventory
  });
})();
