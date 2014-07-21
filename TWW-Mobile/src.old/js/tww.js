(function() {
  var TOPBAR_TINT = [250, 249, 248, 255]; // #FAF9F8
  var TABBAR_TINT = [242, 194, 94, 255]; // #F2C25E

  var BACKBONE_OPTIONS = {
    root: '/'
    //pushState: true
  };

  var tww = {
    options: {
      baseAjaxURL: 'http://www.playlablondon.com:4003',
      fayeURL:     'http://www.playlablondon.com:4003/faye'
    },

    models:    {},
    views:     {},
    templates: {},
    lib:       {},

    helpers: {
      simpleFormat: function(text) {
        return '<p>' + text.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br/>') + '</p>';
      }
    },

    session: {},

    data: {
      roleTypes: {
        "A Villain": {
          name: "A Villain",
          shortName: "Villain",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Winner": {
          name: "A Winner",
          shortName: "Winner",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Fugitive": {
          name: "A Fugitive",
          shortName: "Fugitive",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Tyrant": {
          name: "A Tyrant",
          shortName: "Tyrant",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Helpful God": {
          name: "A Helpful God",
          shortName: "Helpful God",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Ghost": {
          name: "A Ghost",
          shortName: "Ghost",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Judge": {
          name: "A Judge",
          shortName: "Judge",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Victim": {
          name: "A Victim",
          shortName: "Victim",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Loser": {
          name: "A Loser",
          shortName: "Loser",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Problem": {
          name: "A Problem",
          shortName: "Problem",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Hero": {
          name: "A Hero",
          shortName: "Hero",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Friend": {
          name: "A Friend",
          shortName: "Friend",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Traitor": {
          name: "A Traitor",
          shortName: "Traitor",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Messenger": {
          name: "A Messenger",
          shortName: "Messenger",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Lawman": {
          name: "A Lawman",
          shortName: "Lawman",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "Someone Desired": {
          name: "Someone Desired",
          shortName: "Someone Desired",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Lover": {
          name: "A Lover",
          shortName: "Lover",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Monster": {
          name: "A Monster",
          shortName: "Monster",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Mad Person": {
          name: "A Mad Person",
          shortName: "Mad Person",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Priest": {
          name: "A Priest",
          shortName: "Priest",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Mentor": {
          name: "A Mentor",
          shortName: "Mentor",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Hunter": {
          name: "A Hunter",
          shortName: "Hunter",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Person Owed": {
          name: "A Person Owed",
          shortName: "Person Owed",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Helper": {
          name: "A Helper",
          shortName: "Helper",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "A Killer": {
          name: "A Killer",
          shortName: "Killer",
          description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
        },
        "An Unknown Role": {
          name: "An Unknown Role",
          shortName: "Unkown",
          description: "The actual role type is missing."
        }
      },

      storyTypes: {
        "Vengeance": {
          name: "Vengeance",
          description: "In a story of Vengeance ..."
        }
      }
    },

    setupTopbar: function() {
      if (!(forge && forge.topbar)) return;

      forge.topbar.setTitleImage('images/logo.png');

      forge.topbar.setTint(TOPBAR_TINT);

      forge.topbar.addButton({
        text:     "Back",
        position: "left",
        style:    "back",
        type:     "back",
        tint:     TOPBAR_TINT
      });

      forge.topbar.addButton({
        icon:     "images/messages-button-icon.png",
        position: "right",
        tint:     [220, 220, 220, 150]
      }, function() {
        tww.router.navigate('notifications', {trigger: true});
      });
    },

    setupTabbar: function() {
      if (!(forge && forge.tabbar)) return;

      forge.tabbar.setTint(TABBAR_TINT);

      forge.tabbar.addButton({
        icon: 'images/messages-button-icon.png',
        text: "Menu",
        index: 0
      }, function(button) {
        button.onPressed.addListener(function() {
          tww.router.navigate('stories/' + tww.router.currentStory.id + '/menu', {trigger: true});
        }, function() {
        });
      });

      forge.tabbar.addButton({
        icon: 'images/messages-button-icon.png',
        text: "History",
        index: 2
      }, function(button) {
        button.onPressed.addListener(function() {
          tww.router.navigate('stories/' + tww.router.currentStory.id + '/read', {trigger: true});
        }, function() {
        });
      });

      forge.tabbar.addButton({
        icon: 'images/messages-button-icon.png',
        text: "Enter text",
        index: 2
      }, function(button) {
        button.onPressed.addListener(function() {
          tww.router.navigate('stories/' + tww.router.currentStory.id + '/write', {trigger: true});
        }, function() {
        });
      });

      forge.tabbar.addButton({
        icon: 'images/messages-button-icon.png',
        text: "End turn",
        index: 2
      }, function(button) {
        button.onPressed.addListener(function() {
          var gameState = tww.router.currentStory.state;
          if (gameState.isHeroTurn()) {
            gameState.endTurn({publish: true});
          } else {
            alert("It's not your turn.");
          }
        }, function() {
        });
      });

      forge.tabbar.addButton({
        icon: 'images/messages-button-icon.png',
        text: "Map",
        index: 2
      }, function(button) {
        button.onPressed.addListener(function() {
          tww.router.navigate('stories/' + tww.router.currentStory.id + '/map', {trigger: true});
        }, function() {
        });
      });

      forge.tabbar.hide(); // Hide tabbar by default
    },

    // Forge requires us to use their own AJAX methods,
    // so we need to patch Backbone.sync to use those
    // instead of jQuery/Zepto's
    setupBackboneSync: function() {
      if (forge && forge.ajax) {
        ForgeSync.baseURL = this.options.baseAjaxURL;
        Backbone.sync = ForgeSync.sync;
      } else {
        Backbone.sync = MockSync.sync;
      }
    },

    loadTemplates: function() {
      var me = this;

      $('script[type="text/underscore-template"]').each(function() {
        var t = $(this);
        me.templates[t.data('template-name')] = _.template(t.html());
      });
    },

    init: function(options) {
      // Set up some shortcuts
      this.m = this.models;
      this.v = this.views;
      this.t = this.templates;
      this.h = this.helpers;

      this.setupTopbar();
      this.setupTabbar();
      this.setupBackboneSync();
      this.loadTemplates();

      this.fayeClient = new Faye.Client(this.options.fayeURL);
      this.router = new tww.Router();

      if (!Backbone.history.start(BACKBONE_OPTIONS)) {
        this.router.navigate('/', { trigger: true });
      }
    }
  };

  window.tww = tww;
})();
