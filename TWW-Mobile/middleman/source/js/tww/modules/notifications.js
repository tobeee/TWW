//= require tww/regions/main_region

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
