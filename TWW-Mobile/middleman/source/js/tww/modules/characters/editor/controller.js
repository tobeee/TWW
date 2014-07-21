(function() {
  this.tww.module("characters.editor", function(module, app, Backbone, Marionette) {
    module.CharacterEditController = Marionette.Controller.extend({
      initialize: function(options) {
        this.model = options.model;
        this._setupLayout();
      },

      start: function() {
        this.editNameAndGender();
      },

      editNameAndGender: function() {
        var view = this._changeView('NameAndGender');
        var controller = this;
        this.listenToOnce(view, "done", function() {
          controller.pickBodyType();
        });
      },

      pickBodyType: function() {
        var view = this._changeView('BodyType');
        var controller = this;
        this.listenToOnce(view, "done", function() {
          //controller.
          //alert("TODO: Jump to body customizer");
          controller.editQuestions();
        });
      },

      editQuestions: function() {
        var view = this._changeView('Questions', {
          questions: app.data.characterQuestions[0]
        });
        var controller = this;
        this.listenToOnce(view, "done", function() {
          controller.editItems();
        });
      },

      editItems: function() {
        var view = this._changeView('Items', {
        });
      },

      save: function() {
        var me = this;
        $.when(
          app.request("characters")
        ).done(function(collection) {
          collection.add(me.model);
          me.model.save();
        });
      },

      _changeView: function(viewName, options) {
        options || (options = {});
        var view = new module.views[viewName](
          _.extend({model: this.model}, options)
        );
        this.layout.body.show(view);
        this.trigger("view:change", view, viewName);
        return view;
      },

      _setupLayout: function() {
        this.layout = new module.views.Layout;
        // Listen to toolbar events
        this.listenTo(this.layout, "toolbar:body",  _.bind(this.pickBodyType, this));
        this.listenTo(this.layout, "toolbar:name",  _.bind(this.editNameAndGender, this));
        this.listenTo(this.layout, "toolbar:story", _.bind(this.editQuestions, this));
        this.listenTo(this.layout, "toolbar:items", _.bind(this.editItems, this));
        this.listenTo(this.layout, "toolbar:save",  _.bind(this.save, this));
        // Add layout to main region
        app.mainRegion.show(this.layout);
      }
    });
  });
}).call(this);
