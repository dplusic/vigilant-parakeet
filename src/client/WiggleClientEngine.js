import ClientEngine from 'lance/ClientEngine';
import WiggleRenderer from '../client/WiggleRenderer';
import Controls from './Controls';

export default class WiggleClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        options.serverURL = '';

        super(gameEngine, options, WiggleRenderer);

        this.playerName = options.playerName;

        this.controls = new Controls(this);
    }

    connect() {
        return super.connect({
            query: {
                playerName: this.playerName,
            },
        });
    }
}
