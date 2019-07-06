/* jshint esversion:6 */

const setDeviceChar = require('../homebridge.js').setChar;

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
      setDeviceChar("Ben's Bedside Lamp", 'On', false);
      setTimeout(function() {
        setDeviceChar("Ben's Bedside Lamp", 'On', true);
      }, 200);
    },
    () => {
      setDeviceChar("Ben's Bedside Lamp", 'On', 'toggle');
    },
    () => {
      setDeviceChar(["Ben's Room Light", "Ben's Room Fan"], 'On', true);
    },
    () => {
      setDeviceChar(["Ben's Room Light", "Ben's Room Fan"], 'On', false);
    }
  ],
  // playlists
  [
    () => {
      console.log('play Oldies on speaker');
    },
    () => {
      console.log('play :) on speaker');
    },
    () => {
      console.log('play relative rarity on speaker');
    },
    undefined
  ],
  // set fan speeds
  [
    () => {
      setDeviceChar(["Fan", "Ben's Room Fan"], 'On', true);
      setDeviceChar(["Fan", "Ben's Room Fan"], 'RotationSpeed', 25);
    },
    () => {
      setDeviceChar(["Fan", "Ben's Room Fan"], 'On', true);
      setDeviceChar(["Fan", "Ben's Room Fan"], 'RotationSpeed', 50);
    },
    () => {
      setDeviceChar(["Fan", "Ben's Room Fan"], 'On', true);
      setDeviceChar(["Fan", "Ben's Room Fan"], 'RotationSpeed', 100);
    },
    () => {
      setDeviceChar(["Fan", "Ben's Room Fan"], 'On', false);
    }
  ],
  // sonos control
  undefined
];
