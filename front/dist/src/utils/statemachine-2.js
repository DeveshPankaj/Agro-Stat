"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachine = exports.ContextEvents = void 0;
const rxjs_1 = require("rxjs");
var ContextEvents;
(function (ContextEvents) {
    ContextEvents["STATE_CHANGED"] = "STATE_CHANGD";
    ContextEvents["STATE_NOT_FOUND"] = "STATE_NOT_FOUND";
    ContextEvents["INVALID_TRANSITION"] = "INVALID_TRANSITION";
    ContextEvents["ERROR"] = "ERROR";
})(ContextEvents = exports.ContextEvents || (exports.ContextEvents = {}));
class Creator {
    createInstance(stateId, params) {
        const constructor = this.resolve(stateId);
        return new constructor(...params);
    }
}
class StateFactory extends Creator {
    constructor() {
        super(...arguments);
        this.stateMap = new Map();
    }
    resolve(id) {
        return this.stateMap.get(id) || NullState;
    }
    register(stateId, resource) {
        this.stateMap.set(stateId, resource);
    }
}
class Context {
    constructor(stateId, factory, rootParams = []) {
        this._state = null;
        this._sharedState = new Map();
        this._bridge = null;
        this._events = new rxjs_1.Subject();
        this.events = this._events.asObservable();
        this._stateFactory = factory;
        this.switchState(this._stateFactory.createInstance(stateId, rootParams));
        this._currentStateId = stateId;
    }
    setState(state) {
        let switchState = (stateId, args = []) => {
            if (!state.transitions[stateId])
                return this._events.next({
                    type: ContextEvents.INVALID_TRANSITION,
                    payload: { msg: `from ${this._currentStateId}, to: ${stateId}`, from: this._currentStateId, to: stateId },
                });
            let nextStateId = state.transitions[stateId];
            if (typeof nextStateId === "string")
                stateId = nextStateId;
            let nextState = this._stateFactory.createInstance(stateId, args);
            this._currentStateId = stateId;
            this.switchState(nextState);
        };
        this._bridge = new ContextBridge(this._sharedState, switchState);
        state.setContext(this._bridge);
        this._state = state;
        this.exec("init", null);
    }
    removeState() {
        this.exec("exit", null);
        this._state = null;
        if (this._bridge) {
            this._bridge.updateDataSource(new Map());
            this._bridge.switchState = () => { };
            this._bridge = null;
        }
    }
    switchState(state) {
        this.removeState();
        this.setState(state);
        this._events.next({ type: ContextEvents.STATE_CHANGED, payload: { to: this._currentStateId } });
    }
    exec(cmd, payload) {
        var _a, _b, _c;
        try {
            if (this._state && this._state.actions[cmd])
                return (_b = (_a = this._state.actions)[cmd]) === null || _b === void 0 ? void 0 : _b.call(_a, payload);
            else
                return (_c = this._state) === null || _c === void 0 ? void 0 : _c.handle(cmd, payload);
        }
        catch (error) {
            this._events.next({ type: ContextEvents.ERROR, payload: error });
        }
    }
}
class ContextBridge {
    constructor(dataSource, switchState) {
        this.dataSource = dataSource;
        this.switchState = switchState;
    }
    updateDataSource(dataSource) {
        this.dataSource = dataSource;
    }
    get(key) {
        var _a;
        return (_a = this.dataSource) === null || _a === void 0 ? void 0 : _a.get(key);
    }
    set(key, value) {
        var _a;
        (_a = this.dataSource) === null || _a === void 0 ? void 0 : _a.set(key, value);
    }
}
class State {
    constructor() {
        // TODO: emit state local changes, extend Map
        this.transitions = {};
        this.actions = {};
    }
    setContext(context) {
        if (!this.context)
            this.context = context;
    }
}
class NullState extends State {
    handle(cmd, payload) { }
}
class StateMachine {
    constructor(rootStateId, stateFactory) {
        this.stateFactory = stateFactory;
        this.context = new Context(rootStateId, stateFactory);
        this.events = this.context.events;
    }
    exec(cmd, payload) {
        return this.context.exec(cmd, payload);
    }
    get transitions() {
        var _a;
        return (_a = this.context._state) === null || _a === void 0 ? void 0 : _a.transitions;
    }
    get actions() {
        var _a;
        return (_a = this.context._state) === null || _a === void 0 ? void 0 : _a.actions;
    }
    get currentStateId() {
        return this.context._currentStateId;
    }
}
exports.StateMachine = StateMachine;
// class RootApp extends State {
//   constructor() {
//     super();
//     this.transitions.Modal = 'modal';
//     this.actions.init = this.init.bind(this);
//     this.actions.goto = this.openModal.bind(this);
//   }
//   private init() {
//     this.context?.set("currentStateId", "root");
//   }
//   private openModal({modalId} :{modalId: string}) {
//     this.context?.switchState(modalId, [{}]);
//   }
//   public handle(cmd: string, payload: { stateId: string }): void {}
// }
// class Modal extends State {
//   constructor(config: any) {
//     super();
//     this.transitions.root = true;
//     this.actions.init = this.init.bind(this);
//     this.actions.greet = this.greet.bind(this);
//   }
//   private init() {
//     this.context?.set("currentStateId", "modal");
//   }
//   private greet(msg: string) {
//       this.context?.switchState('root')
//   }
//   public handle(cmd: string, payload: unknown): void {}
// }
// const factory = new StateFactory();
// factory.register("root", RootApp);
// factory.register("modal", Modal);
// const machine = new StateMachine("root", factory);
// machine.events.subscribe((event) => {
//   console.log(event);
// });
// console.log(machine.currentStateId);
// machine.exec("goto", { modalId: "Modal" });
// console.log(machine.currentStateId);
// machine.exec("greet", { modalId: "Modal" });
// console.log(machine.currentStateId);
// machine.exec("goto", { modalId: "Modal" });
// console.log(machine.currentStateId);
//# sourceMappingURL=statemachine-2.js.map