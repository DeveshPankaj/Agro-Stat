"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStateMachime = exports.Context = exports.State = void 0;
const rxjs_1 = require("rxjs");
class IContext {
}
class State {
    constructor() {
        this._nextStates = {};
    }
    get nextStates() {
        return this._nextStates;
    }
    set nextStates(value) {
        this._nextStates = value;
    }
    setContext(context) {
        this.context = context;
    }
}
exports.State = State;
class StateFactory {
    constructor() {
        this.stateMap = new Map();
    }
    register(stateId, resource) {
        this.stateMap.set(stateId, resource);
    }
    get(stateId) {
        return this.stateMap.get(stateId);
    }
}
class Context {
    constructor(stateFactory, rootStateId, events) {
        this.stateFactory = stateFactory;
        this.events = events;
        this._contextData = new Map();
        this.switchState(rootStateId, {});
    }
    get state() {
        return this._state;
    }
    setItem(key, value) {
        this._contextData.set(key, value);
    }
    getItem(key) {
        return this._contextData.get(key);
    }
    handle(event, payload) {
        if (this._state)
            this._state.handle(event, payload);
    }
    switchState(stateId, payload) {
        var _a, _b, _c, _d, _e;
        if (this.events) {
            this.events.next({ event: 'on-switch-state', payload: this });
        }
        if (this._state &&
            this._state.nextStates[stateId] &&
            typeof this._state.nextStates[stateId] === "function") {
            const result = this._state.nextStates[stateId](payload);
            if (result && Array.isArray(result) && typeof result[0] === 'string' && stateId !== result[0]) {
                this.switchState(result[0], result[1]);
            }
            return;
        }
        if (this._state) {
            (_a = this.events) === null || _a === void 0 ? void 0 : _a.next({ event: "before-exit", payload: this._state });
            this._state.handle("exit", this);
            (_b = this.events) === null || _b === void 0 ? void 0 : _b.next({ event: "after-exit", payload: this._state });
        }
        try {
            if (!((this.state && this.state.nextStates[stateId]) || !this.state)) {
                (_c = this.events) === null || _c === void 0 ? void 0 : _c.next({
                    event: "Error",
                    payload: {
                        msg: `invalid transition ${this.cuttectStateId} -> ${stateId}`,
                    },
                });
                return;
            }
            const state = this.stateFactory.get(stateId);
            if (!state)
                throw `invalid state id: ${stateId}, state not found in factory.`;
            this._state = new state();
            this.cuttectStateId = stateId;
            this._state.setContext(this);
            if (this._state) {
                (_d = this.events) === null || _d === void 0 ? void 0 : _d.next({ event: "before-init", payload: this._state });
                this._state.handle("init", payload);
                (_e = this.events) === null || _e === void 0 ? void 0 : _e.next({ event: "after-init", payload: this._state });
            }
        }
        catch (error) {
            if (this.events)
                this.events.next({
                    event: "error",
                    payload: { msg: `Invalid State Id`, stateId: stateId },
                });
        }
    }
}
exports.Context = Context;
const createStateMachime = (states, rootStateId, events) => {
    const stateFactory = new StateFactory();
    Object.keys(states).forEach((key) => stateFactory.register(key, states[key]));
    if (!events)
        events = new rxjs_1.Subject();
    const machineContext = new Context(stateFactory, rootStateId, events);
    return {
        events,
        machine: machineContext,
        next: (event, payload) => machineContext.handle(event, payload),
    };
};
exports.createStateMachime = createStateMachime;
class RootState extends State {
    constructor() {
        super();
        this.nextStates = {
            dialog: "dialog",
            changeMode: (payload) => console.log(`Switching to ${payload} mode`),
        };
    }
    handle(event, payload) {
        if (this.nextStates[event])
            this.context.switchState(event, payload);
    }
}
class DialogOpenState extends State {
    constructor() {
        super();
        this.nextStates = {
            file: "file",
        };
    }
    handle(event, payload) {
        if (this.nextStates[event])
            this.context.switchState(event, payload);
    }
}
class FilePickerState extends State {
    constructor() {
        super();
        this.nextStates = {
            dialog: "dialog",
            home: (payload) => console.log('Welcome home.'),
            back: this.onback,
        };
    }
    handle(event, payload) {
        if (this.nextStates[event])
            this.context.switchState(event, payload);
    }
    onback(payload) {
        console.log("switching back to home screen.");
        return ['home'];
    }
}
// const stateFactory = new StateFactory()
// stateFactory.register('root', RootState)
// stateFactory.register('open-dialog', DialogOpenState)
// const events = new Subject<{event: string, payload: unknown}>()
// const context: IContext = new Context(stateFactory, 'root', events)
// events.subscribe(event => {
//     console.log(event.event, context.cuttectStateId)
// })
// context.handle('open-dialog', {})
const { machine, events, next } = (0, exports.createStateMachime)({
    root: RootState,
    dialog: DialogOpenState,
    file: FilePickerState,
}, "root");
const printState = (state) => {
    // console.log(state.constructor.name)
    Object.keys(state.nextStates).forEach(nextState => {
        console.log(state.constructor.name, '-->', nextState);
    });
    console.log();
};
events
    .pipe((0, rxjs_1.filter)((x) => x.event === "on-switch-state"))
    .subscribe((event) => printState(machine.state));
next("changeMode", "light");
next("dialog", null);
next("file", null);
next("back", null);
next("changeMode", "dark");
//# sourceMappingURL=statemachine-1.js.map