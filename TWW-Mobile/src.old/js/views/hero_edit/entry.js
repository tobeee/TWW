(function() {
  var tww = this.tww;

  var Entry = Backbone.View.extend({
    className: 'page book-left edit-hero-entry',

    events: {
      'click .new-hero': 'newHero',
      'click .edit-hero': 'editHero'
    },

    render: function() {
      this.$el.html(tww.t['edit_hero_entry']());
      return this;
    },

    destroy: function() {
    },

    newHero: function() {
      alert('new');
    },

    editHero: function() {
      tww.router.changeView(
        new tww.views.heroEdit.PickHero({
          collection: tww.router._getCharacters()
        })
      );
    }
  });

  // Mixins
  _.extend(Entry.prototype, AdjustableHeight);

  tww.views.heroEdit = tww.views.heroEdit || {};
  tww.views.heroEdit.Entry = Entry;
}).call(this);
