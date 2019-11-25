/* jshint esversion:6 */

const setDeviceChar = require('../homebridge.js').setChar;
const sonos = require('../sonos-interface.js');

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
      }, 300);
      sonos.say('Changing brightness.')
    },
    () => {
      setDeviceChar("Ben's Bedside Lamp", 'On', 'toggle');
      sonos.say('Toggling light.')
    },
    () => {
      setDeviceChar(["Ben's Room Light", "Ben's Room Fan"], 'On', true);
      sonos.say('Turning lights on.')
    },
    () => {
      setDeviceChar(["Ben's Room Light", "Ben's Room Fan"], 'On', false);
      sonos.say('Turning lights off.')
    }
  ],
  // playlists
  [
    () => {
      console.log('play Oldies on speaker');
      sonos.playSpotifyURI('spotify:playlist:7AiplnKGh73F3v5jjvX8Z4')
    },
    () => {
      console.log('play :) on speaker');
      sonos.playSpotifyURI('spotify:playlist:0m0v1WUyo2ynubEVMP8GRV')
    },
    () => {
      console.log('play relative rarity on speaker');
      sonos.playSpotifyURI('spotify:playlist:4AjPcEDETubOAoCFiyu9AR')
    },
    () => {
      console.log('play 80s rock on speaker');
      sonos.playSpotifyURI('spotify:playlist:37i9dQZF1DX1spT6G94GFC')
    }
  ],
  // set fan speeds
  [
    () => {
      setDeviceChar(["Fan", "Ben's Room Fan"], 'On', true);
      setDeviceChar(["Fan", "Ben's Room Fan"], 'RotationSpeed', 25);
      sonos.say('Fan to 25%')
    },
    () => {
      setDeviceChar(["Fan", "Ben's Room Fan"], 'On', true);
      setDeviceChar(["Fan", "Ben's Room Fan"], 'RotationSpeed', 50);
      sonos.say('Fan to 50%')
    },
    () => {
      setDeviceChar(["Fan", "Ben's Room Fan"], 'On', true);
      setDeviceChar(["Fan", "Ben's Room Fan"], 'RotationSpeed', 100);
      sonos.say('Fan to 100%')
    },
    () => {
      setDeviceChar(["Fan", "Ben's Room Fan"], 'On', false);
      setDeviceChar(["Fan", "Ben's Room Fan"], 'RotationSpeed', 0);
      sonos.say('Turning fan off.')
    }
  ],
  // sonos control
  undefined
];
