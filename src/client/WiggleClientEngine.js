import ClientEngine from 'lance/ClientEngine';
import WiggleRenderer from '../client/WiggleRenderer';
import Controls from './Controls';

export default class WiggleClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, WiggleRenderer);

        this.controls = new Controls(this);
    }

}
