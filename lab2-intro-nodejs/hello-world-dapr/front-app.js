const fetch = require('node-fetch');
const http = require('http')
const url = require('url')

const PORT = process.env.APP_PORT || "3200"
const NODEAPP_DAPR_SIDECAR_PORT = process.env.NODE_APP_DAPR_PORT
const serviceAppId = "nodeapp";
// when nodeapp is invoked through the front-app's own side car, we run into ERR_DIRECT_ERROR; that is why there is this less logical call to the nodeapp's sidecar
let getURL = `http://localhost:${NODEAPP_DAPR_SIDECAR_PORT}/v1.0/invoke/${serviceAppId}/method/?name=`

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url !== '/dapr/config') { // note: the first GET request sent to the application is from the sidecar at path /dapr/config; we do not currently have a proper implementation for that path
        const query = url.parse(req.url, true).query
        let key = query.name ? query.name : "World"
        let text
 
        if (key != null) {
            try {
                const response = await fetch(getURL+key); // call to the nodeapp service through its sidecar
                text = await response.text()
            } catch (e) { text = `Exception occurred ${e}` }
        }

        res.setHeader('Content-Type', 'text/html');
        res.end(text)
    }
})

server.listen(PORT);
console.log(`HTTP Server is listening at port ${PORT} for HTTP GET requests`)

