(function() {
  var tww = this.tww;

  var BOOKSHELF_TOP_HEIGHT = 22;
  var BOOKSHELF_SHELF_HEIGHT = 273;
  var BOOKSHELF_HORIZONTAL_MARGIN = 35;
  var BOOKSHELF_VERTICAL_MARGIN = 19;

  // How many items to show in the unexpanded view
  var BOOKSHELF_COMPACT_LIMIT = 3;

  var validOptions = [
    'title',
    'collection',
    'filter',
    'expanded',
    'expandedRoute',
    'fetch',
    'showAddButton'
  ];

  var Bookshelf = Backbone.View.extend({
    className: 'bookshelf section',

    events: {
      'click .bookshelf-header': 'handleBookshelfHeaderClick'
    },

    initialize: function(options) {
      var me = this;

      options = options || {};

      if (options.preset) {
        _.defaults(options, this.presets[options.preset]);
        delete options.preset;
      }

      _.extend(this, _.pick(options, validOptions));

      this.collection.on('reset', function() {
        me.renderItems();
      }, this);

      if (this.fetch) {
        this.collection.fetch({reset: true, data: {email: tww.session.email}});
      }
    },

    render: function() {
      this.$el.html(tww.t.bookshelf({
        title:         _.result(this, 'title'),
        showAddButton: !!this.showAddButton,
        toggleButton:  !!this.expandedRoute 
      })).addClass(this.expanded ? 'expanded' : 'compact');

      // Keep a reference to the content child element
      // for rendering items
      this.$contentEl = this.$('.bookshelf-content');

      // Render items if any are available
      if (this.collection.length) {
        this.renderItems();
      }

      return this;
    },

    renderItems: function() {
      var filtered = this.filteredCollection();

      this.$contentEl.html(tww.templates[this.itemsTemplate]({
        collection: filtered
      }));

      return this.reflow();
    },

    // Unregister events to prevent memory leaks
    destroy: function() {
      this.collection.off(null, null, this);
      this.undelegateEvents();
      return this;
    },

    filteredCollection: function() {
      var filtered;

      if (this.filter) {
        if (_.isFunction(this.filter)) {
          filtered = this.filter(this.collection);
        } else {
          filtered = _.result(this.collection, this.filter);
        }
      } else {
        filtered = this.collection;
      }

      if (this.expanded) {
        return filtered.models;
      } else {
        return filtered.first(BOOKSHELF_COMPACT_LIMIT);
      }
    },

    // Manually position items within the shelves
    // so they are evenly distributed and new shelves
    // are added if needed.
    reflow: function() {
      var scale       = window.innerWidth <= 640 ? 0.5 : 1,
          bookEls     = this.$('.book, .hero'),
          wrapperEl   = this.$('.bookshelf-content-wrapper'),
          contentEl   = this.$contentEl,
          bookWidth   = bookEls.width(),
          bookHeight  = bookEls.height(),
          shelfWidth  = contentEl.width() - (BOOKSHELF_HORIZONTAL_MARGIN * scale * 2),
          booksPerRow = Math.floor(shelfWidth / bookWidth),
          shelves     = Math.max(Math.ceil(bookEls.length / booksPerRow), 1),
          gutterWidth = Math.round((shelfWidth - (booksPerRow * bookWidth)) / (booksPerRow - 1));

      contentEl.css('height', Math.round(scale * (BOOKSHELF_TOP_HEIGHT + BOOKSHELF_SHELF_HEIGHT * shelves)));

      bookEls.each(function(i, book) {
        var row = Math.floor(i / booksPerRow),
            col = i % booksPerRow;

        $(book).css({
          left: Math.round(scale * BOOKSHELF_HORIZONTAL_MARGIN) + col * (bookWidth + (col ? gutterWidth : 0)),
          top:  Math.round(scale * (BOOKSHELF_TOP_HEIGHT + BOOKSHELF_VERTICAL_MARGIN + row * BOOKSHELF_SHELF_HEIGHT))
        });
      });

      if (this.expanded) {
        wrapperEl.css({
          height:   window.innerHeight - this.$('.bookshelf-header').height(),
          overflow: 'auto'
        });
      }

      return this;
    },

    toggle: function() {
      if (this.expandedRoute) {
        tww.router.navigate(this.expanded ? '' : this.expandedRoute, {trigger: true});
      }
    },

    handleBookshelfHeaderClick: function(e) {
      if ($(e.target).is('.bookshelf-header, .bookshelf-toggle, .bookshelf-toggle *')) {
        this.toggle();
      }
    },

    showItem: function(e) {
      var target = $(e.target);

      if (target.hasClass('book')) {
        var bookId = target.data('book-id');
        tww.router.navigate('stories/' + bookId, {trigger: true});
      } else if (target.hasClass('hero')) {
        var charId = target.data('character-id');
        tww.router.navigate('characters/' + charId, {trigger: true});
      }
    }
  });

  tww.views.Bookshelf = Bookshelf;
}).call(this);
