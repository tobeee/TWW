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
