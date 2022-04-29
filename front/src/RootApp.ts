import { State } from "./utils/statemachine-2";

export class RootApp extends State {
    constructor(private params: {files?: FileList}) {
        super()
        this.transitions.selectFile = 'selectFile'
        this.actions.init = this.init.bind(this)

        this.actions.selectFile = () => {
            this.context?.switchState('selectFile', [{back: 'root'}])
        }

        if(params?.files) {
            this.actions.analyse = this.analyse.bind(this)
        }
    }

    init() {
        console.log(this.params?.files?.[0])
    }

    handle(cmd: string, payload?: unknown): void {}

    analyse() {
        console.log('Analyse')
    }
}
