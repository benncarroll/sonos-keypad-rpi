/* jshint esversion:6 */

const Gpio = require('onoff').Gpio;
const debounce = require('lodash.debounce');
const throttle = require('lodash.throttle');
const utils = require('./utils.js');
const menus = require('./configs/menus.js').menus;
require('./configs/general.js');


unlocked = false;
current_code = '';
current_menu = menus;

button_count = button_pin_arr.length;

button_process_queue = [];

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

function processButtonQueue() {
  utils.callLogger('processButtonQueue', arguments);

  if (button_process_queue.length == 0) {
    return;
  }

  value = button_process_queue.shift();

  if (reverse_keypad) {
    value = button_count - 1 - value;
  }

  if (lock_code_enabled) {
    if (!unlocked) {
      current_code += value.toString();
      if (current_code == lock_code) {
        utils.logInfo('Keypad unlocked.');
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
    ledController('green', 1, 100); //short flash for entering menu
  } else if (typeof current_menu[value] == 'function') {
    current_menu[value]();
    utils.logInfo('Executed action in pos', value);
    current_menu = menus;
    utils.logInfo('Returned to main menu.\n');

    ledController('green', 1, 200); //long flash for executing action
  } else {
    current_menu = menus;
    ledController('red', 1, 200); //long flash for unidentified func
  }

  if (button_process_queue.length > 0) {
    processButtonQueue();
  }
}
processQueue = throttle(processButtonQueue, 50);

liftMenuLevel = debounce(() => {
  utils.logCall('liftMenuLevel', arguments);
  utils.logInfo('Gave up, returned to main menu.\n');
  current_menu = menus;
}, 1000);

function buttonPress(value) {
  utils.callLogger('buttonPress', arguments);

  liftMenuLevel();
  inactivityLock();

  button_process_queue.push(value);
  processQueue();
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
