(function() {
  var env = this;

  this.tww.module('session', function(module, app, Backbone, Marionette, $, _) {
    var Session = Backbone.Model.extend({
      defaults: {
        fp: 3000
      },

      addForcePoints: function(n) {
        this.set('fp', this.get('fp') + n);
      }
    });

    var sessionData;

    var login = function() {
      env.forge.facebook.authorize(function() {
        env.forge.facebook.api('me', function(facebookData) {
          // We need the user id as well, so here's
          // yet another server roundtrip...
          env.forge.ajax({
            url:       env.ForgeSync.baseURL + '/userid.js',
            type:      'GET',
            dataType:  'json',
            data:      { email: facebookData.email },

            success: function(response) {
              sessionData = new Session({
                id:    response.userid || response.id,
                email: facebookData.email
              });
              app.vent.trigger("session:start");
            }
          });
        });
      },

      function() {
        alert('Authorization failed!');
      });
    };

    var LoginView = Marionette.ItemView.extend(_.extend({}, app.lib.AdjustableHeight, {
      className: "page book-left login-screen",

      template: "login",

      events: {
        "click #facebook-login-button": "login"
      },

      initialize: function() {
        this.on('resize', _.bind(this._centerButton, this));
      },

      login: function() {
        login();
      },

      _centerButton: function() {
        var loginButton = this.$('#facebook-login-button');
        loginButton.css({
          marginTop: Math.round(this.$el.height() / 2 - loginButton.height() / 2)
        });
      }
    }));

    module.controller = {
      login: function() {
        if (app.request("session:data")) {
          app.vent.trigger("session:start");
        } else {
          app.mainRegion.show(new LoginView);
        }
      }
    };

    app.reqres.setHandler("session:data", function() {
      return sessionData;
    });

    app.reqres.setHandler("session:currentUser", function() {
      if (!sessionData) throw "User session has not been started.";
      var defer = new $.Deferred();
      var user = new app.models.User({id: sessionData.id});
      user.fetch({
        success: function() {
          defer.resolve(user);
        },
        error: function() {
          defer.resolve(undefined);
        }
      });
      return defer.promise();
    });

    app.on("start", function() {
      module.controller.login();
    });
  });
}).call(this);
