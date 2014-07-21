//= require tww/views/tab

(function() {
  var tww = this.tww;

  var CharacterEdit = tww.views.Base.extend({
    el: '#med-cast-edit',

    template: 'map_editor/character_form',

    events: {
      'click .ok': 'save',
      'click .cancel': 'close'
    },

    render: function() {
      this.$el.html(this.template({character: this.model}));
      this.form = this.$('#med-cast-form');
      return this;
    },

    save: function(e) {
      this.model.set(this.form.serializeObject());
      this.collection && this.collection.add(this.model);
      this.close(e);
    },

    close: function(e) {
      e.preventDefault();
      this.$el.hide();
      this.destroy();
      this.trigger('close');
    }
  });

  var CharacterEntry = tww.views.Base.extend({
    className: 'med-character',

    template: 'map_editor/character',

    events: {
      'click .med-char-edit': 'edit',
      'dragstart': 'setupDroppables',
      'dragstop':  'teardownDroppables'
    },

    initialize: function() {
      var me = this;
      this.listenTo(this.model, 'change', function() {
        me.render();
      });
    },

    render: function() {
      this.$el.html(this.template({character: this.model}));
      this.$el.data('model', this.model);
      this.setupDraggable();
      return this;
    },

    edit: function(e) {
      this.trigger('edit', this.model);
    },

    setupDraggable: function() {
      var me = this;
      this.$el.draggable({
        helper:   function() { return me._draggableHelper(); },
        appendTo: 'body',
        cancel:   '.med-char-edit',
        revert:   'invalid',
        scope:    'map',
        scroll:   false,
        containment: 'window',
        cursorAt: {
          left:   25,
          bottom: 0
        }
      });
    },

    setupDroppables: function(e) {
      this._mapMode = tww.ui.map.mode;
      tww.ui.map.setMode('dropCharacter');
    },

    teardownDroppables: function(e) {
      // restore previous map mode
      tww.ui.map.setMode(this._mapMode);
    },

    destroy: function() {
      this.$el.draggable('destroy');
      this._destroy();
    },

    _draggableHelper: function() {
      return $('<div class="med-char-drag"></div>')[0];
    }
  });

  var CastTab = tww.views.Tab.extend({
    id: 'med-cast',

    template: 'map_editor/cast',

    events: {
      'click .med-cast-new': 'showNewCharacterForm'
    },

    subViews: [],

    initialize: function(options) {
      var me = this;

      this.model || (this.model = tww.router.story);

      this.listenTo(this.model, 'add:cast', function(character) {
        me.addCharacter(character);
      });
    },

    render: function() {
      var me = this;

      this.$el.html(this.template({
        story: this.model
      }));

      this.list = this.$('#med-cast-list');
      this.form = this.$('#med-cast-edit');

      // Render subviews
      this.model.get('cast').each(function(character) {
        me.addCharacter(character);
      });

      return this;
    },

    addCharacter: function(character) {
      var me = this, view = (new CharacterEntry({model: character})).render();
      this.listenTo(view, 'edit', function(character) {
        me.editCharacter(character);
      });
      this.list.append(view.el);
      this.subViews.push(view);
      return this;
    },

    show: function() {
      this.setMapMode();
      return tww.views.Tab.prototype.show.apply(this);
    },

    showList: function() {
      this.list.show();
      this.form.hide();
    },

    showForm: function() {
      this.list.hide();
      this.form.show();
    },

    showNewCharacterForm: function() {
      this.editCharacter(new tww.models.Character);
    },

    editCharacter: function(characterOrEvent) {
      var character, me = this;

      if (characterOrEvent instanceof tww.models.Character) {
        character = characterOrEvent;
      } else {
        //character = $(e.target).data();
      }

      this.editView && this.stopListening(this.editView);

      this.editView = (new CharacterEdit({
        model: character,
        collection: this.model.get('cast')
      })).render();

      this.listenToOnce(this.editView, 'close', function() {
        me.showList();
      });

      this.showForm();
    },

    setMapMode: function() {
      tww.ui.map.setMode('normal');
      return this;
    },

    destroy: function() {
      _.invoke(this.subViews, 'destroy');
      this.editView && this.editView.destroy();
      this._destroy();
    }
  });

  tww.views.MapEditor.TABS_MAP.cast = CastTab;
}).call(this);
