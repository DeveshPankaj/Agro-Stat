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
const amqp = __importStar(require("amqplib/callback_api"));
const mongodb = __importStar(require("mongodb"));
const http_1 = require("http");
const MongoClient = mongodb.MongoClient;
const queue = "work";
const HOSTNAME = process.env.HOSTNAME || "";
const dataServers = [{ host: "data-store-1", port: 3000 }];
function getDataServerSocket() {
    return dataServers[0];
}
let rb_channel;
let mongo_client;
setTimeout(() => {
    console.log("connecting Queue...");
    amqp.connect("amqp://user:password@working-queue:5672", function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            console.log("Queue connected!");
            channel.assertQueue(queue, { durable: false });
            rb_channel = channel;
        });
    });
    MongoClient.connect("mongodb://root:example@mongo:27017", function (err, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err)
                throw err;
            if (!client)
                throw err;
            mongo_client = client;
            console.log(`Mongo Connected`);
            // client.db('agro').collection('tasks').findOne().then(obj => {
            //   console.log(obj)
            // })
            // const databasesList = await client.db().admin().listDatabases()
            // console.log("Databases:");
            // databasesList.databases.forEach(db => console.log(` - ${db.name}`));
        });
    });
}, 10000);
exports.server = (0, http_1.createServer)((req, res) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Max-Age": 2592000, // 30 days
        /** add other headers as per requirement */
    };
    if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
        res.end();
        return;
    }
    if (req.method === "GET") {
        res.writeHead(200, headers);
        mongo_client === null || mongo_client === void 0 ? void 0 : mongo_client.db("agro").collection('code').find({}).toArray((error, collections) => {
            if (error)
                res.end(JSON.stringify({ msg: "failed to get code" }));
            else
                res.end(JSON.stringify(collections === null || collections === void 0 ? void 0 : collections.map(x => (Object.assign(Object.assign({}, x), { _id: x._id.toString() })))));
        });
    }
    else if (req.method === "POST") {
        const uuid = new mongodb.ObjectId();
        const dataServerSocket = getDataServerSocket();
        const url = new URL(req.url, `http://${req.headers.host}`);
        const task = {
            _id: uuid,
            status: "queued",
            created_on: Date.now(),
            updated_on: Date.now(),
            pathname: url.pathname,
            headers: JSON.stringify(req.headers),
            searchParams: url.searchParams.toString(),
            resource: JSON.stringify(Object.assign(Object.assign({}, dataServerSocket), { path: "/" + uuid, method: "GET" })),
        };
        mongo_client === null || mongo_client === void 0 ? void 0 : mongo_client.db("agro").collection("tasks").insertOne(task);
        req.on("end", () => rb_channel === null || rb_channel === void 0 ? void 0 : rb_channel.sendToQueue(queue, Buffer.from(JSON.stringify({ task }))));
        onRequest(req, res, Object.assign(Object.assign({}, dataServerSocket), { path: "/" + uuid }));
    }
    else {
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Host-Name": HOSTNAME,
        });
        res.end(JSON.stringify({ msg: "I m here!", url: req.url }));
    }
});
function onRequest(client_req, client_res, resource) {
    console.log("serve: " + client_req.url);
    const options = {
        host: resource.host,
        port: resource.port,
        path: resource.path,
        method: client_req.method,
        headers: client_req.headers,
    };
    const proxy = (0, http_1.request)(options, function (res) {
        client_res.writeHead(res.statusCode || 500, res.headers);
        console.clear();
        console.log("sending data");
    });
    client_req.pipe(proxy, { end: true });
}
