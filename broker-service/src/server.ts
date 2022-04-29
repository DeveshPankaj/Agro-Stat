import * as amqp from "amqplib/callback_api";
import * as mongodb from "mongodb";
import { createServer, request, IncomingMessage, ServerResponse } from "http";

const MongoClient = mongodb.MongoClient;

const queue = "work";
const HOSTNAME = process.env.HOSTNAME || "";

const dataServers = [{ host: "data-store-1", port: 3000 }];

function getDataServerSocket() {
  return dataServers[0];
}

let rb_channel: amqp.Channel | undefined;
let mongo_client: mongodb.MongoClient | undefined;
setTimeout(() => {
  console.log("connecting Queue...");
  amqp.connect(
    "amqp://user:password@working-queue:5672",
    function (error0, connection) {
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
    }
  );

  MongoClient.connect(
    "mongodb://root:example@mongo:27017",
    async function (err, client) {
      if (err) throw err;
      if (!client) throw err;

      mongo_client = client;

      console.log(`Mongo Connected`);

      // client.db('agro').collection('tasks').findOne().then(obj => {
      //   console.log(obj)
      // })
      // const databasesList = await client.db().admin().listDatabases()
      // console.log("Databases:");
      // databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    }
  );
}, 10000);

export const server = createServer((req, res) => {
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

    mongo_client?.db("agro").collection('code').find({}).toArray((error, collections) => {
      if(error) res.end(JSON.stringify({ msg: "failed to get code"}));
      else res.end(JSON.stringify(collections?.map(x => ({...x, _id: x._id.toString()}))));
    })

  } else if (req.method === "POST") {
    const uuid = new mongodb.ObjectId();
    const dataServerSocket = getDataServerSocket();
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const task = {
      _id: uuid,
      status: "queued",
      created_on: Date.now(),
      updated_on: Date.now(),
      pathname: url.pathname,
      headers: JSON.stringify(req.headers),
      searchParams: url.searchParams.toString(),
      resource: JSON.stringify({
        ...dataServerSocket,
        path: "/" + uuid,
        method: "GET",
      }),
    };

    mongo_client?.db("agro").collection("tasks").insertOne(task);
    req.on("end", () =>
      rb_channel?.sendToQueue(queue, Buffer.from(JSON.stringify({ task })))
    );

    onRequest(req, res, { ...dataServerSocket, path: "/" + uuid });
  } else {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Host-Name": HOSTNAME,
    });
    res.end(JSON.stringify({ msg: "I m here!", url: req.url }));
  }
});

function onRequest(
  client_req: IncomingMessage,
  client_res: ServerResponse,
  resource: { host: string; port: number; path: string }
) {
  console.log("serve: " + client_req.url);

  const options = {
    host: resource.host,
    port: resource.port,
    path: resource.path,
    method: client_req.method,
    headers: client_req.headers,
  };

  const proxy = request(options, function (res) {
    client_res.writeHead(res.statusCode || 500, res.headers);
    console.clear();
    console.log("sending data");
  });

  client_req.pipe(proxy, { end: true });
}
