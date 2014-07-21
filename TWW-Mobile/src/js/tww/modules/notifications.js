(function() {
  var tww = this.tww, Backbone = this.Backbone;

  var MainRegion = Backbone.Marionette.Region.extend({
    el: "#tww-main",

    transitionBufferEl: "#tww-transition-buffer",

    // Override close to slide the current view
    // out before removing it
    close: function() {
      if (this.currentView) {
        this.slideOut();
      }
      Backbone.Marionette.Region.prototype.close.call(this);
    },

    onShow: function(view) {
      this.scrollToTop();
    },

    ensureTransitionBuffer: function() {
      if (!this.$transitionBuffer || this.$transitionBuffer.length === 0) {
        this.$transitionBuffer = Backbone.$(this.transitionBufferEl);
      }
    },

    slideOut: function() {
      var region = this;
      this.ensureTransitionBuffer();
      this.ensureEl();
      this.$transitionBuffer.html(this.$el.children().clone()).css({left: 0}).show();
      _.defer(function() {
        region.$transitionBuffer.animate({
          left: -$(window).width()
        }, {
          duration: 400,
          complete: function() {
            region.$transitionBuffer.empty().hide();
            //region._scrollToTop();
          }
        });
      });
    },

    scrollToTop: function() {
      $(document.body).animate({scrollTop: 0}, 100);
    }
  });

  tww.addRegions({
    mainRegion: MainRegion
  });
}).call(this);

(function() {
  this.tww.module('notifications', function(module, app, Backbone, Marionette, $, _) {
    var Router = Marionette.AppRouter.extend({
      appRoutes: {
        "notifications": "show"
      }
    });

    var NotificationsView = Marionette.View.extend({
      el: '#tww-notifications',

      events: {
        'click .notification': 'openNotification'
      },

      initialize: function() {
        var me = this;
        this.$container = $('#tww-notifications-list');
        this.listenTo(this.collection, 'reset', _.bind(this.render, this));
      },

      render: function() {
        this.$container.html(tww.t["notifications"]({
          notifications: this.collection.myTurn()
        }));
        return this;
      },

      close: function() {
        this.undelegateEvents();
        this.collection.off(null, null, this);
      },

      show: function() {
        this.$el.show();
        this.$container.css({
          height: $(window).height() - parseInt(this.$el.css('top'))
        });
        return this;
      },

      hide: function() {
        this.$el.hide();
        return this;
      },

      openNotification: function(e) {
      }
    });

    var api = {
      show: function() {
        $.when(
          this._getView()
        ).done(function(view) {
          view.show();
        })
        app.navigate('notifications');
      },

      hide: function() {
        if (this._notificationsView) {
          this._notificationsView.hide();
        }
      },

      _getView: function() {
        if (this._notificationsView) return this._notificationsView;
        var defer = $.Deferred(), me = this;
        $.when(
          app.request("stories")
        ).done(function(stories) {
          var view = me._notificationsView = new NotificationsView({
            collection: stories
          });
          defer.resolve(view.render());
        });
        return defer.promise();
      }
    };

    // Hide notifications on show of main region
    app.mainRegion.on('show', function() {
      api.hide();
    });

    app.addInitializer(function() {
      new Router({controller: api});
    });
  });
}).call(this);
