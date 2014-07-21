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

  var data = function(id) {
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
  };
  
  this.MockSync.data['/maps/$/storydata.js'] = data;
}).call(this);
