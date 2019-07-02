print()
import button_controller, utils as u

# gpio pins of buttons, minimum 2 buttons
button_pin_arr = [12, 13, 14, 15] # RPi.GPIO.BOARD based
pressed_state = 1

# if enabled menus will only be accessible after `lock_code`
# has been entered.
# if led_pin is defined then it will flash to signify unlocked
lock_code_enabled = True
lock_code = 1231 # 0-based
led_pin = None # RPi.GPIO.BOARD based not BCM

reverse_keypad = False # reverse mapping of buttons (0123 -> 3210)

# top level is array for each button, if element in arr
# is another array then it will 'open' second menu.
# pressing a button on the keypad w/ buttons [0,1,2,3] will
# trigger its respective array element in `menus`
# when it reaches a function it will run.
# any other datatype will crash.
# no more elements per array than buttons provided
menus = [
    
]

# verify menus arr
button_count = len(button_pin_arr)
if button_count <= 1:
    u.error('Not enough buttons provided. Minimum 2. Please provide GPIO pins in `button_pin_arr`.', 1)
    pass




print('suh')
