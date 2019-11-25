/* jshint esversion:6, asi:true */

const request = require('request');
const config = require('./configs/sonos.json');

if (!config.enabled) {
  var f = function() {
    console.log('Sonos interface is disabled.');
  }
  exports.say = f;
  exports.playClip = f;
  exports.playSpotifyURI = f;
  return
}

exports.say = function(text, volume) {
  if (!volume) {
    volume = ""
  }
  request([config.address, config.speakerName, "say", text.toString(), "en-au", volume].join("/"))
}


exports.playClip = function(clipName, volume) {
  request([config.address, config.speakerName, "clip", clipName.toString(), volume].join("/"))
}


exports.playSpotifyURI = function(uri, shuffle = true, volume) {
  if (volume) {
    request([config.address, config.speakerName, "volume", volume].join("/"))
  }
  if (uri.includes('playlist')) {
    uri = 'spotify:user:' + uri
  }
  if (shuffle) {
    request([config.address, config.speakerName, "shuffle", "on"].join("/"))
  }
  request([config.address, config.speakerName, "spotify", "now", uri].join("/"))
}
