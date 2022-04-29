import {createServer, STATUS_CODES} from 'http'
import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'
const dir = path.join(process.env.DATA_HOST_DIR || '/home', '/')
const hostName = os.hostname()


export const server = createServer((req, res) => {
    const filePath = path.join(dir, req.url || '')
    switch(req.method) {
        case 'GET':
            if(fs.existsSync(filePath)) fs.createReadStream(filePath).pipe(res, {end: true})
            else res.writeHead(404, {}).end()
        break

        case 'POST':
            if(filePath===dir) return res.end(JSON.stringify({msg: `Sorry bro I don't understand what you are talking about!`}));
            
            req.pipe(fs.createWriteStream(filePath))
            req.on('end', () => res.end(JSON.stringify({filePath: req.url})))
        break

        // we are not smart enough
        default:
            res.writeHead(400, { 'Content-Type': 'text/plain' }).end(JSON.stringify({msg: `Sorry bro I don't understand what you are talking about!`}))
    }
  
})


