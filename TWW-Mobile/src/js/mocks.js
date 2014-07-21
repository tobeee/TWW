(function() {
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  var MockSync = {
    sync: function(method, model, options) {
      var url = options.url || _.result(model, 'url') || urlError();

      // Replace numeric segments of the given
      // URL with "$", assuming they will always
      // be dynamic parts of the URL (e.g. an id)
      var urlMatcher = url.replace(/\/\d+([\/.]|$)/, '/$$$1');

      var result = MockSync.data[urlMatcher];

      if (result) {
        console.log('Mock fetch:', url, '[OK]');

        if (_.isFunction(result)) {
          var params = _.map(url.match(/\d+(?=[\/.]|$)/g), Number);
          result = result.apply(null, params);
        }

        _.defer(options.success, result);
      } else {
        console.log('Mock fetch:', url, '[FAIL]');
        options.error && _.defer(options.error);
      }

      return true;
    },

    data: {}
  };

  this.MockSync = MockSync;
}).call(this);
(function() {
  var buildJoinRequest = function(id) {
    return {
      l_request: {
        created_at: "2012-09-23T21:51:19Z",
        id: 1,
        map: 1,
        updated_at: "2012-09-23T21:51:19Z",
        user: id
      }
    };
  };

  var data = {
    '/userid.js': {
      id: 1
    },

    '/mobileendpoint.js': [
      {
        story_id: 1,
        summary: "A story about little red riding hood ",
        has_character: 0,
        finished: "",
        mygo: "mygo",
        my_story: "",
        lastupdated: "2012-11-10T15:39:15Z",
        storycreatorid: 1
      },
      {
        story_id: 2,
        summary: "A Clockwork Pomegranate",
        has_character: 1,
        finished: "",
        mygo: "mygo",
        my_story: "my_story",
        lastupdated: "2012-11-11T15:39:15Z",
        storycreatorid: 1
      },
      {
        story_id: 3,
        summary: "Lord of the Rink",
        has_character: 0,
        finished: "",
        mygo: "mygo",
        my_story: "",
        lastupdated: "2012-11-12T15:39:15Z",
        storycreatorid: 1
      },
      {
        story_id: 4,
        summary: "README.TXT",
        has_character: 1,
        finished: 1,
        mygo: "",
        my_story: "",
        lastupdated: "2012-11-13T15:39:15Z",
        storycreatorid: 1
      },
      {
        story_id: 5,
        summary: "The Meaning of Life",
        has_character: 0,
        finished: 1,
        mygo: "",
        my_story: "",
        lastupdated: "2012-11-14T15:39:15Z",
        storycreatorid: 1
      },
      {
        story_id: 6,
        summary: "Monsterworld",
        has_character: 0,
        finished: "",
        mygo: "",
        my_story: "",
        lastupdated: "2012-11-15T15:39:15Z",
        storycreatorid: 1
      },
      {
        story_id: 7,
        summary: "Adventure Time with Jinn and Fake",
        has_character: 0,
        finished: "",
        mygo: "",
        my_story: "",
        lastupdated: "2012-11-16T15:39:15Z",
        storycreatorid: 1
      },
      {
        story_id: 8,
        summary: "The Hidden Book",
        has_character: 0,
        finished: "",
        mygo: "mygo",
        my_story: "",
        lastupdated: "2012-11-17T15:39:15Z",
        storycreatorid: 1
      },
      {
        story_id: 9,
        summary: "Tales of the Unexpected",
        has_character: 0,
        finished: "",
        mygo: "mygo",
        my_story: "",
        lastupdated: "2012-11-18T15:39:15Z",
        storycreatorid: 1
      },
      {
        story_id: 10,
        summary: "Tales of the Expected",
        has_character: 0,
        finished: "",
        mygo: "mygo",
        my_story: "",
        lastupdated: "2012-11-19T15:39:15Z",
        storycreatorid: 1
      },
      {
        story_id: 11,
        summary: "Tail Tales",
        has_character: 0,
        finished: "",
        mygo: "mygo",
        my_story: "",
        lastupdated: "2012-11-20T15:39:15Z",
        storycreatorid: 1
      }
    ],

    '/mobileendpointcharacter.js': [
      {
        attributes: {
          id: 1,
          user_id: 1,
          data: JSON.stringify({
            char_name: "Shire",
            desc: "Some guy blah blah blah.\n\nHello World this is another paragraph."
          }),
          created_at: "2012-05-11T13:30:00Z",
          updated_at: "2012-05-11T13:30:00Z"
        },
        changed_attributes: {},
        previously_changed: {},
        attributes_cache: {},
        marked_for_destruction: false,
        destroyed: false,
        readonly: false,
        new_record: false,
        char_mine: "mychar"
      }
    ],

    '/maps/$/storydata.js': function(id) {
      var joinRequests = [];

      switch (id) {
        case 2:
          joinRequests.push(buildJoinRequest(2));
          break;
        case 3:
          joinRequests.push(buildJoinRequest(1));
          break;
      }

      return {
        storydata: JSON.stringify({
          hero: {
            archtype: "An Avenger",
            storyName: "Douglas Adams",
            xTile: 5,
            yTile: 5,
            inventory: [
              {
                name: 'A letter',
                desc: "Just a credit card bill."
              }
            ]
          }, 

          type: "Vengeance",

          chapters: [
            {
              name: "A Red Riding Hood",
              desc: "Once upon a time there was a village near the forest. This was the sweetest little village you ever did see. The streets were cobbled with round soft stones and the houses were small and cheerful.",
              locationX: 5,
              locationY: 5,
              objectives: [
                {
                  name: "Meet Mum",
                  fpValue: 20,
                  played: true,
                  completed: true,
                  used: true
                },
                {
                  name: "Take a look around",
                  fpValue: 30,
                  played: true,
                  completed: false
                }
              ],
              encounters: [
                {
                  name: 'Meeting Mum',
                  desc: 'Everyone loves Mum. Everyone knows Mum, and Mum makes sure she knows everyone, and their business. She bustles up to day hello because she bustles everywhere - this is a woman who has entirely perfected the art of a good bustle.',
                  objectives: [
                    {
                      name: "Eat well",
                      fpValue: 40,
                      played: true,
                      completed: true,
                      used: true
                    }
                  ],
                  cast: [
                    {
                      name: "Mum",
                      archetype: "A Friend",
                      desc: "Everyone loves Mum. She&#39s not your mother, but she&#39ll act like it, she doesn&#39t even have to know you. She&#39s a sweet lady and a dab hand with a sewing machine."
                    }
                  ],
                  items: [
                    {
                      name: "A sharp axe",
                      desc: "A huntsman's axe. Sharp enough for the job."
                    }
                  ]
                }
              ]
            },
            {
              name: "Something Licked This Way Comes",
              desc: "Chapter two is gonna f**k you in the a**.",
              locationX: 5,
              locationY: 4,
              objectives: [
                {
                  name: "Perform a Human Sacrifice",
                  fpValue: 50,
                  played: true,
                  completed: true,
                  used: true
                }
              ],
              encounters: [
                {
                  name: 'A Big Bad Wolf',
                  desc: 'The woods can be host to all sorts of things. Under a canopy of leaves hides that which is, by definition, unknown. Seclusion breeds all sorts of creatures, Wolf is probably the strangest anyone would care to meet.'
                }
              ]
            }
          ],

          cast: [
            {
               name: "Mum",
               archetype: "A Friend",
               desc: "Everyone loves Mum. She&#39s not your mother, but she&#39ll act like it, she doesn&#39t even have to know you. She&#39s a sweet lady and a dab hand with a sewing machine. "
            },
            {
               name: "That Cat",
               archetype: "A Helpful God",
               desc: "Small, fluffy, white, adorable, eyes as black and cold as gimlets, heart as great and empty as space. "
            },
            {
               name: "Big Bad Wolf",
               archetype: "A Villain",
               desc: "Wolf looks about as un-matronly as it is possible to look, though possible exceptions are offered for similar biological oddities. Wolf is tall and extremely hairy and has terrible halitosis. Notable features include: Big arms, big eyes, big teeth and a horrendous propensity for cannibalism. "
            },
            {
               name: "Granny",
               archetype: "A Victim",
               desc: "More than anything, Granny wants a visit from a beloved relative. Plagued by an unfortunate propensity to lie in bed convalescing, Granny lives In a cottage in the woods all by herself. It&#39s a worry for her family, but she&#39s just independent as all hell and she will not be persuaded."
            },
            {
               name: "Marcus Huntsman",
               archetype: "A Hunter",
               desc: "Marcus is burly. Marcus is burly like a fox is cunning - everyone assumes he is because everything else about him feels like he ought to be. He wears flannel shirts, he owns several pairs of boots, he carries an axe around and because of all of this the minds eye fills in the rest. In reality Marcus is tall but somewhat slimmer than he ought to be and possessed of an obsessive eye for detail which leaves him uncomfortable when presented with something like a crooked painting or mismatched cutlery set. "
            },
            {
               name: "Ted Huntsman",
               archetype: "A Hunter",
               desc: "Ted is tall and thin and gawky. He wears a shirt because he is a man who really ought to be doing something more illustrious than hunting. Nonetheless his trousers are rough and his boots are heavy and flecked with dry blood. You would never believe it to look him but he&#39s a hard man and quick to anger. "
            }
          ],

          items: [
            {
              name:"A sharp axe",
              desc:"A huntsman's axe. Sharp enough for the job."
            },
            {
              name:"A fallen star",
              desc:"Deep in the heart of the universe is a suspended moment, where quiet is up and down is what stars are born of. A single curious thought is quite enough to rouse a star, and where they fall all others fall also."
            },
            {
              name:"Intestines",
              desc:"Bloody guts, everwhere."
            }
          ]
        }),
        pcArchType: "A Lawman",
        joinrequests: joinRequests
      }
    },

    '/users/$.js': function() {
      return {
        user: {
          email: "tobeee@gmail.com",
          firstname: "Toby",
          image: null,
          lastname: "Green"
        }
      };
    },

    '/l_requests': function() {
      return {};
    },

    '/maps/$/mapdata.js': [
      [
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        }
      ],
      [
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'name':'A Wolfss Belly',
          'desc':'As a space to inhabit this leaves something to be desired. Theress not much latitude for movement, nor a great deal of air to breath. The various eukaryotic denizens of a Wolfss stomach pay you little mind, so at least the neighbours arenst a nuisance. ',
          'exitN':false,
          'exitE':false,
          'exitS':false,
          'exitW':false,
          'castPresent':[

          ],
          'items':[
            {
              'name':'Intestines',
              'desc':'Bloody guts, everwhere.'
            },
            {
              'name':'Stomach Acid',
              'desc':'That tingling feeling is probably just enzymes slowly devouring your body'
            }
          ],
          'img':'/images/maps/tiles/grass8.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        }
      ],
      [
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//vertCoast.png',
          'verbable':false,
          'walkable':false,
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        }
      ],
      [
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'name':'Grannyss bedroom',
          'desc':'Grannyss bedroom is dim, as would befit a convalescing woman. The curtains are closed and the lamps are snuffed. The bed is a grand old affair with four posters. Though the awnings are drawn back the voluminous blankets and quilts conceal the interior well. ',
          'exitN':false,
          'exitE':false,
          'exitS':true,
          'exitW':false,
          'castPresent':[

          ],
          'items':[

          ],
          'img':'/images/maps/tiles/houseWithRoofNoSouthWall.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        }
      ],
      [
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'name':'A clearing',
          'desc':'A grassy field with thick hedges blocking off ways but the one by which you came',
          'exitN':false,
          'exitE':false,
          'exitS':true,
          'exitW':false,
          'castPresent':[

          ],
          'items':[

          ],
          'img':'/images/maps/tiles/grass7.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'name':'Grannyss house',
          'desc':'Grannyss house is small and quaint, there is a table here and cabinets line the walls. A sill seems perfectly placed for the cooling of delicious pies. An open door offers a view into the bedroom, and a closed one hints at the yard to the East. ',
          'exitN':true,
          'exitE':true,
          'exitS':true,
          'exitW':false,
          'castPresent':[

          ],
          'items':[

          ],
          'img':'/images/maps/tiles/houseWithRoofDoorS.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'name':'A Yard',
          'desc':'A yard is filled with cut wood and mysteriously, chicken feed. There are no chickens. ',
          'exitN':true,
          'exitE':false,
          'exitS':true,
          'exitW':false,
          'castPresent':[

          ],
          'items':[

          ],
          'img':'/images/maps/tiles/grass6.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        }
      ],
      [
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//grass.png',
          'verbable':false,
          'walkable':true,
          'name':'A clearing',
          'desc':' A grassy clearing.',
          'exitN':true,
          'exitE':true,
          'exitS':false,
          'exitW':false,
          'castPresent':[

          ],
          'wasteland':false,
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//grass.png',
          'verbable':false,
          'walkable':true,
          'name':'A Clearing',
          'desc':'The woods opens out into a grassy clearing. Grannyss cottage is ahead, a cheerful sight for sure with a bright red door adorned with black iron handles and bars. ',
          'exitN':true,
          'exitE':true,
          'exitS':true,
          'exitW':true,
          'castPresent':[
            {name: "Batman", desc: "The Dark Knight", archtype: "A Friend"},
            {name: "Jesus", desc: "The Savior", archtype: "A Friend"}
          ],
          'wasteland':false,
          'items':[
            {name: "The Necronomicon", desc: "A merry children's book"},
            {name: "A Jar of Primordial Goo", desc: "The escence of life"}
          ]
        },
        {
          'name':'A clearing',
          'desc':'A sunny grassy clearing, warm soft earth gives beneath your steps',
          'exitN':true,
          'exitE':false,
          'exitS':false,
          'exitW':true,
          'castPresent':[

          ],
          'items':[

          ],
          'img':'/images/maps/tiles/grass2.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        }
      ],
      [
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//vertCoast.png',
          'verbable':false,
          'walkable':false,
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//trees.png',
          'verbable':false,
          'walkable':true,
          'name':'A path in the woods',
          'desc':'A path runs through the woods, the canopy is starting to thin a little. To the north you can see the bright light of day. ',
          'exitN':true,
          'exitE':true,
          'exitS':true,
          'exitW':false,
          'castPresent':[

          ],
          'wasteland':false,
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//grass.png',
          'verbable':false,
          'walkable':true,
          'name':'An opening in the trees ',
          'desc':'The trees open into a field, a picket fence bounds the grassy enclosure. ',
          'exitN':false,
          'exitE':false,
          'exitS':true,
          'exitW':true,
          'castPresent':[

          ],
          'wasteland':false,
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        }
      ],
      [
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//clearing.png',
          'verbable':false,
          'walkable':true,
          'name':'A Clearing in the woods',
          'desc':'A graceful willow overlooks the lake in this clearing. Reeds line the banks.',
          'exitN':false,
          'exitE':true,
          'exitS':true,
          'exitW':false,
          'castPresent':[

          ],
          'wasteland':false,
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//trees.png',
          'verbable':false,
          'walkable':true,
          'name':'A path in the woods',
          'desc':'A path runs through the woods, sometimes clear sometimes fading beneath a messy growth of hedge or bramble. A dense deciduous canopy allows a little light in. ',
          'exitN':true,
          'exitE':true,
          'exitS':true,
          'exitW':true,
          'castPresent':[

          ],
          'wasteland':false,
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//trees.png',
          'verbable':false,
          'walkable':true,
          'name':'A thick wooded glade',
          'desc':'This glade is thick with trees, too thick to pass in the East. ',
          'exitN':true,
          'exitE':false,
          'exitS':true,
          'exitW':true,
          'castPresent':[

          ],
          'wasteland':false,
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        }
      ],
      [
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//trees.png',
          'verbable':false,
          'walkable':true,
          'name':'A thick wooded glade',
          'desc':'Trees abound in this glade, the forest gets a little thicker here, the tangle of flora on the ground a little rougher.',
          'exitN':true,
          'exitE':true,
          'exitS':false,
          'exitW':false,
          'castPresent':[

          ],
          'wasteland':false,
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//trees.png',
          'verbable':false,
          'walkable':true,
          'name':'A path in the woods',
          'desc':'A path splits and re-joins itself, looping about in messy arcs between tufts of grass and thick brambles. A dense deciduous canopy allows a little light in. ',
          'exitN':true,
          'exitE':true,
          'exitS':true,
          'exitW':true,
          'castPresent':[

          ],
          'wasteland':false,
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//trees.png',
          'verbable':false,
          'walkable':true,
          'name':'A thick wooded glade',
          'desc':'Trees abound in this glade, the forest gets a little thicker here, the tangle of flora on the ground a little rougher. This feels familiar, you could get lost in these woods too easily. ',
          'exitN':true,
          'exitE':false,
          'exitS':false,
          'exitW':true,
          'castPresent':[

          ],
          'wasteland':false,
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        }
      ],
      [
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//vertCoast.png',
          'verbable':false,
          'walkable':false,
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'name':'A street',
          'desc':'A cheerful cobbled street fades into a dirt path, leading into the woods. ',
          'exitN':true,
          'exitE':false,
          'exitS':true,
          'exitW':false,
          'castPresent':[

          ],
          'items':[

          ],
          'img':'/images/maps/tiles/grassPathNS.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'img':'/images/maps/tiles//vertCoast.png',
          'verbable':false,
          'walkable':false,
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        }
      ],
      [
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'name':'A cheerful home',
          'desc':'Wooden beams line the doorway into this tiny home. Itss a small space to live in, but clearly loved. A wooden chair painted white sits before a cast iron stove. Pots and pans hang from the ceiling above. A vertiginous stairway, barely more than a ladder, leads up to a sleeping space. ',
          'exitN':true,
          'exitE':true,
          'exitS':true,
          'exitW':true,
          'castPresent':[

          ],
          'items':[
            {
              'name':'White wooden chair',
              'desc':'A charming white painted wooden chair'
            },
            {
              'name':'Pot',
              'desc':'A heavy iron pot'
            },
            {
              'name':'Pan',
              'desc':'A heavy iron pan'
            },
            {
              'name':'Kettle',
              'desc':'A heavy old kettle'
            }
          ],
          'img':'/images/maps/tiles/houseWithRoof.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'name':'A village square',
          'desc':'A picturesque village square. Cheerfully lopsided wooden frame houses line the square, their roofs thatched and smoke belching occasionally forth from their chimneys. ',
          'exitN':true,
          'exitE':true,
          'exitS':true,
          'exitW':true,
          'castPresent':[

          ],
          'items':[

          ],
          'img':'/images/maps/tiles/grassPathNESW.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'name':'Mumss House',
          'desc':'Mumss house is small and warm and friendly, a great deal like mum herself. A range oven dominates the front room and the aroma of various confectionery items entices. A rough wooden table appears well worn, with an odd number of chairs arranged around it. ',
          'exitN':false,
          'exitE':true,
          'exitS':false,
          'exitW':true,
          'castPresent':[

          ],
          'items':[
            {
              'name':'A basket of cake',
              'desc':'A wicker basket filled with cake and other treats'
            },
            {
              'name':'A red riding hood',
              'desc':'A thick woolen riding hood, dyed red'
            },
            {
              'name':'A wooden table',
              'desc':'An old wooden table, rough hewn and well used'
            },
            {
              'name':'A chair',
              'desc':'A rickety wooden chair, in good repair'
            },
            {
              'name':'A chair',
              'desc':'A rickety wooden chair, in good repair'
            },
            {
              'name':'A chair',
              'desc':'A rickety wooden chair, in good repair'
            }
          ],
          'img':'/images/maps/tiles/houseWithRoof.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'name':'Mumss bedroom',
          'desc':'Mumss bedroom is colourful and orderly. The sheets are clean, the bed is single, the floors are free of dust or dirt. ',
          'exitN':false,
          'exitE':false,
          'exitS':false,
          'exitW':true,
          'castPresent':[

          ],
          'items':[

          ],
          'img':'/images/maps/tiles/houseWithRoof.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        }
      ],
      [
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'name':'A messy home',
          'desc':'One room makes up this whole house. Itss a claustrophobic space. People have lived, laughed, eaten and slept here. The sense of it all is overwhelming. People shed 8 pounds of skin a year you know. This home must be full of it. Itss also full of bedding, tables, cooking equipment and a stove. ',
          'exitN':false,
          'exitE':true,
          'exitS':false,
          'exitW':false,
          'castPresent':[

          ],
          'items':[

          ],
          'img':'/images/maps/tiles/houseWithRoof.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'name':'A Village Street',
          'desc':'The street is cobbled here, and ends in a cul de sac. ',
          'exitN':true,
          'exitE':true,
          'exitS':false,
          'exitW':true,
          'castPresent':[

          ],
          'items':[

          ],
          'img':'/images/maps/tiles/grassPathNEW.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'name':'A small home',
          'desc':'Thick with chaotic mess this room barely feels like part of a home, nonetheless someone lives here. A fireplace dominates but the room is filled with clutter, much of which seems to hold a potential for violent purpose. A dozen small animal carcasses are skinned and strung from a roof beam. ',
          'exitN':true,
          'exitE':true,
          'exitS':false,
          'exitW':true,
          'castPresent':[

          ],
          'items':[
            {
              'name':'Game Carcass',
              'desc':'The skinned carcass of a rabbit'
            },
            {
              'name':'Rope',
              'desc':'A heavy coiled rope'
            },
            {
              'name':'Skinning Knife',
              'desc':'A sharp curved knife for skinning animals'
            }
          ],
          'img':'/images/maps/tiles/houseWithRoofNoSouthWall.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'img':'/images/maps/tiles//vertCoast.png',
          'verbable':false,
          'walkable':false,
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        }
      ],
      [
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//vertCoast.png',
          'verbable':false,
          'walkable':false,
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//vertCoast.png',
          'verbable':false,
          'walkable':false,
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'name':'A storage room',
          'desc':'A small room is stacked with various bric-a-brac. Wooden crates, Bricks, Grain,  A mallet and wedge and much more besides.',
          'exitN':true,
          'exitE':false,
          'exitS':false,
          'exitW':false,
          'castPresent':[

          ],
          'items':[
            {
              'name':'Mallet',
              'desc':'A big heavy mallet'
            },
            {
              'name':'Iron Wedge',
              'desc':'An iron wedge for driving into logs to split them'
            }
          ],
          'img':'/images/maps/tiles/houseWithRoof.png',
          'verbable':false,
          'walkable':true,
          'wasteland':false
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        }
      ],
      [
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles//vertCoast.png',
          'verbable':false,
          'walkable':false,
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        },
        {
          'img':'/images/maps/tiles/water.png',
          'verbable':false,
          'walkable':false,
          'name':'water',
          'wasteland':true,
          'castPresent':[

          ],
          'items':[

          ]
        }
      ]
    ],

    '/maps/$/historymobile.js': [
      {
        "endTurn":true,
        "currentX":5,
        "currentY":10
      },
      {
        "who":"hero",
        "channel":"meta",
        "sendText":"Skip to Mum's house\n",
        "type":"action",
        "actions":30
      },
      {
        "who":"hero",
        "channel":"meta",
        "sendText":"Caryn wondered whether Mum was in - it had been almost a week since she saw her last, and she was looking forward to a nice cup of tea and a chinwag. \n",
        "type":"normal"
      },
      {
        "who":"hero",
        "channel":"meta",
        "sendText":"Standing in the cobbled streets of her childhood home Caryn's purple feet clipped the cobbles as she made her way to her mothers house. She rarely let much time at all pass in between excuses to sit and talk with her Mother. \n",
        "type":"normal"
      },
      {
        "endTurn":true,
        "currentX":5,
        "currentY":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "endTurn":true,
        "currentX":6,
        "currentY":10
      },
      {
        "createCast":true,
        "name": "The Amazing Spider-Man",
        "desc": "Does whatever a spider can",
        "type": "A Hero"
      },
      {
        "createItem":true,
        "name": "Spider-Man's mask",
        "desc": "Dude can't go out without it."
      },
      {
        "createEncounter": true,
        "name": "Some encounter",
        "desc": "You meet someone or whatever",
        "castPresentArray": ["The Amazing Spider-Man"],
        "itemsArray": ["Spider-Man's mask"],
        "chapterName": "A Red Riding Hood"
      },
      {
        "createChapter": true,
        "name": "The awesomest chapter",
        "desc": "In which the awesome stuff happens",
        "locationX": 10,
        "locationY": 10
      },
      {
        "createLocation": true,
        "name": "The emmerald of matrixness",
        "desc": "Activating the emmmerald will matrixify the world",
        "locationX": 1,
        "locationY": 1,
        "src": "gem.png",
        "castPresentArray": [],
        "itemsArray": ["Spider-Man's mask"]
      },
      {
        "placeStoryItem": true,
        "xTile": 5,
        "yTile": 6,
        "arrayPos": 0
      },
      {
        "placeMapItem": true,
        "xTile": 5,
        "yTile": 5,
        "arrayPos": 0
      },
      {
        "removeItem": true,
        "xTile": 5,
        "yTile": 5,
        "position": 1
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "who":"hero",
        "channel":"meta",
        "sendText":"Caryn glanced around the front room, but saw no sign of Mum. \n",
        "type":"normal"
      },
      {
        "who":"hero",
        "channel":"meta",
        "sendText":"\"Mum, are you in here?\" called Caryn. Hearing no reply, she made her way towards Mum's bedroom. \n",
        "type":"normal"
      },
      {
        "who":"hero",
        "channel":"meta",
        "sendText":"go to Mum's bedroom\n",
        "type":"action",
        "actions":20
      },
      {
        "endTurn":true,
        "currentX":6,
        "currentY":10
      },
      {
        "who":"god",
        "channel":"record",
        "sendText":"Letting herself in through the familiar old door Caryn looked around, taking in the sense of a familiar place. \n"
      },
      {
        "who":"god",
        "channel":"record",
        "sendText":"Mum, are you in here?\", she called. Before she could get to the bedroom door Mum came bustling out and was already engulfing Caryn in an embrace before she could register surprise. \n"
      },
      {
        "playEncounter":true,
        "chapterArrayPos":0,
        "encounterArrayPos":0
      },
      {
        "moveCast":true,
        "arrayPos":"0",
        "xTile":6,
        "yTile":10
      },
      {
        "moveCast":true,
        "arrayPos":1,
        "xTile":6,
        "yTile":10
      },
      {
        "removeCast":true,
        "arrayPos":1,
        "xTile":6,
        "yTile":10
      },
      {
        "endTurn":true,
        "currentX":6,
        "currentY":10
      },
      {
        "who":"hero",
        "channel":"meta",
        "sendText":"Caryn chuckled, pushing Mum away from her . \"What were you doing in the bedroom in the middle of the day? And why didn't you answer me when I called? I've so much to tell you, it's been ages since we last talked!\"\n",
        "type":"normal"
      },
      {
        "endTurn":true,
        "currentX":6,
        "currentY":10
      },
      {
        "who":"god",
        "channel":"record",
        "sendText":"Caryn chuckled, pushing Mum away from her . \"What were you doing in the bedroom in the middle of the day? And why didn't you answer me when I called? I've so much to tell you, it's been ages since we last talked!\" \n"
      },
      {
        "who":"god",
        "channel":"record",
        "sendText":"\"I know! I know!\" Mum moved around the room with the air of someone determined to distract themselves. \"I'm sorry Caryn dear you know I love our chats - and we do need to talk, it's your Gran again - you know how she is\". \n"
      },
      {
        "who":"god",
        "channel":"record",
        "sendText":"While she lifted this and brushed down that and the other That Cat dropped lazily into the room through the open window. Caryn remembered it with all the affection spared for a childhood rival; small and fluffy. White, adorable, eyes as black and cold as gimlets, heart as great and empty as space. \n"
      },
      {
        "endTurn":true,
        "currentX":6,
        "currentY":10
      },
      {
        "who":"hero",
        "channel":"meta",
        "sendText":"Caryn all-but-leaped at the startling smell of That Cat. \"Oh, Mum!\" she yelped \"That bloody thing stinks again!\" \n",
        "type":"normal"
      },
      {
        "who":"hero",
        "channel":"meta",
        "sendText":"Without further ado, Caryn kicked That Cat back out of the window. \"There, that's much better\" she told Mum. \"Now then, how about we have something to eat, and you can tell me all about Gran. I must go and visit her, I haven't seen her in months.\" \n",
        "type":"normal"
      },
      {
        "who":"hero",
        "channel":"meta",
        "sendText":"Caryn all-but-leaped at the startling smell of That Cat. \"Oh, Mum!\" she yelped \"That bloody thing stinks again!\" \n",
        "type":"normal"
      },
      {
        "endTurn":true,
        "currentX":6,
        "currentY":10
      },
      {
        "who":"god",
        "channel":"record",
        "sendText":"Without further ado, Caryn kicked That Cat back out of the window. \"There, that's much better\" she told Mum. \"Now then, how about we have something to eat, and you can tell me all about Gran. I must go and visit her, I haven't seen her in months.\" \n"
      },
      {
        "who":"god",
        "channel":"record",
        "sendText":"While a particularly surprised looking cat nursed an injured sense of superiority, Caryn sat down to talk with her Mother. Mum had always been, well - Mum. To anyone. Even her own mother, once old age had started to set in a little. Much to her dismay Gran was having absolutely none of it, and the woman remained as proud, outspoken and distant from help as ever she had been. \n"
      },
      {
        "who":"god",
        "channel":"record",
        "sendText":"\"She's ill Caryn! Really this time. Really Really.\" Mum loaded another helping of cake onto the plate she had set out. \"someone needs to look after her! All the time as well - she can't keep living out there alone, it's no good\" \n"
      },
      {
        "endTurn":true,
        "currentX":6,
        "currentY":10
      },
      {
        "who":"hero",
        "channel":"meta",
        "sendText":"\"That's terrible\" replied Caryn, who genuinely felt awful at the merest thought of someone - anyone - in need of help. Without a moment's thought she asked Mum \"What can I do to help?\" \n",
        "type":"normal"
      },
      {
        "endTurn":true,
        "currentX":6,
        "currentY":10
      },
      {
        "completedObjective":true,
        "arrayPos":"0"
      },
      {
        "completedObjective":true,
        "arrayPos":"2"
      },
      {
        "who":"god",
        "channel":"record",
        "sendText":"\"That's terrible\" replied Caryn, who genuinely felt awful at the merest thought of someone - anyone - in need of help. Without a moment's thought she asked Mum \"What can I do to help?\" \n"
      },
      {
        "who":"god",
        "channel":"record",
        "sendText":"It had always been Caryn's way to help. She took to her Mum that way, and it had led her well enough so far in life. Now it led her to the path which led into the woods within which, ensconced in the privacy of bracken and shade, lived her Gran. She wore the place like a grand old coat - or it had always seemed so when Caryn was young. Now something seemed a little different - but perhaps that simply always came with time. \n"
      },
      {
        "moveChapter":true,
        "arrayPos":"1"
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":1,
        "yTile":1
      },
      {
        "giveItem":true,
        "data":{
          "name":"A basket of cake",
          "desc":"A wicker basket filled with cake and other treats"
        }
      },
      {
        "giveItem":true,
        "data":{
          "name":"A red riding hood",
          "desc":"A thick woolen riding hood, dyed red"
        }
      },
      {
        "removeItemFromInv": true,
        "position": 0
      },
      {
        "who":"god",
        "channel":"meta",
        "sendText":"Mum gave you a basket of cake, and a Red Riding hood to keep off the cold (she does worry about you) \n"
      },
      {
        "endTurn":true,
        "currentX":5,
        "currentY":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "who":"hero",
        "channel":"meta",
        "sendText":"Caryn didn't much like being alone in the forest: it was eerie. The trees seemed to speak among themselves as she walked past, striding a well-trodden route in the direction of Gran's cottage. \"Oh well,\" she told herself \"I've got to go and see Gran now, much though I'd love to just head home and eat my basket of cake... and I wonder what's in this letter Mum's given me - I hope it's nothing too serious, I don't think Gran needs any bad news with the condition she's in.\" \n",
        "type":"normal"
      },
      {
        "who":"hero",
        "channel":"meta",
        "sendText":"A noise deep in the woods made Caryn's hair stand on end. \"Oh dear. That gave me quite a start... Perhaps I'll just quicken up my pace a little, or maybe even skip. Yes, I shall skip, and that will make everything feel much more pleasant.\" \n",
        "type":"normal"
      },
      {
        "who":"hero",
        "channel":"meta",
        "sendText":"Caryn skipped to Gran's cottage \n",
        "type":"action",
        "actions":30
      },
      {
        "endTurn":true,
        "currentX":5,
        "currentY":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "endTurn":true,
        "currentX":5,
        "currentY":8
      },
      {
        "endTurn":true,
        "currentX":5,
        "currentY":8
      },
      {
        "endTurn":true,
        "currentX":5,
        "currentY":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "endTurn":true,
        "currentX":5,
        "currentY":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":6,
        "yTile":10
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      },
      {
        "moveCharHidden":true,
        "xTile":5,
        "yTile":8
      }
    ]
  };

  this.MockSync.data = data;
}).call(this)
;
(function() {
  var Faye = {};

  var Subscription = function() {
    var me = this;
    _.defer(function() {
      if (me._callback) me._callback();
    });
  };

  _.extend(Subscription.prototype, {
    callback: function(f) {
      this._callback = f;
    },

    errback: function() {}
  });

  var Publication = Subscription;

  Faye.Client = function() {};

  _.extend(Faye.Client.prototype, {
    subscribe: function(endpoint, callback) {
      return new Subscription();
    },
    
    publish: function(endpoint, message) {
      return new Publication();
    }
  });

  this.Faye = Faye;
}).call(this);
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
(function() {
  var forge = this.forge || (this.forge = {});

  var urlError = function() {
    throw new Error('A "url" property must be specified');
  };

  function getPath(url) {
    return url.replace(/^https?:\/\/(?:\w+(?::\w+)?@)?[a-z][\w.]+[a-z](?::\d+)?\//, "/");
  };

  forge.ajax = function(options) {
    var url = getPath(options.url) || urlError();

    // Replace numeric segments of the given
    // URL with "$", assuming they will always
    // be dynamic parts of the URL (e.g. an id)
    var urlMatcher = url.replace(/\/\d+([\/.]|$)/, '/$$$1');

    var result = MockSync.data[urlMatcher];

    if (result) {
      console.log('Mock forge.ajax:', options.type, url, '[OK]');

      if (_.isFunction(result)) {
        var params = _.map(url.match(/\d+(?=[\/.]|$)/g), Number);
        result = result.apply(null, params);
      }

      _.defer(options.success, result);
    } else {
      console.log('Mock forge.ajax:', options.type, url, '[FAIL]');
      options.error && _.defer(options.error);
    }

    return true;
  }
}).call(this);
(function() {
  var forge = this.forge || (this.forge = {});

  var apiResponses = {
    me: { email: 'tobeee@gmail.com' }
  };

  forge.facebook = {
    authorize: function(success, failure) {
      _.defer(success);
    },

    api: function(req, callback) {
      _.defer(callback, apiResponses[req]);
    }
  };
}).call(this);
(function() {
  var forge = this.forge || (this.forge = {});

  var dummyPurchase = {
    purchaseState: "PURCHASED"
  };

  var purchaseConfirm = function() {
    alert("Payment Confirm");
  };

  var listeners = [];

  forge.payments = {
    transactionReceived: {
      addListener: function(callback) {
        listeners.push(callback);
      }
    },

    purchaseProduct: function() {
      _.each(listeners, function(listener) {
        listener(dummyPurchase, purchaseConfirm);
      });
    }
  };
}).call(this);







