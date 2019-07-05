/* jshint esversion:6 */

const chalk = require('chalk');
require('./configs/general.js');

global.timeouts = []; //global timeout id arrays
global.setTimeout = function(code, number) {
  this.timeouts.push(setTimeout(code, number));
};
global.clearAllTimeouts = function() {
  for (var i = 0; i < this.timeouts.length; i++) {
    window.clearTimeout(this.timeouts[i]); // clear all the timeouts
  }
  this.timeouts = []; //empty the id array
};

// For todays date;
Date.prototype.today = function() {
  return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
};

// For the time now
Date.prototype.timeNow = function() {
  // return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
  return ((this.getHours() < 10) ? "0" : "") + ((this.getHours() > 12) ? (this.getHours() - 12) : this.getHours()) + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds() + ((this.getHours() > 12) ? ('PM') : 'AM');
};

exports.checkArrayLengths = function(array, max_length, current_depth = 0) {
  current_depth++;

  if (array.length > max_length) {
    exports.logError('Oversized array found at depth', current_depth, 'in utils.checkArrayLengths()');
    return false;
  }
  if (current_depth > 5) {
    exports.logError('Max. recurse depth reached in utils.checkArrayLengths()');
    return false;
  }

  for (var i = 0; i < array.length; i++) {
    if (Array.isArray(array[i])) {
      return exports.checkArrayLengths(array[i], max_length, current_depth);
    } else {
      if (typeof array[i] != 'function') {
        exports.logError('Non-function found in Menus array at at depth ' + current_depth.toString() + ':', array[i]);
        return false;
      }
    }
  }
  exports.logInfo('Menus array verified.');
};

function stringConcat(total, current) {
  return total.toString() + ' ' + current.toString();
}

function stringConcat2(total, current) {
  return total.toString() + ', ' + current.toString();
}


function logTimestamp() {
  var newDate = new Date();
  return newDate.today() + " " + newDate.timeNow();
}
exports.baseLog = function(prefix, args) {

  switch (prefix) {
    case 1:
      prefixText = chalk.black.bgRed('ERROR');
      break;
    case 2:
      prefixText = chalk.black.bgYellow('WARN');
      break;
    case 3:
      prefixText = chalk.black.bgCyan('CALL');
      break;
    case 0:
    default:
      prefixText = chalk.black.bgWhite('INFO');
      break;
  }

  message = Array.prototype.slice.call(args, 0).reduce(stringConcat, "");

  console.log(
    chalk.white(logTimestamp()),
    prefixText.toString().padEnd(27, ' '), // 27 from chalk color & bg padding (length 19)
    chalk.white(message));
};

exports.logInfo = function() {
  if (loggingConfig.infoEnabled) {
    exports.baseLog(0, arguments);
  }
};
exports.logError = function() {
  exports.baseLog(1, arguments);
  process.exit(1);
};
exports.logWarn = function() {
  if (loggingConfig.warningEnabled) {
    exports.baseLog(2, arguments);
  }
};
exports.logCall = function() {
  if (loggingConfig.callTracingEnabled) {
    exports.baseLog(3, arguments);
  }
};
exports.callLogger = function(name, args) {
  arr = Array.prototype.slice.call(args, 0).map(JSON.stringify).join(", ");
  exports.logCall(name + '(' + arr + ')');
};
