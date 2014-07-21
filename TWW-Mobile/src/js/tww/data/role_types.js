(function() {
  var tww = this.tww;

  tww.data = tww.data || {};

  // TODO:
  // - rename this to archetypes
  // - maybe use a Backbone model instead of plain objects?
  // - use "archetypes" request instead of directly accessing
  //   the object
  tww.data.roleTypes = {
    "A Villain": {
      name: "A Villain",
      shortName: "Villain",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Winner": {
      name: "A Winner",
      shortName: "Winner",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Fugitive": {
      name: "A Fugitive",
      shortName: "Fugitive",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Tyrant": {
      name: "A Tyrant",
      shortName: "Tyrant",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Helpful God": {
      name: "A Helpful God",
      shortName: "Helpful God",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Ghost": {
      name: "A Ghost",
      shortName: "Ghost",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Judge": {
      name: "A Judge",
      shortName: "Judge",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Victim": {
      name: "A Victim",
      shortName: "Victim",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Loser": {
      name: "A Loser",
      shortName: "Loser",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Problem": {
      name: "A Problem",
      shortName: "Problem",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Hero": {
      name: "A Hero",
      shortName: "Hero",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Friend": {
      name: "A Friend",
      shortName: "Friend",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Traitor": {
      name: "A Traitor",
      shortName: "Traitor",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Messenger": {
      name: "A Messenger",
      shortName: "Messenger",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Lawman": {
      name: "A Lawman",
      shortName: "Lawman",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "Someone Desired": {
      name: "Someone Desired",
      shortName: "Someone Desired",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Lover": {
      name: "A Lover",
      shortName: "Lover",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Monster": {
      name: "A Monster",
      shortName: "Monster",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Mad Person": {
      name: "A Mad Person",
      shortName: "Mad Person",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Priest": {
      name: "A Priest",
      shortName: "Priest",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Mentor": {
      name: "A Mentor",
      shortName: "Mentor",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Hunter": {
      name: "A Hunter",
      shortName: "Hunter",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Person Owed": {
      name: "A Person Owed",
      shortName: "Person Owed",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Helper": {
      name: "A Helper",
      shortName: "Helper",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "A Killer": {
      name: "A Killer",
      shortName: "Killer",
      description: "Proin commodo tristique purus, at vulputate enim mattis eget. Fusce lacus justo, viverra sit amet faucibus sed, ornare et metus. Nullam varius felis non nibh gravida volutpat."
    },
    "An Unknown Role": {
      name: "An Unknown Role",
      shortName: "Unkown",
      description: "The actual role type is missing."
    }
  };
}).call(this);
