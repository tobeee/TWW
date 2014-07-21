(function() {
  this.tww.module("characters.editor.views", function(module, app, Backbone, Marionette) {
    module.ArchetypePicker = Marionette.View.extend({
      className: 'archetype-picker section',

      events: {
        'click .archetype': 'pickArchetype'
      },

      render: function() {
        this.$el.html(tww.t['character_editor/archetype_picker']({
          archetypes: this.collection
        }));
        return this;
      },

      pickArchetype: function(e) {
        var archetypeEl = $(e.target).closest('.archetype');
        app.execute("character:edit:build", archetypeEl.data('archetype-name'));
      }
    });
  });
}).call(this);
