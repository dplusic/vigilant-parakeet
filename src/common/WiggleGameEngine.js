import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import TwoVector from 'lance/serialize/TwoVector';
import Wiggle from './Wiggle';
import Food from './Food';

export default class WiggleGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });
        this.on('preStep', this.moveAll.bind(this));

        // game variables
        Object.assign(this, {
            foodRadius: 0.1, headRadius: 0.2, bodyRadius: 0.1,
            spaceWidth: 32, spaceHeight: 18, moveDist: 0.04,
            foodCount: 0, eatDistance: 0.3, collideDistance: 0.3,
            startBodyLength: 0
        });
    }

    registerClasses(serializer) {
        serializer.registerClass(Wiggle);
        serializer.registerClass(Food);
    }

    start() {
        super.start();
    }

    randPos() {
        let x = (Math.random() - 0.5) * this.spaceWidth;
        let y = (Math.random() - 0.5) * this.spaceHeight;
        return new TwoVector(x, y);
    }

    moveAll(stepInfo) {

        if (stepInfo.isReenact)
            return;

        this.world.forEachObject((id, obj) => {
            if (obj instanceof Wiggle) {

                if (obj.orientation) {
                    obj.position.x += obj.orientation.x * this.moveDist;
                    obj.position.y += obj.orientation.y * this.moveDist;
                } else {
                    obj.position.y += this.moveDist;
                }

                let onBorderX = false;
                let onBorderY = false;

                if (obj.position.y > this.spaceHeight / 2) {
                    obj.position.y = this.spaceHeight / 2;
                    onBorderY = true;
                }
                if (obj.position.x > this.spaceWidth / 2) {
                    obj.position.x = this.spaceWidth / 2;
                    onBorderX = true;
                }
                if (obj.position.y < -this.spaceHeight / 2) {
                    obj.position.y = -this.spaceHeight / 2;
                    onBorderY = true;
                }
                if (obj.position.x < -this.spaceWidth / 2) {
                    obj.position.x = -this.spaceWidth / 2;
                    onBorderX = true;
                }

                if (obj.inTerritory === false && (onBorderX === false || onBorderY === false)) {
                    obj.bodyParts.push(obj.position.clone());
                }
            }
        });
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player's primary object
        let player = this.world.queryObject({ playerId });
        if (player) {
            if (inputData.options) {
                const length = Math.sqrt(inputData.options.x * inputData.options.x + inputData.options.y * inputData.options.y);
                player.orientation = { x: inputData.options.x / length, y: -inputData.options.y / length };
            }
        }
    }
}
