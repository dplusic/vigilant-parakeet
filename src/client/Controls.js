import EventEmitter from 'eventemitter3';

// based on http://keycode.info/

/**
 * This class allows easy usage of device keyboard controls
 */
class Controls {

    constructor(clientEngine) {
        Object.assign(this, EventEmitter.prototype);
        this.clientEngine = clientEngine;
        this.gameEngine = clientEngine.gameEngine;

        this.setupListeners();

        this.orientation = null;

        this.gameEngine.on('client__preStep', () => {
            if (this.orientation) {
                this.clientEngine.sendInput('move', this.orientation);
            }
        });
    }

    setupListeners() {

        document.addEventListener('mousemove', (e) => {
            const orientation = { x: e.clientX - document.body.clientWidth / 2, y: e.clientY - document.body.clientHeight / 2 };
            if (orientation.x === 0 && orientation.y === 0) {
                return;
            }
            this.orientation = orientation;
        });
    }

}

export default Controls;
