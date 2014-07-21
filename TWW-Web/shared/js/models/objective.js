(function() {
  var Objective = Backbone.Model.extend({
    defaults: {
      fpValue:   20,
      played:    false,
      completed: false,
      used:      false,
      current:   false
    },

    current: function() {
      return this.get('played') && !this.get('completed');
    },

    complete: function() {
      return this.set({
        completed: true,
        used:      true
      });
    }
  });

  var Objectives = Backbone.Collection.extend({
    model: Objective
  });

  _.extend(window.tww.models, {
    Objective:  Objective,
    Objectives: Objectives
  });
})();
