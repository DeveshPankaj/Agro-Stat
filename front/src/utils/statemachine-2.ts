import { BehaviorSubject, Subject } from "rxjs";

export enum ContextEvents {
  STATE_CHANGED = "STATE_CHANGD",
  STATE_NOT_FOUND = "STATE_NOT_FOUND",
  INVALID_TRANSITION = "INVALID_TRANSITION",
  ERROR = "ERROR",
}

type Instantiable<T> = { new (...args: any): T };
abstract class Creator<T> {
  public abstract resolve(id: string): Instantiable<T>;
  public createInstance(stateId: string, params: Array<unknown>): T {
    const constructor = this.resolve(stateId);
    return new constructor(...params);
  }
}

export class StateFactory extends Creator<State> {
  private stateMap: Map<string, Instantiable<State>> = new Map();

  public resolve(id: string): Instantiable<State> {
    return this.stateMap.get(id) || NullState;
  }

  public register(stateId: string, resource: Instantiable<State>) {
    this.stateMap.set(stateId, resource);
  }
}

class Context {
  public _state: State | null = null;
  public _currentStateId: string;
  public _sharedState: Map<string, string> = new Map();
  private _bridge: ContextBridge | null = null;
  private _stateFactory: Creator<State>;
  private _events: BehaviorSubject<{ type: ContextEvents; payload: unknown }> =
    new BehaviorSubject<{ type: ContextEvents; payload: unknown }>({type: ContextEvents.STATE_CHANGED, payload: null});

  readonly events = this._events.asObservable();

  constructor(
    stateId: string,
    factory: Creator<State>,
    rootParams: Array<unknown> = []
  ) {
    this._stateFactory = factory;
    this.switchState(this._stateFactory.createInstance(stateId, rootParams));
    this._currentStateId = stateId;
  }

  private setState(state: State) {
    let switchState = (stateId: string, args: Array<unknown> = []) => {
      if (!state.transitions[stateId])
        return this._events.next({
          type: ContextEvents.INVALID_TRANSITION,
          payload: {msg: `from ${this._currentStateId}, to: ${stateId}`, from: this._currentStateId, to: stateId},
        });

      let nextStateId = state.transitions[stateId];
      if (typeof nextStateId === "string") stateId = nextStateId;

      let nextState = this._stateFactory.createInstance(stateId, args);

      this._currentStateId = stateId;
      this.switchState(nextState);
    };
    this._bridge = new ContextBridge(this._sharedState, switchState);
    state.setContext(this._bridge);
    this._state = state;
    this.exec("init", null);
  }

  private removeState() {
    this.exec("exit", null);
    this._state = null;
    if (this._bridge) {
      this._bridge.updateDataSource(new Map());
      this._bridge.switchState = () => {};
      this._bridge = null;
    }
  }

  private switchState(state: State) {
    this.removeState();
    this.setState(state);
    this._events.next({ type: ContextEvents.STATE_CHANGED, payload: {to: this._currentStateId}});
  }

  public exec(cmd: string, payload: unknown) {
    try {
      if (this._state && this._state.actions[cmd])
        return this._state.actions[cmd]?.(payload);
      else return this._state?.handle(cmd, payload);
    } catch (error) {
      this._events.next({ type: ContextEvents.ERROR, payload: error });
    }
  }
}

class ContextBridge {
  constructor(
    private dataSource: Map<string, string>,
    public switchState: (stateId: string, args?: Array<unknown>) => void
  ) {}
  public updateDataSource(dataSource: Map<string, string>) {
    this.dataSource = dataSource;
  }
  public get(key: string) {
    return this.dataSource?.get(key);
  }
  public set(key: string, value: string) {
    this.dataSource?.set(key, value);
  }
}

export abstract class State {
  // TODO: emit state local changes, extend Map
  readonly transitions: { [key: string]: boolean | string } = {};
  readonly actions: { [key: string]: Function } = {};

  protected context?: ContextBridge;
  public setContext(context: ContextBridge) {
    if (!this.context) this.context = context;
  }

  abstract handle(cmd: string, payload?: unknown): void;
}

class NullState extends State {
  handle(cmd: string, payload?: unknown): void {}
}

export class StateMachine {
  private context: Context;
  public events: Context["events"];
  constructor(rootStateId: string, readonly stateFactory: Creator<State>) {
    this.context = new Context(rootStateId, stateFactory);
    this.events = this.context.events;
  }

  exec(cmd: string, payload: unknown) {
    return this.context.exec(cmd, payload);
  }

  get transitions() {
    return this.context._state?.transitions;
  }

  get actions() {
    return this.context._state?.actions;
  }

  get currentStateId() {
    return this.context._currentStateId;
  }
}

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


