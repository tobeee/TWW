(function() {
  var _ = this._, tww = this.tww;

  tww.helpers = tww.helpers || {};

  _.extend(tww.helpers, {
    simpleFormat: function(text) {
      return '<p>' + text.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br/>') + '</p>';
    }
  });
}).call(this);
