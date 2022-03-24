const http = require('http')
const url = require('url')
const producer = require('./produce')
const PORT = 3001

// create an HTTP server that handles HTTP requests; it is handed two parameters: the request and response objects
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        // get all query parameters from the URL
        const query = url.parse(req.url, true).query
        if (query.message) {
        console.log(`Message received in the HTTP Request ${query.message}`)
        producer.produceMessage(query.message)
        // return the HTTP response; use the value of the name parameter if it was provided, or use World if it was not
        res.setHeader('Content-Type', 'text/html');
        res.end(`Message ${query.message} has been produced`)
        }
        else {
            res.setHeader('Content-Type', 'text/html');
            res.end(`No message query parameter was found`)
        }
    }
})
server.listen(PORT);
console.log(`HTTP Server is listening at port ${PORT} for HTTP GET requests`)