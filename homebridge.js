/* jshint esversion:6 */

const HapClient = require('@oznu/hap-client').HapClient,
  ServiceType = require('@oznu/hap-client').ServiceType;
const homebridge = require('./configs/homebridge.json');
const debounce = require('lodash.debounce');
const utils = require('./utils.js');

let serviceDict = {};
let services;
let hapReady = false;

function setupHAP() {
  utils.callLogger('setupHAP', arguments);
  hapClient = new HapClient(
    `http://${homebridge.address}:${homebridge.port}`,
    homebridge.pin
  );
  // initial load
  this.hapClient.getAllServices()
    .then(
      svs => {
        services = svs;
        hapReady = true;
        // svs.forEach(s => console.log('Device available:', s.serviceName + "-" + s.accessoryInformation.Name));
      }
    )
    .catch((e) => {
      if (e.statusCode === 401) {
        utils.logWarn(`Homebridge must be running in insecure mode to view and control accessories from this plugin.`);
      } else {
        utils.logWarn(`Failed load accessories from Homebridge: ${e.message}`);
      }
      return [];
    });
}

reloadServices = debounce(() => services.forEach(
  service => service.refreshCharacteristics()
), 1500);

exports.setChar = function(name, char, value) {
  utils.callLogger('setChar', arguments);
  if (!hapReady) {
    utils.logWarn('HAP not ready yet.');
    return;
  }

  if (Array.isArray(name)) {
    service = services.find(x => x.serviceName == name[0] && x.accessoryInformation.Name == name[1]);
  } else {
    service = services.find(x => x.serviceName == name);
  }

  if (loggingConfig.serviceDebug) {
    console.log(service);
  }

  char = service.serviceCharacteristics.find(x => x.type == char);
  if (value == 'toggle') {
    value = !char.value;
    char.value = value;
  }
  service.setCharacteristic(char.iid, value);

  reloadServices();
};

setupHAP();
