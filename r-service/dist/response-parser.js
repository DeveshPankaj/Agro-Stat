"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DumpParser = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const busboy_1 = __importDefault(require("busboy"));
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
class DumpParser {
    constructor() { }
    parse(stream, headers) {
        return new Promise((resolve, reject) => {
            const bb = (0, busboy_1.default)({ headers });
            bb.on('field', (name, value, info) => {
                let file = fs.createWriteStream(path.join('./resources', name));
                file.write(value, (err) => {
                    file.close();
                });
            });
            bb.on('file', (name, file, info) => {
                // console.log(info)
                file.pipe(fs.createWriteStream(path.join('./resources', name + path.parse(info.filename).ext)));
            });
            bb.on('filesLimit', reject);
            bb.on('partsLimit', reject);
            bb.on('fieldsLimit', reject);
            bb.on('error', reject);
            bb.on('close', () => resolve(null));
            stream.pipe(bb);
        });
    }
}
exports.DumpParser = DumpParser;
