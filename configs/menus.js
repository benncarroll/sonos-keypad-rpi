/* jshint esversion:6 */

const setChar = require('../homebridge.js').setChar;

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
    () => {
      console.log('toggle main light');
    },
    () => {
      setChar("Ben's Bedside Lamp", 'On', 'toggle');
    },
    () => {
      setChar(["Ben's Room Light", "Ben's Room Fan"], 'On', true);
    },
    () => {
      setChar(["Ben's Room Light", "Ben's Room Fan"], 'On', false);
    }
  ],
  // playlists
  [
    () => {
      console.log('play :) on speaker');
    },
    () => {
      console.log('play Oldies on speaker');
    },
    () => {
      console.log('play relative rarity on speaker');
    },
    () => {
      console.log('play something on speaker.');
    }
  ],
  // set fan speeds
  [
    () => {
      console.log('set fan 1');
    },
    () => {
      console.log('set fan 2');
    },
    () => {
      console.log('set fan 3');
    },
    () => {
      console.log('set fan off');
    }
  ],
  // sonos control
  [
    () => {
      console.log('dr + kitchen; ben\'s room');
    },
    () => {
      console.log('all together');
    },
    () => {
      console.log('all solo');
    },
    () => {
      console.log('pause all');
    }
  ]
];
