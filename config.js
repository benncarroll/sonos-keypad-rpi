/* jshint esversion:6 */

// gpio pins of buttons, minimum 2 buttons
button_pin_arr = [23, 22, 17, 18]; // RPi.GPIO.BCM based
pressed_state = 1;
buttons = [];

// if enabled menus will only be accessible after `lock_code`
// has been entered.
// if led_pin is defined then it will flash to signify unlocked
lock_code_enabled = true;
lock_code = "012312"; // 0-based
relock_timer = 10; // seconds

green_led_pin = undefined; // RPi.GPIO.BCM not board
red_led_pin = undefined;

reverse_keypad = false; // reverse mapping of buttons (0123 -> 3210)

// pretty self explanatory
loggingConfig = {
  callTracingEnabled: false,
  infoEnabled: true,
  successEnabled: true
}; //errors always on as only triggered when termination required

// top level is array for each button, if element in arr
// is another array then it will 'open' second menu.
// pressing a button on the keypad w/ buttons [0,1,2,3] will
// trigger its respective array element in `menus`
// when it reaches a function it will run.
// any other datatype will crash.
// no more elements per array than buttons provided
menus = [
  function() {
    console.log('toggle main light');
  },
  function() {
    console.log('toggle lamp');
  },
  function() {
    console.log('play :) on speaker');
  },
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
  ]
];
