TWW
===

This is the release of the codebase of The Written World by Playlab London. It's split into two parts - the mobile version of the game (which is complete) and the map editor.

Please find attached instructions on running them locally, for you to have a play around with.

To set stuff up you'll need to have Ruby installed, and have a working knowledge of the command line. We are a program called Middleman which will compile the game code and create a webserver for you to test thing's out.

Editing the game will require knowledge of SASS/Compass/JST/Backbone.

TWW Mobile
----------

To get Middleman up and running you'll need a recent version of Ruby (1.9+).

With Ruby installed run (from the TWW-Mobile folder):

    gem install bundler && cd middleman && bundle
    middleman

That will fire up a web server (usually in 0.0.0.0:4567) which you can access
through a browser to see the app.


TWW Map Editor
----------

To get Middleman up and running you'll need a recent version of Ruby (1.9+).

With Ruby installed run (from the TWW-Web folder):

    gem install bundler && cd middleman && bundle
    middleman

That will fire up a web server (usually in 0.0.0.0:4567) which you can access
through a browser to see the app.


How TWW works
----------

Next steps
---------

License
---------
The game is released under the GPL licence, which can be viewed [here](http://opensource.org/licenses/GPL-3.0 "GPL")
