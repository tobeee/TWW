TWW
===

This is the release of the codebase of The Written World by Playlab London. It's split into two parts - the mobile version of the game (which is complete) and the map editor.

Please find attached instructions on running them locally, for you to have a play around with.

To set stuff up you'll need to have Ruby installed, and have a working knowledge of the command line. We are using a piece of middlware called Middleman which will compile the game code and create a webserver for you to test thing's out.

Editing the game will require knowledge of SASS/Compass/JST/Backbone.

TWW Mobile
----------

To get Middleman up and running you'll need a recent version of Ruby (1.9+).

With Ruby installed run (from the TWW-Mobile folder):

    gem install bundler && cd middleman && bundle
    middleman

That will fire up a web server (usually in 0.0.0.0:4567) which you can access
through a browser to see the app.

Note - the mobile version uses mock data when run locally, so it will allow you to take a look through the flow of the game. In addition, the mock data will explain the format of hw the games, characters, and users are saved and loaded. 

When the version is compiled (using middleman build), the mock data is not used. Instead it allows you to set a server in the code itself - though this will need to be redone from the ground up. In addition, the compiled version uses a set of hooks from Trigger.io Forge, which is the tool we used to compile the game down to native. It provides a number of hooks which we used, such as facebook login, and visual stuff like the native-feel toolbars.

TWW Map Editor
----------

To get Middleman up and running you'll need a recent version of Ruby (1.9+).

With Ruby installed run (from the TWW-Web folder):

    gem install bundler && cd middleman && bundle
    middleman

That will fire up a web server (usually in 0.0.0.0:4567) which you can access
through a browser to see the app.

The Map Editor is the first part of the TWW web client. It's still missing a few key features, like an improved character drop functionality and better description editor. Once those have been completed, adding the message parser and game functionality from the mobile version would come close to the completed version we had in mind.

TWW Server
----------

This is the part that completely needs to be rewritten. The server doesn't do much except store the data and act as a websockets server to send data to the clients. I've included a copy of the Schema inside the TWW-Server folder. This, coupled with the mock data inside TWW-Mobile should be enough to rebuild the server completely. 


Note - l_histories,l_requests and lobbies are not needed for the game to function, they were used to manage the story joining lobbies. Stories, users, characters and maps are needed for a basic version of the game to work. The data is stored in JSON, which you can find dummy versions of in the TWW-Mobile directory

I'll be happy to help if anyone decides to do this!

Next steps
---------
-  Finish up explanation of how the game should function
-  Finish up map editor
-  Add the actual game functionality to map editor
-  Rewrite the server code


License
---------
The game is released under the GPL licence, which can be viewed [here](http://opensource.org/licenses/GPL-3.0 "GPL")
