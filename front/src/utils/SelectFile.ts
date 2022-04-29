import { State } from "./statemachine-2";

export class SelectFile extends State {
  constructor(private params: {back: string}) {
    super();
    this.transitions.back = params.back
    this.actions.init = this.init.bind(this);
  }
  init() {
    const input = document.createElement("input");
    input.style.display = "hidden";
    input.type = "file";
    input.onchange = async () => {
        this.context?.switchState('back', [{files: input.files}])
    };
    input.click();
  }
  handle(cmd: string, payload?: unknown): void {}
}
