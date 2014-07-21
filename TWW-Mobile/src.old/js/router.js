tww.Router = Backbone.Router.extend({
  routes: {
    "":                  "index",
    "login":             "login",

    "your-turn":         "yourTurn",
    "to-read":           "toRead",
    "hero-wanted":       "heroWanted",
    "your-heroes":       "yourHeroes",

    "users/:id":         "userDetails",
    "characters/:id":    "heroDetails",

    "stories/:id":       "storyDetails",
    "stories/:id/role":  "roleSummary",
    "stories/:id/type":  "storyTypeSummary",
    "stories/:id/apply": "chooseHero",

    "stories/:id/read":  "storyPage",
    "stories/:id/menu":  "storyMenu",
    "stories/:id/map":   "storyMap",
    "stories/:id/write": "storyEnterText",

    "notifications":     "notifications"
  },

  initialize: function() {
    // Keeps a link to the current "being played" story
    this.currentStory = null;
  },

  login: function() {
    // Redirect to index if we're already
    // logged in
    if (!_.isEmpty(tww.session)) {
      tww.router.navigate('', {trigger: true, replace: true});
      return;
    }

    this.changeView(new tww.views.Login({}));
  },

  index: function() {
    // Login first
    if (_.isEmpty(tww.session)) {
      this.navigate('login', {trigger: true, replace: true});
      return;
    }

    this.changeView(new tww.views.Index({
      stories: this._getStories(),
      characters: this._getCharacters()
    }));
  },

  yourTurn: function() {
    this.changeView(new tww.views.StoriesBookshelf({
      preset: 'yourTurn',
      collection: this._getStories(),
      expanded: true,
      fetch: true
    }));
  },

  toRead: function() {
    this.changeView(new tww.views.StoriesBookshelf({
      preset: 'toRead',
      collection: this._getStories(),
      expanded: true,
      fetch: true
    }));
  },

  heroWanted: function() {
    this.changeView(new tww.views.StoriesBookshelf({
      preset: 'heroWanted',
      collection: this._getStories(),
      expanded: true,
      fetch: true
    }));
  },

  yourHeroes: function() {
    this.changeView(new tww.views.HeroesBookshelf({
      preset: 'yourHeroes',
      collection: this._getCharacters(),
      expanded: true,
      fetch: true
    }));
  },

  heroDetails: function(id) {
    this.changeView(new tww.views.HeroDetails({
      collection: this._getCharacters(),
      stories: this._getStories(),
      modelId: +id
    }));
  },

  userDetails: function(id) {
    var user = new tww.m.User({id: +id});

    var userStories = new tww.m.Stories();

    this.changeView(new tww.views.UserDetails({
      user: user,
      stories: this._getStories(),
      characters: this._getCharacters()
    }));
  },

  storyDetails: function(id) {
    var stories = this._getStories();

    this.changeView(new tww.views.StoryDetails({
      collection: stories,
      modelId: +id
    }));
  },

  roleSummary: function(id) {
    var stories = this._getStories();
    var story = stories.get(+id);

    this.changeView(new tww.views.RoleTypeSummary({
      model: story
    }));
  },

  storyTypeSummary: function(id) {
    var stories = this._getStories();
    var story = stories.get(+id);

    this.changeView(new tww.views.StoryTypeSummary({
      model: story
    }));
  },

  chooseHero: function(id) {
    var stories = this._getStories();
    var story = stories.get(+id);

    this.changeView(new tww.views.ChooseHero({
      collection: this._getCharacters(),
      model: story
    }));
  },

  storyPage: function(id) {
    var me = this;
    this._setCurrentStory(id, function(story) {
      me.changeView(new tww.views.StoryPage({
        model: story
      }));
    });
  },

  storyMenu: function(id) {
    var me = this;
    this._setCurrentStory(id, function(story) {
      me.changeView(new tww.views.StoryWritingMenu({
        model: story
      }));
    });
  },

  storyMap: function(id) {
    var me = this;
    this._setCurrentStory(id, function(story) {
      me.changeView(new tww.views.Map({
        model: story
      }));
    });
  },

  storyEnterText: function(id) {
    var me = this;
    this._setCurrentStory(id, function(story) {
      me.changeView(new tww.views.StoryEnterText({
        model: story
      }));
    });
  },

  // Notifications don't behave as other routes as they
  // don't replace the main content of the page, but rather
  // act as an overlay on top of the current page.
  notifications: function() {
    if (!this.notificationsView) {
      this.notificationsView = new tww.views.Notifications({
        collection: this._getStories()
      });
      this.notificationsView.render();
    }

    this.notificationsView.show();
  },

  _setCurrentStory: function(id, callback) {
    if (!this.currentStory || (id != this.currentStory.id)) {
      var stories = this._getStories();
      var story = stories.get(+id);
      // Stop listening for messages on old active story
      if (this.currentStory) {
        this.currentStory.getMessagesHistory().unsubscribe();
      }
      this.currentStory = story;
    }

    var me = this;
    this.currentStory.fetch({
      success: function() {
        me.currentStory.start({success: callback});
      }
    });
  },

  changeView: function(view) {
    var previousView     = this.currentView,
        transitionBuffer = $('#tww-transition-buffer'),
        container        = $('#tww-main');

    // Set the current view
    this.currentView = view;

    // Show or hide tabbar as needed
    if (window.forge !== undefined) {
      forge.tabbar[this.currentView.gameView ? 'show' : 'hide']();
    }

    // Hide notifications overlay
    if (this.notificationsView) this.notificationsView.hide();

    // Move old view to transition buffer
    if (previousView) {
      previousView.destroy();
      transitionBuffer.html(container.children()).css({left: 0}).show();
    }

    // Render view and insert into DOM
    container.html(this.currentView.render().el);

    if (this.currentView.adjustHeight !== undefined) {
      this.currentView.adjustHeight();
    }

    if (previousView) {
      _.defer(function() {
        transitionBuffer.animate({
          left: -$(window).width()
        }, {
          duration: 400,
          easing: 'ease',
          complete: function() {
            transitionBuffer.empty().hide();
            $.scroll(0, 100);
          }
        });
      });
    } else {
      $.scroll(0, 100);
    }
  },

  _getStories: function() {
    if (typeof this.stories === 'undefined') {
      this.stories = new tww.m.Stories;
    }

    return this.stories;
  },

  _getCharacters: function() {
    if (typeof this.characters === 'undefined') {
      this.characters = new tww.m.Characters;
    }

    return this.characters;
  }
});
