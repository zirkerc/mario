interface Input {
    update(): void;
    isDown(key: string): boolean;
    reset(): void;
}

interface GamepadAPI {
    turbo: boolean;
    controllerIndex: number;
    controller?: Gamepad;
    axesStatus: number[];
    buttonsCache: string[];
    buttonsStatus: string[];
    buttons: Record<number, string>;
    connect(evt: { gamepad: Gamepad }): void;
    disconnect(): void;
    update(): void;
    buttonPressed(key: string, hold: boolean): boolean;

}
(function () {
    var pressedKeys: Record<string, boolean> = {};
    var pressedButtons: Record<string, boolean> = {};

    function setKey(event: KeyboardEvent, status: boolean) {
        var code = event.keyCode;
        var key;
        switch (code) {
            case 65: // A
            case 37: // LeftArrow
                key = 'LEFT'; break;

            case 87: // W
            case 38:// UpArrow
                key = 'UP'; break;

            case 68: // D
            case 39: // RightArrow
                key = 'RIGHT'; break;

            case 83: // S
            case 40: // DownArrow
                key = 'DOWN'; break;

            case 32: // Space
            //key = 'SPACE'; break;
            case 88: // X
                key = 'JUMP'; break;

            case 16: // LeftShift
            case 90: // Z
                key = 'RUN'; break;
            default:
                key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function (e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function (e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function () {
        pressedKeys = {};
        pressedButtons = {};
    });

    window["input"] = {
        isDown: function (key) {
            //console.log(key, pressedKeys[key.toUpperCase()], pressedButtons[key.toUpperCase()], pressedKeys[key.toUpperCase()] || pressedButtons[key.toUpperCase()])
            return pressedKeys[key.toUpperCase()] || pressedButtons[key.toUpperCase()];
        },
        reset: function () {
            pressedKeys['RUN'] = false;
            pressedKeys['LEFT'] = false;
            pressedKeys['RIGHT'] = false;
            pressedKeys['DOWN'] = false;
            pressedKeys['JUMP'] = false;
        },
        update: function () {
            gamepadAPI.update();

            if (gamepadAPI.controller) {
                pressedButtons['RUN'] = gamepadAPI.buttonPressed("X", true) || gamepadAPI.buttonPressed("LeftTrigger", true);
                pressedButtons['JUMP'] = gamepadAPI.buttonPressed("A", true);

                pressedButtons['LEFT'] = gamepadAPI.buttonPressed("DPad-Left", true) || gamepadAPI.axesStatus[0] < -0.5;
                pressedButtons['RIGHT'] = gamepadAPI.buttonPressed("DPad-Right", true) || gamepadAPI.axesStatus[0] > 0.5;
                pressedButtons['DOWN'] = gamepadAPI.buttonPressed("DPad-Down", true) || gamepadAPI.axesStatus[1] > 0.5;
                pressedButtons['UP'] = gamepadAPI.buttonPressed("DPad-Up", true) || gamepadAPI.axesStatus[1] < -0.5;
            }
        }

    };

    const gamepadAPI: GamepadAPI = {
        controllerIndex: -1,
        turbo: false,
        connect(evt: { gamepad: Gamepad }) {
            gamepadAPI.controllerIndex = evt.gamepad.index;
            gamepadAPI.turbo = true;
            console.log('Gamepad connected.');
        },
        disconnect() {

            gamepadAPI.turbo = false;
            //delete gamepadAPI.controller;
            gamepadAPI.controllerIndex = -1;
            console.log('Gamepad disconnected.');
        },
        update() {
            if (gamepadAPI.controllerIndex == -1) {
                return;
            }
            gamepadAPI.controller = navigator.getGamepads()[gamepadAPI.controllerIndex];
            // Clear the buttons cache
            gamepadAPI.buttonsCache = [];

            // Move the buttons status from the previous frame to the cache
            for (let k = 0; k < gamepadAPI.buttonsStatus.length; k++) {
                gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
            }

            // Clear the buttons status
            gamepadAPI.buttonsStatus = [];

            // Get the gamepad object
            const c = gamepadAPI.controller;

            // Loop through buttons and push the pressed ones to the array
            const pressed = [];
            const btns = [];
            if (c?.buttons) {
                for (let b = 0; b < c.buttons.length; b++) {
                    //console.log("PRESSED:", b, c.buttons[b].pressed);
                    if (c.buttons[b].pressed) {
                        btns.push(b);
                        pressed.push(gamepadAPI.buttons[b]);
                    }
                }
            }

            // Loop through axes and push their values to the array
            const axes = [];
            if (c.axes) {
                for (let a = 0; a < c.axes.length; a++) {
                    axes.push(c.axes[a]);
                }
            }

            // Assign received values
            gamepadAPI.axesStatus = axes;
            gamepadAPI.buttonsStatus = pressed;

            // Return buttons for debugging purposes
            //pressed.length && console.log(pressed, axes)
            return pressed;
        },
        buttonPressed(button, hold) {
            let newPress = false;

            // Loop through pressed buttons
            for (let i = 0; i < gamepadAPI.buttonsStatus.length; i++) {
                // If we found the button we're looking for
                if (gamepadAPI.buttonsStatus[i] === button) {
                    // Set the boolean variable to true
                    newPress = true;

                    // If we want to check the single press
                    if (!hold) {
                        // Loop through the cached states from the previous frame
                        for (let j = 0; j < gamepadAPI.buttonsCache.length; j++) {
                            // If the button was already pressed, ignore new press
                            newPress = (gamepadAPI.buttonsCache[j] !== button);
                        }
                    }
                }
            }
            return newPress;
        },
        buttons: {
            0: "A",
            1: "B",
            2: "X",
            3: "Y",
            4: "LB",
            5: "RB",
            6: "LeftTrigger",
            7: "RightTrigger",
            8: "Back",
            9: "Start",
            10: "LeftStick",
            11: "RightStick",
            12: "DPad-Up",
            13: "DPad-Down",
            14: "DPad-Left",
            15: "DPad-Right"
        },
        buttonsCache: [],
        buttonsStatus: [],
        axesStatus: [],
    };
    window.addEventListener("gamepadconnected", gamepadAPI.connect);
    window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);

    window["gamepadAPI"] = gamepadAPI;
})();
