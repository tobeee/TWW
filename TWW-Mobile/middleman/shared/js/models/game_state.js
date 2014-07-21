(function() {
  var INITIAL_FORCE_POINTS = 200;
  var GOD_TURN = true;
  var HERO_TURN = !GOD_TURN;
  var INITIAL_TURN = GOD_TURN;

  var GameState = function(story) {
    this.story = story;

    this.currentChapter = 0;

    // List of current objectives, initialized
    // with first chapter's objectives
    this.objectives = new tww.models.Objectives(
      this.story.get('chapters')[0].objectives
    );

    // List of current cast
    this.cast = new tww.models.Cast();

    this.forcePoints = INITIAL_FORCE_POINTS;

    this.whoseTurn = INITIAL_TURN;
    this.turnCount = 1;

    // Initialize hero's position
    this.heroPos = {};
    this.moveHero(
      this.story.get('hero').xTile,
      this.story.get('hero').yTile
    );

    // TODO: Check with Toby whether this
    // initialization is the right one
    this.inventory = new tww.models.Inventory(
      this.story.get('hero').inventory
    );
  };

  _.extend(GameState.prototype, Backbone.Events, {
    addForcePoints: function(forcePoints) {
      if (forcePoints > 0) {
        this.forcePoints += forcePoints;
        this.trigger('herofp:change', this.forcePoints);
        this.trigger('herofp:add', forcePoints, this.forcePoints);
      }
      return this;
    },

    removeForcePoints: function(forcePoints) {
      if (forcePoints > 0) {
        this.forcePoints -= forcePoints;
        this.trigger('herofp:change', this.forcePoints);
        this.trigger('herofp:remove', forcePoints, this.forcePoints);
      }
      return this;
    },

    endTurn: function(options) {
      options || (options = {});

      this.whoseTurn = !this.whoseTurn;
      this.turnCount++;

      this.trigger('turn:switch', this.whoseTurn);
      this.trigger(this.isGodTurn() ? 'turn:god' : 'turn:hero');

      if (options.publish) {
        this.story.getMessagesHistory().push({
          endTurn: true,
          currentX: this.heroPos.x,
          currentY: this.heroPos.y
        }).publish();
      }

      return this;
    },

    isGodTurn: function() {
      return this.whoseTurn === GOD_TURN;
    },

    isHeroTurn: function() {
      return this.whoseTurn === HERO_TURN;
    },

    moveHero: function(x, y) {
      var mapTile;

      if (x instanceof tww.models.MapTile) {
        mapTile = x;
        x = mapTile.x;
        y = mapTile.y;
      } else {
        mapTile = this.story.getMap().get(x, y);
      }

      mapTile.visit();

      this.heroPos.x = x;
      this.heroPos.y = y;

      this.trigger('hero:move', this.heroPos, mapTile);
    },

    loadChapter: function(index) {
      var chapter = this.story.get('chapters')[index];

      if (!chapter) {
        throw "Invalid chapter index.";
      }

      var mapTile = this.story.getMap().get(chapter.locationX, chapter.locationY);

      this.objectives.reset(chapter.objectives);
      this.moveHero(mapTile);
      this.currentChapter = index;
      this.trigger('chapter:change', chapter, index, mapTile);
    }
  });

  window.tww.models.GameState = GameState;
})();
