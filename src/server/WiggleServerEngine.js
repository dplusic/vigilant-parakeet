import ServerEngine from 'lance/ServerEngine';
import Wiggle from '../common/Wiggle';
import Food from '../common/Food';
import TwoVector from 'lance/serialize/TwoVector';
import { makeInitialTerritory, inTerritory, makeNewTerritory } from '../common/Model/Territory';

const tupleToTwoVector = (x) => new TwoVector(x[0], x[1]);
const twoVectorToTuple = (v) => ([v.x, v.y]);

const getRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

export default class WiggleServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        this.gameEngine.on('postStep', this.stepLogic.bind(this));
    }

    start() {
        super.start();
        for (let f = 0; f < this.gameEngine.foodCount; f++) {
            let newF = new Food(this.gameEngine, null, { position: this.gameEngine.randPos() });
            this.gameEngine.addObjectToWorld(newF);
        }
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        const playerName = socket.handshake.query.playerName;
        const color = getRandomColor();
        const position = this.gameEngine.randPos();
        let player = new Wiggle(this.gameEngine, { color, playerName }, { position });
        player.territory = makeInitialTerritory(30)(1)([position.x, position.y]).map(tupleToTwoVector);
        player.playerId = socket.playerId;
        this.gameEngine.addObjectToWorld(player);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        // let playerObj = this.gameEngine.world.queryObjects({ playerId });
        if (!(playerId in this.gameEngine.world.objects))
            return;
        this.gameEngine.removeObjectFromWorld(playerId);
    }

    // Eating Food:
    // increase body length, and remove the food
    wiggleEatFood(w, f) {
        if (!(f.id in this.gameEngine.world.objects))
            return;

        console.log(`wiggle eats food ${f.toString()} ${w.toString()}`);
        w.bodyLength++;
        this.gameEngine.removeObjectFromWorld(f);
        let newF = new Food(this.gameEngine, null, { position: this.gameEngine.randPos() });
        this.gameEngine.addObjectToWorld(newF);
    }

    wiggleHitWiggle(w1, w2) {
        if (!(w2.id in this.gameEngine.world.objects))
            return;

        console.log(`wiggle hit wiggle ${w1.toString()} ${w2.toString()}`);

        this.gameEngine.removeObjectFromWorld(w2);
    }

    stepLogic() {
        let wiggles = this.gameEngine.world.queryObjects({ instanceType: Wiggle });
        let foodObjects = this.gameEngine.world.queryObjects({ instanceType: Food });
        for (let w of wiggles) {

            // check inTerritory
            this.checkInTerritory(w);

            // check for collision
            for (let w2 of wiggles) {
                let i = w2.bodyParts.length - 1;
                if (w === w2) {
                    i = w2.bodyParts.length - 30;
                }

                for (; i >= 0; i--) {
                    let distance = w2.bodyParts[i].clone().subtract(w.position);
                    if (distance.length() < this.gameEngine.collideDistance)
                        this.wiggleHitWiggle(w, w2);
                }
            }

            // check for food-eating
            for (let f of foodObjects) {
                let distance = w.position.clone().subtract(f.position);
                if (distance.length() < this.gameEngine.eatDistance) {
                    this.wiggleEatFood(w, f);
                }
            }
        }
    }

    checkInTerritory(w) {
        const previousInTerritory = w.inTerritory;

        w.inTerritory = inTerritory(w.territory.map(twoVectorToTuple))([w.position.x, w.position.y]);

        if (previousInTerritory === false && w.inTerritory === true) {
            w.territory = makeNewTerritory(w.territory.map(twoVectorToTuple))(w.bodyParts.slice(0, w.bodyParts.length - 1).map(twoVectorToTuple)).map(tupleToTwoVector);
            w.bodyParts = [];
        }
    }
}
