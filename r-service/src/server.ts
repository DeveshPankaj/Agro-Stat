import fs, {createWriteStream, existsSync, unlinkSync, mkdirSync} from 'fs'
import {createServer, request, IncomingMessage, ServerResponse} from 'http'
import {DumpParser} from './response-parser'
import {spawn} from 'child_process'

interface IServerApp {
    accept(req: IncomingMessage, res: ServerResponse): any
}

const dumpFile = './data.dump'

class RServer implements IServerApp {
    public accept(req: IncomingMessage, res: ServerResponse) {
        switch(req.method) {
            case 'GET': this.get(req, res)
            break

            case 'POST': this.post(req, res)
            break

            default: res.end(JSON.stringify({msg: 'Abra ka dabra!'}))
        }
    }


    private get(req: IncomingMessage, res: ServerResponse) {
        res.end(JSON.stringify({msg: 'Hi bro (:'}))
    }

    private post(req: IncomingMessage, res: ServerResponse) {
        const chunks:Array<Buffer> = []

        req.on('data', chunk => chunks.push(chunk))

        req.on('end', () => {
            this.onLoad(Buffer.concat(chunks))
            res.end(JSON.stringify({msg: `R Server is running...`}))
        })

    }


    private async loadresources(task: any) {

        console.log(task)
        const resource: {
            host: string, 
            port: number, 
            path: string, 
            method: string
        } = JSON.parse(task.resource)
        // const resource = {
        //     method: 'GET',
        //     port: dataSocket.port,
        //     host: dataSocket.host,
        //     path: '/' + task._id,
        // }

        const callback = (response: IncomingMessage) => {
            console.log(response.statusCode, response.statusMessage)

            if(existsSync(dumpFile)) unlinkSync(dumpFile)
            if(existsSync('./resources')) fs.rmdirSync('./resources', { recursive: true })
            mkdirSync('./resources')

            
            const bb = new DumpParser()
            bb.parse(response, JSON.parse(task.headers)).then(_ => {
                console.log('Done parsing..')
                this.runR('src/main.r')
            })

            // response.pipe(createWriteStream('./data.dump'), {end: true}).on('error', error => {
            //     console.log('Failed to download', error)
            // })

            // response.on('end', () => {
            //     console.log('Fetch Done!')
            // })
        }
        
        const proxy = await request(resource, callback);
        proxy.end(() => { console.log('Connection Closed!') })
    }

    private onLoad(buffer: Buffer) {
        const task = JSON.parse(buffer.toString())
        this.loadresources(task.task)
    }

    private parseSesource() {
        // const bb = new DumpParser()
        // bb.parse()
    }

    private runR(file: string) {
        console.log(`Running R proc...`)
        const proc = spawn('Rscript', [file], {})

        proc.stdout.on('data', (data) => {
            // console.log(`stdout: ${data}`);
            data.toString().split('\n').forEach((line: string) => {
                console.log('==>', line)
            });
        })
          
        proc.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        })

        proc.on('error', error => {
            console.log(error)
        })

        proc.on('exit', code => {
            console.log('Exit', code)
        })
    }
}

const app: IServerApp = new RServer()

export const server = createServer((req, res) => app.accept(req, res))
