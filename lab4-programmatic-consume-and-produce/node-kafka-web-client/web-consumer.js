const http = require('http')
const consumer = require('./consume')
const PORT = 3002

// create an HTTP server that handles HTTP requests; it is handed two parameters: the request and response objects
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {       
        // return the HTTP response; 
        res.setHeader('Content-Type', 'application/json');
        res.end ( JSON.stringify(consumer.getMessages()))        
    }
})
server.listen(PORT);
console.log(`HTTP Server is listening at port ${PORT} for HTTP GET requests`)

