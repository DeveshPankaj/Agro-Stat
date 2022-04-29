import { BehaviorSubject, filter, Subject } from "rxjs";

type StateClassType = { new (): State };

abstract class IContext {
  abstract cuttectStateId: string;
  abstract state: State;
  abstract setItem(key: string, value: string): void
  abstract getItem(key: string): string | undefined
  abstract handle(event: string, payload: unknown): void;
  abstract switchState(stateId: string, payload?: unknown): void;
}

export abstract class State {
  protected context!: IContext;
  private _nextStates: {
    [stateId: string]: string | ((payload: unknown) => [string]|[string, unknown]|void);
  } = {};
  get nextStates() {
    return this._nextStates;
  }
  set nextStates(value) {
    this._nextStates = value;
  }
  setContext(context: IContext) {
    this.context = context;
  }
  public abstract handle(event: string, payload: unknown): void;
}

class StateFactory {
  constructor() {}

  private stateMap: Map<string, StateClassType> = new Map();
  register(stateId: string, resource: StateClassType) {
    this.stateMap.set(stateId, resource);
  }

  get(stateId: string) {
    return this.stateMap.get(stateId);
  }
}

export class Context implements IContext {
  private _state!: State;
  private _contextData: Map<string, string> = new Map()
  public cuttectStateId!: string;

  get state(): State {
    return this._state;
  }

  constructor(
    private stateFactory: StateFactory,
    rootStateId: string,
    private events?: Subject<{ event: string; payload: unknown }>
  ) {
    this.switchState(rootStateId, {});
  }
  setItem(key: string, value: string): void {
    this._contextData.set(key, value)
  }
  getItem(key: string): string | undefined {
    return this._contextData.get(key)
  }

  public handle(event: string, payload: unknown) {
    if (this._state) this._state.handle(event, payload);
  }

  public switchState(stateId: string, payload: unknown): void {
    if(this.events) {
      this.events.next({event: 'on-switch-state', payload: this})
    }

    if (
      this._state &&
      this._state.nextStates[stateId] &&
      typeof this._state.nextStates[stateId] === "function"
    ) {
      const result = (this._state.nextStates[stateId] as Function)(payload);
      if(result && Array.isArray(result) && typeof result[0] === 'string' && stateId !== result[0]) {
        this.switchState(result[0], result[1])
      }
      return;
    }

    if (this._state) {
      this.events?.next({ event: "before-exit", payload: this._state });
      this._state.handle("exit", this);
      this.events?.next({ event: "after-exit", payload: this._state });
    }

    try {
      if (!((this.state && this.state.nextStates[stateId]) || !this.state)) {
        this.events?.next({
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
        this.events?.next({ event: "before-init", payload: this._state });
        this._state.handle("init", payload);
        this.events?.next({ event: "after-init", payload: this._state });
      }
    } catch (error) {
      if (this.events)
        this.events.next({
          event: "error",
          payload: { msg: `Invalid State Id`, stateId: stateId },
        });
    }
  }
}

export const createStateMachime = (
  states: { [key: string]: StateClassType },
  rootStateId: string,
  events?: Subject<{ event: string; payload: unknown }>
) => {
  const stateFactory = new StateFactory();
  Object.keys(states).forEach((key) => stateFactory.register(key, states[key]));

  if (!events) events = new Subject<{ event: string; payload: unknown }>();
  const machineContext = new Context(stateFactory, rootStateId, events);
  return {
    events,
    machine: machineContext,
    next: (event: string, payload: unknown) =>
      machineContext.handle(event, payload),
  };
};

class RootState extends State {
  constructor() {
    super();
    this.nextStates = {
      dialog: "dialog",
      changeMode: (payload) => console.log(`Switching to ${payload} mode`),
    };
  }
  public handle(event: string, payload: unknown): void {
    if (this.nextStates[event]) this.context.switchState(event, payload);
  }
}

class DialogOpenState extends State {
  constructor() {
    super();
    this.nextStates = {
      file: "file",
    };
  }
  public handle(event: string, payload: unknown): void {
    if (this.nextStates[event]) this.context.switchState(event, payload);
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
  public handle(event: string, payload: unknown): void {
    if (this.nextStates[event]) this.context.switchState(event, payload);
  }

  private onback(payload: unknown): [string] {
    console.log("switching back to home screen.");
    return ['home']
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

const { machine, events, next } = createStateMachime(
  {
    root: RootState,
    dialog: DialogOpenState,
    file: FilePickerState,
  },
  "root"
);



const printState = (state: State) => {
  // console.log(state.constructor.name)
  Object.keys(state.nextStates).forEach(nextState => {
    console.log(state.constructor.name, '-->', nextState)
  })
  console.log()
}

events
  .pipe(filter((x) => x.event === "on-switch-state"))
  .subscribe((event) => printState(machine.state));

next("changeMode", "light");
next("dialog", null);
next("file", null);
next("back", null);
next("changeMode", "dark");
