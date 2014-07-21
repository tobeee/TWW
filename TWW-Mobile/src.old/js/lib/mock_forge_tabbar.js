(function() {
  var $tabbar;

  $(function() {
    $(document.head).append('<link rel="stylesheet" type="text/css" href="css/mock_forge_tabbar.css" />');
    $(document.body).append('<div id="-mock-forge-tabbar"></div>');
    $tabbar = $('#-mock-forge-tabbar');
  });

  var forge = this.forge || (this.forge = {});

  forge.tabbar = {
    setTint: function() {},

    addButton: function(options, added, f) {
      var button = {},
          buttonEl = $('<div class="-mock-forge-tabbar-button"></div>').html(options.text);

      $tabbar.append(buttonEl);

      button.onPressed = {
        addListener: function(callback) {
          buttonEl.click(callback);
        }
      };

      added(button);
    },

    hide: function() {
      $tabbar.hide();
    },

    show: function() {
      $tabbar.show();
    }
  };
}).call(this);
