//= require tww/views/base
//= require_self
//= require_tree ./map_editor

(function() {
  var tww = this.tww;

  var DRAGGABLE_OPTIONS = {
    containment: 'window',
    distance: 10,
    opacity: 0.7,
    handle: '.ui-tabs',

    // Prevent triggering a click on drag stop
    stop: function(e) {
      $(e.toElement).one('click', function(e) { e.stopImmediatePropagation(); });
    }
  };

  var TABS_MAP = {};

  var MapEditor = tww.views.Base.extend({
    el: '#map-editor-toolbox',

    events: {
      'click .ui-tabs': 'selectTab'
    },

    initialize: function(options) {
      this.tabs = {};
      this.tabsContainer = $('#med-tabs');
      this.body = this.$('#med-body');
      this.$el.draggable(DRAGGABLE_OPTIONS);
    },

    toggle: function() {
      this.$el.toggle();

      // Return map to normal mode if the editor was closed
      if (this.$el.is(':hidden')) {
        tww.ui.map.setMode('normal');
      } else {
        this.currentTab && this.currentTab.setMapMode();
      }
    },

    destroy: function() {
      this._destroy();
      this.$el.draggable('destroy');
      _.invoke(this.tabs, 'destroy');
    },

    selectTab: function(e) {
      var tab = $(e.target);
      this.showTab(tab.data('tab'));
      this.tabsContainer.find('.ui-tab').removeClass('active');
      tab.addClass('active');
    },

    showTab: function(tab) {
      if (!this.tabs[tab]) {
        this.tabs[tab] = new TABS_MAP[tab]();
        this.body.append(this.tabs[tab].render().$el);
      }
      _.invoke(this.tabs, 'hide');
      this.currentTab = this.tabs[tab].show().setMapMode();
    }
  });

  MapEditor.TABS_MAP = TABS_MAP;

  tww.views.MapEditor = MapEditor;
}).call(this);
