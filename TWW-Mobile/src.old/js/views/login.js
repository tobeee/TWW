(function() {
  var Login = Backbone.View.extend({
    className: 'page book-left login-screen',

    events: {
      'click #facebook-login-button': 'login'
    },

    initialize: function() {
      var me = this;
      this.on('resize', function() { me.centerButton() });
    },

    render: function() {
      this.$el.html(tww.t.login({
      }));
      return this;
    },

    destroy: function() {
      this.undelegateEvents();
    },

    login: function() {
      if (forge && forge.facebook) {
        forge.facebook.authorize(function() {
          forge.facebook.api('me', function(facebookData) {
            // We need the user id as well, so here's
            // yet another server roundtrip...
            forge.ajax({
              url: tww.options.baseAjaxURL + '/userid.js',
              type: 'GET',
              dataType: 'json',
              data: {email: facebookData.email},
              success: function(response) {
                tww.session = {
                  email: facebookData.email,
                  id:    response.userid
                };
                tww.router.navigate('', {trigger: true, replace: true});
              }
            });
          });
        },
        function() {
          alert('Authorization failed!');
        });
      } else {
        tww.session = {
          email: 'tobeee@gmail.com',
          id: 1
        };
        tww.router.navigate('', {trigger: true});
      }
    },

    centerButton: function() {
      var loginButton = this.$('#facebook-login-button');
      loginButton.css({
        marginTop: Math.round(this.$el.height() / 2 - loginButton.height() / 2)
      });
    }
  });

  // Mixins
  _.extend(Login.prototype, AdjustableHeight);

  window.tww.views.Login = Login;
})();
