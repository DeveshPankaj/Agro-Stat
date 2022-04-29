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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const fs_1 = __importStar(require("fs"));
const http_1 = require("http");
const response_parser_1 = require("./response-parser");
const child_process_1 = require("child_process");
const dumpFile = './data.dump';
class RServer {
    accept(req, res) {
        switch (req.method) {
            case 'GET':
                this.get(req, res);
                break;
            case 'POST':
                this.post(req, res);
                break;
            default: res.end(JSON.stringify({ msg: 'Abra ka dabra!' }));
        }
    }
    get(req, res) {
        res.end(JSON.stringify({ msg: 'Hi bro (:' }));
    }
    post(req, res) {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            this.onLoad(Buffer.concat(chunks));
            res.end(JSON.stringify({ msg: `R Server is running...` }));
        });
    }
    loadresources(task) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(task);
            const resource = JSON.parse(task.resource);
            // const resource = {
            //     method: 'GET',
            //     port: dataSocket.port,
            //     host: dataSocket.host,
            //     path: '/' + task._id,
            // }
            const callback = (response) => {
                console.log(response.statusCode, response.statusMessage);
                if ((0, fs_1.existsSync)(dumpFile))
                    (0, fs_1.unlinkSync)(dumpFile);
                if ((0, fs_1.existsSync)('./resources'))
                    fs_1.default.rmdirSync('./resources', { recursive: true });
                (0, fs_1.mkdirSync)('./resources');
                const bb = new response_parser_1.DumpParser();
                bb.parse(response, JSON.parse(task.headers)).then(_ => {
                    console.log('Done parsing..');
                    this.runR('src/main.r');
                });
                // response.pipe(createWriteStream('./data.dump'), {end: true}).on('error', error => {
                //     console.log('Failed to download', error)
                // })
                // response.on('end', () => {
                //     console.log('Fetch Done!')
                // })
            };
            const proxy = yield (0, http_1.request)(resource, callback);
            proxy.end(() => { console.log('Connection Closed!'); });
        });
    }
    onLoad(buffer) {
        const task = JSON.parse(buffer.toString());
        this.loadresources(task.task);
    }
    parseSesource() {
        // const bb = new DumpParser()
        // bb.parse()
    }
    runR(file) {
        console.log(`Running R proc...`);
        const proc = (0, child_process_1.spawn)('Rscript', [file], {});
        proc.stdout.on('data', (data) => {
            // console.log(`stdout: ${data}`);
            data.toString().split('\n').forEach((line) => {
                console.log('==>', line);
            });
        });
        proc.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        proc.on('error', error => {
            console.log(error);
        });
        proc.on('exit', code => {
            console.log('Exit', code);
        });
    }
}
const app = new RServer();
exports.server = (0, http_1.createServer)((req, res) => app.accept(req, res));
