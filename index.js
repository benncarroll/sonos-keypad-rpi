/* jshint esversion:6 */

console.log('import onoff...');
const Gpio = require('onoff').Gpio;
console.log('import debounce...');
var debounce = require('lodash.debounce');
console.log('import utils...');
const utils = require('./utils.js');
console.log('import config...\n');
require('./config.js');

unlocked = false;
current_code = '';
current_menu = menus;

button_count = button_pin_arr.length;


// setup LEDs
redLed = (Gpio.accessible && red_led_pin != undefined) ? new Gpio(red_led_pin, 'out') : undefined;
greenLed = (Gpio.accessible && green_led_pin != undefined) ? new Gpio(green_led_pin, 'out') : undefined;

// verify menus arr
if (button_count <= 1) {
  utils.logError('Not enough buttons provided. Minimum 2. Please provide GPIO pins in `button_pin_arr`.');
} else {
  utils.checkArrayLengths(menus, button_count);
}

function ledController(colour, times, length = 200, wait = undefined) {
  utils.callLogger('ledController', arguments);
  switch (colour) {
    case 'red':
      if (!redLed) {
        return;
      }
      break;
    case 'green':
      if (!greenLed) {
        return;
      }
      break;
    default:
      return;
  }

  led = {
    'green': greenLed,
    'red': redLed
  } [colour];

  if (wait == undefined) {
    wait = length * 1.5;
  }

  const blinkLed = () => {
    led.write(1, err => { // Asynchronous write
      if (err) {
        throw err;
      }
      setTimeout(function() {
        led.write(0, err => { // Asynchronous write
          if (err) {
            throw err;
          }
        });
      }, length);
    });
  };

  for (var i = 0; i < times; i++) {
    setTimeout(function() {
      blinkLed();
    }, i * wait);
  }
}

function lockKeypad(do_lock_light = true, extra_message = undefined) {
  utils.callLogger('lockKeypad', arguments);

  if (unlocked) {
    if (extra_message) {
      utils.logInfo(extra_message, 'Keypad locked.');
    } else {
      utils.logInfo('Keypad locked.');
    }

    if (do_lock_light) {
      ledController('red', 1, 1000);
    }
    unlocked = false;
  }
  current_code = '';
}
inactivityLock = debounce(lockKeypad, relock_timer * 1000);

function buttonPress(value) {
  utils.callLogger('buttonPress', arguments);

  if (lock_code_enabled) {
    if (!unlocked) {
      current_code += value.toString();
      if (current_code == lock_code) {
        utils.logSuccess('Keypad unlocked.');
        unlocked = true;
        ledController('green', 2, 200);
      } else if (current_code.length >= lock_code.length) {
        ledController('red', 2, 200);
        lockKeypad(false, 'Incorrect Code.');
      }

      inactivityLock();
      return;
    }
  }

  if (Array.isArray(current_menu[value])) {
    current_menu = menus[value];
    utils.logInfo('Entered sub-menu in pos', value);
  } else {
    current_menu[value]();
    utils.logInfo('Executed action in pos', value);
    current_menu = menus;
    utils.logInfo('Returned to main menu.\n');
  }
  ledController('green', 1, 200);

  inactivityLock();
}

function regButton(pin, index) {
  utils.callLogger('regButton', arguments);
  if (Gpio.accessible) {
    button = new Gpio(pin, 'in', 'rising', {
      debounceTimeout: 10
    });
  } else {
    button = {
      pin: pin,
      index: index,
      enabled: false,
      watch(callback) {
        value = 1;
        setInterval(function() {
          if (buttons[index].enabled) {
            callback(undefined, value);
          }
        }, 200).unref();
      },
      unexport() {
        utils.logInfo('Button', index, 'unloaded.');
      }
    };
  }

  buttons.push(button);
  buttons[index].watch((err, value) => {
    if (err) {
      throw err;
    }
    buttonPress(index);
  });
}

// begin button listeners
button_pin_arr.map(regButton);
setTimeout(function() {
  console.log('binding function ended');
}, 10000);

process.on('SIGINT', () => {
  console.log(' - Ending process.');
  global.clearAllTimeouts();
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].unexport();
  }
});

utils.logInfo('Ready!');
ledController('green', 3, 200);
