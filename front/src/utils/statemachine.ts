import { BehaviorSubject } from "rxjs";

interface IState {
  id: string;
  onEnter?: (transition: ITransition) => void;
  onLeave?: (transition: ITransition) => void;
}

interface ITransition {
  id: string;
  to: IState;
  from: IState;
}

interface IStateMachene {
  currentState?: IState;
  transitions: Array<ITransition>;
}

class StateMachine implements IStateMachene {
  private states: Map<string, IState> = new Map<string, IState>();
  private _transitions: Map<string, ITransition> = new Map<string, ITransition>();
  private eventSource = new BehaviorSubject<Partial<ITransition>>({});

  readonly events = this.eventSource.asObservable();
  public currentState?: IState;
  public transitions: ITransition[] = [];

  constructor(private root: IState) {
    this.states.set(root.id, root);
    this.currentState = root;
    this.eventSource.next({ to: root });
  }

  next(transitionId: string) {
    if (this._transitions.has(transitionId)) {
      let transition = this._transitions.get(transitionId)!;
      let currentState = this.currentState;

      this.currentState = transition.to;
      this.transitions = []

      if (currentState?.onLeave) currentState.onLeave(transition);
      if (transition.to?.onEnter) transition.to.onEnter(transition);

      this.eventSource.next(transition);
    }
  }
}
