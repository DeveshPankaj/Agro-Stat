
const server = require('./dist/server').server

server.listen(8080, () => {
    console.log(`R server running on `, server.address())
})
