
const http = require('http')
const net = require('net')
const amqp = require('amqplib/callback_api')
const queue = 'work';

setTimeout(()=>{
    console.log('connecting Queue...')
    amqp.connect('amqp://user:password@working-queue:5672', function(error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function(error1, channel) {
          if (error1) {
            throw error1;
          }
          
          console.log('Queue connected!')
      
          channel.assertQueue(queue, {durable: false});

          channel.consume(queue, (msg) => {
            const payload = JSON.parse(msg.content)
            console.log(payload)
            const postData = msg.content

            const options = {
              hostname: 'r-worker',
              port: 8080,
              path: '/run',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
              }
            };
            
            const req = http.request(options, (res) => {
              console.log(`STATUS: ${res.statusCode}`);
              console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
              res.setEncoding('utf8');
              res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
              });
              res.on('end', () => {
                // console.log('No more data in response.');
              });
            });
            
            req.on('error', (e) => {
              console.error(`problem with request: ${e.message}`);
            });
            
            // Write data to request body
            req.write(postData);
            req.end();

          }, {noAck: true})
        });
      });
}, 10000)


// const server = http.createServer((req, res) => {
//     res.end(JSON.stringify({msg: 'I m here!', url: req.url}))
// })

// server.listen(80)