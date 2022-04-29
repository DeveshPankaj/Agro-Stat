"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class StateMachine {
    constructor(root) {
        this.root = root;
        this.states = new Map();
        this._transitions = new Map();
        this.eventSource = new rxjs_1.BehaviorSubject({});
        this.events = this.eventSource.asObservable();
        this.transitions = [];
        this.states.set(root.id, root);
        this.currentState = root;
        this.eventSource.next({ to: root });
    }
    next(transitionId) {
        var _a;
        if (this._transitions.has(transitionId)) {
            let transition = this._transitions.get(transitionId);
            let currentState = this.currentState;
            this.currentState = transition.to;
            this.transitions = [];
            if (currentState === null || currentState === void 0 ? void 0 : currentState.onLeave)
                currentState.onLeave(transition);
            if ((_a = transition.to) === null || _a === void 0 ? void 0 : _a.onEnter)
                transition.to.onEnter(transition);
            this.eventSource.next(transition);
        }
    }
}
//# sourceMappingURL=statemachine.js.map