(function() {
  var tww = this.tww;

  var TOPBAR_TINT = [250, 249, 248, 255]; // #FAF9F8
  var TITLE_IMAGE = 'images/logo.png';

  tww.addInitializer(function(options) {
    if (!(forge && forge.topbar)) return;

    forge.topbar.setTitleImage(TITLE_IMAGE);

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
      // XXX: Refactor this to not use trigger: true!
      tww.router.navigate('notifications', {trigger: true});
    });
  });
}).call(this);
