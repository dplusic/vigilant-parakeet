import BaseTypes from 'lance/serialize/BaseTypes';
import DynamicObject from 'lance/serialize/DynamicObject';

export default class Wiggle extends DynamicObject {

    // the direction contains only 4 possible strings:
    //     up, down, left, right
    // this is not efficient, but simplifies learning
    // the array of bodyParts provides the direction of
    // the next part in the body.
    static get netScheme() {
        return Object.assign({
            bodyParts: {
                type: BaseTypes.TYPES.LIST,
                itemType: BaseTypes.TYPES.CLASSINSTANCE
            },
            territory: {
                type: BaseTypes.TYPES.LIST,
                itemType: BaseTypes.TYPES.CLASSINSTANCE
            },
            inTerritory: {
                type: BaseTypes.TYPES.INT8
            },
            playerName: {
                type: BaseTypes.TYPES.STRING
            },
            color: {
                type: BaseTypes.TYPES.STRING
            },
        }, super.netScheme);
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Wiggle;
        this.inTerritory = true;
        this.bodyParts = [];
        this.territory = [];

        if (options) {
            this.playerName = options.playerName;
            this.color = options.color;
        }
    }

    syncTo(other) {
        super.syncTo(other);

        this.inTerritory = other.inTerritory === 0 ? false : true;

        // TODO: sync in appropriate time
        this.playerName = other.playerName;
        this.color = other.color;
        this.bodyParts = other.bodyParts;
        this.territory = other.territory;
    }

    toString() {
        // let body = '';
        // this.bodyParts.forEach((b, i) => { body += `${b.toString()},`; });
        return `Wiggle::${super.toString()}`;
    }
}
