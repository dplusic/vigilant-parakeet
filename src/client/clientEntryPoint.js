import querystring from 'query-string';
import WiggleClientEngine from '../client/WiggleClientEngine';
import WiggleGameEngine from '../common/WiggleGameEngine';
import Trace from 'lance/lib/Trace';
const qsOptions = querystring.parse(location.search);

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: Trace.TRACE_NONE,
    delayInputCount: 3,
    scheduler: 'render-schedule',
    syncOptions: {
        sync: qsOptions.sync || 'extrapolate',
        localObjBending: 0.8,
        remoteObjBending: 0.8,
        bendingIncrements: 6
    }
};
let options = Object.assign(defaults, qsOptions);

let name = localStorage.getItem('playerName');
while (typeof name !== 'string' || name.trim().length < 1) {
    name = prompt('name?');
}
options.playerName = name;
localStorage.setItem('playerName', name);

// create a client engine and a game engine
const gameEngine = new WiggleGameEngine(options);
const clientEngine = new WiggleClientEngine(gameEngine, options);

document.addEventListener('DOMContentLoaded', function(e) { clientEngine.start(); });
