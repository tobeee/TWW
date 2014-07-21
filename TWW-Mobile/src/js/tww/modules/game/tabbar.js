(function() {
  this.tww.module("game", function(module, app, Backbone, Marionette, $, _) {
    var tint = [242, 194, 94, 255]; // #F2C25E

    app.addInitializer(function(options) {
      // Set the tabbar's color
      forge.tabbar.setTint(tint);

      var noop = function() {};

      forge.tabbar.addButton({
        icon: "images/messages-button-icon.png",
        text: "Menu",
        index: 0
      }, function(button) {
        button.onPressed.addListener(function() {
          module.controller.showMenu();
        }, noop);
      });

      forge.tabbar.addButton({
        icon: "images/messages-button-icon.png",
        text: "History",
        index: 2
      }, function(button) {
        button.onPressed.addListener(function() {
          module.controller.showHistory();
        }, noop);
      });

      forge.tabbar.addButton({
        icon: "images/messages-button-icon.png",
        text: "Enter text",
        index: 2
      }, function(button) {
        button.onPressed.addListener(function() {
          module.controller.newMessage();
        }, noop);
      });

      forge.tabbar.addButton({
        icon: "images/messages-button-icon.png",
        text: "End turn",
        index: 2
      }, function(button) {
        button.onPressed.addListener(function() {
          module.controller.endTurn();
        }, noop);
      });

      forge.tabbar.addButton({
        icon: "images/messages-button-icon.png",
        text: "Map",
        index: 2
      }, function(button) {
        button.onPressed.addListener(function() {
          module.controller.showMap();
        }, noop);
      });

      // Hide tabbar by default.
      forge.tabbar.hide();

      // Show or hide tabbar when changing main views.
      this.mainRegion.on("show", function(view) {
        forge.tabbar[view.gameView ? "show" : "hide"]();
      });
    });
  });
}).call(this);
