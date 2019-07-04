// top level is array for each button, if element in arr
// is another array then it will 'open' second menu.
// pressing a button on the keypad w/ buttons [0,1,2,3] will
// trigger its respective array element in `menus`
// when it reaches a function it will run.
// any other datatype will crash.
// no more elements per array than buttons provided
exports.menus = [
  // lights
  [
    function() {
      console.log('toggle main light');
    },
    function() {
      console.log('toggle lamp');
    },
    function() {
      console.log('toggle sam\'s light');
    },
    function() {
      console.log('toggle parents light');
    }
  ],
  // playlists
  [
    function() {
      console.log('play :) on speaker');
    },
    function() {
      console.log('play Oldies on speaker');
    },
    function() {
      console.log('play relative rarity on speaker');
    },
    function() {
      console.log('play something on speaker.');
    }
  ],
  // set fan speeds
  [
    function() {
      console.log('set fan 1');
    },
    function() {
      console.log('set fan 2');
    },
    function() {
      console.log('set fan 3');
    },
    function() {
      console.log('set fan off');
    }
  ],
  // sonos control
  [
    function() {
      console.log('dr + kitchen; ben\'s room');
    },
    function() {
      console.log('all together');
    },
    function() {
      console.log('all solo');
    },
    function() {
      console.log('pause all');
    }
  ]
];
