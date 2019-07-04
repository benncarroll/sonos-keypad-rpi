/* jshint esversion:6, asi:true */

const {
  DeviceDiscovery,
  Sonos
} = require('sonos')

DeviceDiscovery((device) => {
  // console.log('found device at ' + device.host)

  Promise.all([device.getName(), device.getVolume(), device.getCurrentState()])
    .then((values) => {
      console.log(` ┌───────────────────────────────┐
 │  ${((values[2] == 'playing') ? '🔊' : '🔇')}  ${values[0].toString().padEnd(25, ' ')}│
 │ ───────────────────────────── │
 │  Volume:  ${values[1].toString().padEnd(20, ' ')}│
 │  State:   ${values[2].toString().padEnd(20, ' ')}│
 └───────────────────────────────┘`);
    })
})

DeviceDiscovery().once('DeviceAvailable', (device) => {
  // get all groups
  // device.getAllGroups()
  //   .then(console.log)
})
