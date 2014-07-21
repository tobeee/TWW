(function() {
  var Notifications = Backbone.View.extend({
    el: '#tww-notifications',

    events: {
      'click .notification': 'openNotification'
    },

    initialize: function() {
      var me = this;

      this.$containerEl = $('#tww-notifications-container');

      this.collection.on('reset', function() {
        me.render();
      }, this);

      this.collection.fetch({data: {email: tww.session.email}});
    },

    render: function() {
      this.$containerEl.html(tww.t.notifications({
        notifications: this.collection.myTurn()
      }));
    },

    close: function() {
      this.undelegateEvents();
      this.collection.off(null, null, this);
    },

    show: function() {
      this.$el.show();

      this.$containerEl.css({
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

  window.tww.views.Notifications = Notifications;
})();
