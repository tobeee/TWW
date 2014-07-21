(function() {
  var mapTileDefaults = {
    img:         'Sea_Tile_Top_R',
    verbable:    false,
    walkable:    false,
    name:        'Water',
    desc:        '',
    wasteland:   true,
    exitN:       false,
    exitE:       false,
    exitS:       false,
    exitW:       false,
    castPresent: [],
    items:       []
  };

  var data = [
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [
      {}, {}, {}, {}, {},
      {
        img: 'Grass_01',
        walkable: true,
        wasteland: false,
        name: 'A Wolfss Belly',
        desc: 'As a space to inhabit this leaves something to be desired. Theress not much latitude for movement, nor a great deal of air to breath. The various eukaryotic denizens of a Wolfss stomach pay you little mind, so at least the neighbours arenst a nuisance. ',
        items: [
          {
            name: 'Intestines',
            desc: 'Bloody guts, everwhere.'
          },
          {
            name: 'Stomach Acid',
            desc: 'That tingling feeling is probably just enzymes slowly devouring your body'
          }
        ],
      },
      {}, {}, {}, {}, {}, {}
    ],
    [
      {}, {}, {}, {}, {}, { img: 'Seacliff_EDGE_S' }, {}, {}, {}, {}, {}, {}
    ],
    [
      {}, {}, {}, {}, {},
      {
        img: 'Building_Cottage',
        name: 'Grannyss bedroom',
        desc: 'Grannyss bedroom is dim, as would befit a convalescing woman. The curtains are closed and the lamps are snuffed. The bed is a grand old affair with four posters. Though the awnings are drawn back the voluminous blankets and quilts conceal the interior well. ',
        exitS: true,
        walkable: true,
        wasteland: false
      },
      {}, {}, {}, {}, {}, {}
    ],
    [
      {}, {}, {}, {},
      {
        img: 'Farm_Wheat',
        name: 'A clearing',
        desc: 'A grassy field with thick hedges blocking off ways but the one by which you came',
        exitS: true,
        verbable: false,
        walkable: true,
        wasteland: false
      },
      {
        img: 'Building_Cottage',
        name: 'Grannyss house',
        desc: 'Grannyss house is small and quaint, there is a table here and cabinets line the walls. A sill seems perfectly placed for the cooling of delicious pies. An open door offers a view into the bedroom, and a closed one hints at the yard to the East. ',
        exitN: true,
        exitE: true,
        exitS: true,
        verbable: false,
        walkable: true,
        wasteland: false
      },
      {
        img: 'Building_Stable',
        name: 'A Yard',
        desc: 'A yard is filled with cut wood and mysteriously, chicken feed. There are no chickens. ',
        exitN: true,
        exitS: true,
        verbable: false,
        walkable: true,
        wasteland: false
      },
      {}, {}, {}, {}, {}
    ],
    [
      {}, {}, {}, {},
      {
        img: 'Grass_02',
        name: 'A clearing',
        desc: 'A grassy clearing.',
        verbable: false,
        walkable: true,
        exitN: true,
        exitE: true,
        wasteland: false
      },
      {
        img: 'Grass_03',
        verbable: false,
        walkable: true,
        name: 'A Clearing',
        desc: 'The woods opens out into a grassy clearing. Grannyss cottage is ahead, a cheerful sight for sure with a bright red door adorned with black iron handles and bars. ',
        exitN: true,
        exitE: true,
        exitS: true,
        exitW: true,
        castPresent: [
          {name: "Batman", desc: "The Dark Knight", archtype: "A Friend"},
          {name: "Jesus", desc: "The Savior", archtype: "A Friend"}
        ],
        wasteland: false,
        items: [
          {name: "The Necronomicon", desc: "A merry children's book"},
          {name: "A Jar of Primordial Goo", desc: "The escence of life"}
        ]
      },
      {
        img: 'Boulder_Field',
        name: 'A clearing',
        desc: 'A sunny grassy clearing, warm soft earth gives beneath your steps',
        exitN: true,
        exitW: true,
        verbable: false,
        walkable: true,
        wasteland: false
      },
      {}, {}, {}, {}, {}
    ],
    [
      {}, {}, {}, {img: 'Seacliff_2CRNR_W'}, { img: 'Seacliff_TERM_E' },
      {
        img: 'Forest_broadleaf_01',
        verbable: false,
        walkable: true,
        name: 'A path in the woods',
        desc: 'A path runs through the woods, the canopy is starting to thin a little. To the north you can see the bright light of day. ',
        exitN: true,
        exitE: true,
        exitS: true,
        wasteland: false
      },
      {
        img: 'Grass_01',
        verbable: false,
        walkable: true,
        name: 'An opening in the trees ',
        desc: 'The trees open into a field, a picket fence bounds the grassy enclosure. ',
        exitS: true,
        exitW: true,
        wasteland: false
      },
      {}, {}, {}, {}, {}
    ],
    [
      {}, {}, {}, {img: 'Seacliff_EDGE_W'},
      {
        img: 'Lake',
        verbable: false,
        walkable: true,
        name: 'A Clearing in the woods',
        desc: 'A graceful willow overlooks the lake in this clearing. Reeds line the banks.',
        exitE: true,
        exitS: true,
        wasteland: false
      },
      {
        img: 'Forest_Pine',
        verbable: false,
        walkable: true,
        name: 'A path in the woods',
        desc: 'A path runs through the woods, sometimes clear sometimes fading beneath a messy growth of hedge or bramble. A dense deciduous canopy allows a little light in. ',
        exitN: true,
        exitE: true,
        exitS: true,
        exitW: true,
        wasteland: false
      },
      {
        img: 'Forest_broadleaf_01',
        verbable: false,
        walkable: true,
        name: 'A thick wooded glade',
        desc: 'This glade is thick with trees, too thick to pass in the East. ',
        exitN: true,
        exitS: true,
        exitW: true,
        wasteland: false
      },
      {}, {}, {}, {}, {}
    ],
    [
      {}, {}, {}, {img: 'Seacliff_EDGE_W'},
      {
        img: 'Forest_broadleaf_01',
        verbable: false,
        walkable: true,
        name: 'A thick wooded glade',
        desc: 'Trees abound in this glade, the forest gets a little thicker here, the tangle of flora on the ground a little rougher.',
        exitN: true,
        exitE: true,
        wasteland: false
      },
      {
        img: 'Forest_Pine',
        verbable: false,
        walkable: true,
        name: 'A path in the woods',
        desc: 'A path splits and re-joins itself, looping about in messy arcs between tufts of grass and thick brambles. A dense deciduous canopy allows a little light in. ',
        exitN: true,
        exitE: true,
        exitS: true,
        exitW: true,
        wasteland: false
      },
      {
        img: 'Forest_broadleaf_01',
        verbable: false,
        walkable: true,
        name: 'A thick wooded glade',
        desc: 'Trees abound in this glade, the forest gets a little thicker here, the tangle of flora on the ground a little rougher. This feels familiar, you could get lost in these woods too easily. ',
        exitN: true,
        exitW: true,
        wasteland: false
      },
      {}, {}, {}, {}, {}
    ],
    [
      {}, {}, {}, {img: 'Seacliff_2CRNR_W'}, { img: 'Seacliff_TERM_E' },
      {
        img: 'Path_North_South',
        name: 'A street',
        desc: 'A cheerful cobbled street fades into a dirt path, leading into the woods. ',
        exitN: true,
        exitS: true,
        verbable: false,
        walkable: true,
        wasteland: false
      },
      { img: 'Seacliff_TERM_W' },
      {}, {}, {}, {}, {}
    ],
    [
      {}, {}, {}, {img: 'Seacliff_EDGE_W'},
      {
        img: 'Building_Cottage',
        name: 'A cheerful home',
        desc: 'Wooden beams line the doorway into this tiny home. Itss a small space to live in, but clearly loved. A wooden chair painted white sits before a cast iron stove. Pots and pans hang from the ceiling above. A vertiginous stairway, barely more than a ladder, leads up to a sleeping space. ',
        exitN: true,
        exitE: true,
        exitS: true,
        exitW: true,
        items: [
          {
            name: 'White wooden chair',
            desc: 'A charming white painted wooden chair'
          },
          {
            name: 'Pot',
            desc: 'A heavy iron pot'
          },
          {
            name: 'Pan',
            desc: 'A heavy iron pan'
          },
          {
            name: 'Kettle',
            desc: 'A heavy old kettle'
          }
        ],
        verbable: false,
        walkable: true,
        wasteland: false
      },
      {
        img: 'Path_North_South_East_West',
        name: 'A village square',
        desc: 'A picturesque village square. Cheerfully lopsided wooden frame houses line the square, their roofs thatched and smoke belching occasionally forth from their chimneys. ',
        exitN: true,
        exitE: true,
        exitS: true,
        exitW: true,
        verbable: false,
        walkable: true,
        wasteland: false
      },
      {
        img: 'Building_Cottage',
        verbable: false,
        walkable: true,
        wasteland: false,
        name: 'Mumss House',
        desc: 'Mumss house is small and warm and friendly, a great deal like mum herself. A range oven dominates the front room and the aroma of various confectionery items entices. A rough wooden table appears well worn, with an odd number of chairs arranged around it. ',
        exitE: true,
        exitW: true,
        items: [
          {
            name: 'A basket of cake',
            desc: 'A wicker basket filled with cake and other treats'
          },
          {
            name: 'A red riding hood',
            desc: 'A thick woolen riding hood, dyed red'
          },
          {
            name: 'A wooden table',
            desc: 'An old wooden table, rough hewn and well used'
          },
          {
            name: 'A chair',
            desc: 'A rickety wooden chair, in good repair'
          },
          {
            name: 'A chair',
            desc: 'A rickety wooden chair, in good repair'
          },
          {
            name: 'A chair',
            desc: 'A rickety wooden chair, in good repair'
          }
        ],
      },
      {
        img: 'Building_Cottage',
        name: 'Mumss bedroom',
        desc: 'Mumss bedroom is colourful and orderly. The sheets are clean, the bed is single, the floors are free of dust or dirt. ',
        exitW: true,
        verbable: false,
        walkable: true,
        wasteland: false
      },
      {}, {}, {}, {}
    ],
    [
      {}, {}, {}, {img: 'Seacliff_EDGE_W'},
      {
        img: 'Building_Cottage',
        name: 'A messy home',
        desc: 'One room makes up this whole house. Itss a claustrophobic space. People have lived, laughed, eaten and slept here. The sense of it all is overwhelming. People shed 8 pounds of skin a year you know. This home must be full of it. Itss also full of bedding, tables, cooking equipment and a stove. ',
        exitN: false,
        exitE: true,
        verbable: false,
        walkable: true,
        wasteland: false
      },
      {
        img: 'Path_West_East_North',
        name: 'A Village Street',
        desc: 'The street is cobbled here, and ends in a cul de sac. ',
        exitN: true,
        exitE: true,
        exitW: true,
        verbable: false,
        walkable: true,
        wasteland: false
      },
      {
        img: 'Building_Cottage',
        name: 'A small home',
        desc: 'Thick with chaotic mess this room barely feels like part of a home, nonetheless someone lives here. A fireplace dominates but the room is filled with clutter, much of which seems to hold a potential for violent purpose. A dozen small animal carcasses are skinned and strung from a roof beam. ',
        exitN: true,
        exitE: true,
        exitW: true,
        items: [
          {
            name: 'Game Carcass',
            desc: 'The skinned carcass of a rabbit'
          },
          {
            name: 'Rope',
            desc: 'A heavy coiled rope'
          },
          {
            name: 'Skinning Knife',
            desc: 'A sharp curved knife for skinning animals'
          }
        ],
        verbable: false,
        walkable: true,
        wasteland: false
      }, { img: 'Seacliff_EDGE_S' }, {}, {}, {}, {}
    ],
    [
      {}, {}, {}, {img: 'Seacliff_CRNR_SW'}, { img: 'Seacliff_EDGE_S' }, { img: 'Seacliff_ELBOW_SW' },
      {
        img: 'Building_Cottage',
        name: 'A storage room',
        desc: 'A small room is stacked with various bric-a-brac. Wooden crates, Bricks, Grain,  A mallet and wedge and much more besides.',
        exitN: true,
        items: [
          {
            name: 'Mallet',
            desc: 'A big heavy mallet'
          },
          {
            name: 'Iron Wedge',
            desc: 'An iron wedge for driving into logs to split them'
          }
        ],
        verbable: false,
        walkable: true,
        wasteland: false
      },
      {}, {}, {}, {}, {}
    ],
    [
      {}, {}, {}, {}, {}, {img: 'Seacliff_CRNR_SW'}, { img: 'Seacliff_EDGE_S' },
      {}, {}, {}, {}, {}
    ]
  ];

  _.each(data, function(row) {
    _.each(row, function(tile) {
      _.defaults(tile, mapTileDefaults);
    });
  });

  this.MockSync.data['/maps/$/mapdata.js'] = data;
}).call(this);
