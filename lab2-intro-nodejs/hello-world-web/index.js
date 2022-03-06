const http = require('http')
const url = require('url')
const PORT = 3100

// create an HTTP server that handles HTTP requests; it is handed two parameters: the request and response objects
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        // get all query parameters from the URL
        const query = url.parse(req.url, true).query
        // return the HTTP response; use the value of the name parameter if it was provided, or use World if it was not
        res.setHeader('Content-Type', 'text/html');
        res.end(`Hello ${query.name ? query.name : "World"}`)
    }
})
server.listen(PORT);
console.log(`HTTP Server is listening at port ${PORT} for HTTP GET requests`)

