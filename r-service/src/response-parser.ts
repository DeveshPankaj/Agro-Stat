import * as fs from 'fs'
import * as path from 'path'
import busboy, {Busboy} from 'busboy'
import stream from 'stream'


// const bb = busboy({
//     headers: {
//         'content-type': 'multipart/form-data; boundary=--------------------------616501712355812853695918'
//     }
// })

// bb.on('file', (name, file, info) => {
//     console.log(name, info)
//     let ext = path.parse(info.filename).ext
//     file.pipe(fs.createWriteStream(`./data/${name}${ext}`), {end: true})
// })


// bb.on('field', (name, value, info) => {
//     console.log(name, value);
// })


// bb.on('close', () => {
//     console.log('Done parsing form!')
// })


// const rs = fs.createReadStream('./data/622b96d69f8678353f3cf79e')

// rs.pipe(bb, {end: true})


export class DumpParser {
    constructor() {}
    public parse(stream: stream.Readable , headers: {'content-type': string}) {
        return new Promise((resolve, reject) => {
            const bb = busboy({headers})

            bb.on('field', (name, value, info) => {
                let file = fs.createWriteStream(path.join('./resources', name))
                file.write(value, (err) => {
                    file.close()
                })
            })

            bb.on('file', (name, file, info) => {
                // console.log(info)
                file.pipe(fs.createWriteStream(path.join('./resources', name + path.parse(info.filename).ext)))
            })

            bb.on('filesLimit', reject)
            bb.on('partsLimit', reject)
            bb.on('fieldsLimit', reject)
            bb.on('error', reject)
            bb.on('close', () => resolve(null))
            stream.pipe(bb)
        })
    }
}


