/* jshint esversion:6 */

// gpio pins of buttons, minimum 2 buttons
button_pin_arr = [23, 22, 17, 18]; // RPi.GPIO.BCM based
pressed_state = 1;
buttons = [];

// if enabled menus will only be accessible after `lock_code`
// has been entered.
// if led_pin is defined then it will flash to signify unlocked
lock_code_enabled = true;
lock_code = "1212"; // 0-based
relock_timer = 10; // seconds

green_led_pin = 24; // RPi.GPIO.BCM not board
red_led_pin = 27;

reverse_keypad = false; // reverse mapping of buttons (0123 -> 3210)

// pretty self explanatory
loggingConfig = {
  callTracingEnabled: false,
  infoEnabled: true,
  successEnabled: true
}; //errors always on as only triggered when termination required
