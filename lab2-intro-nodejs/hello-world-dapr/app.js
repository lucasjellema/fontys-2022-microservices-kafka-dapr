const DaprClient = require("dapr-client").DaprClient;

const http = require('http')
const url = require('url')

const daprHost = "127.0.0.1";
const daprPort = process.env.DAPR_HTTP_PORT || "3500";
const client = new DaprClient(daprHost, daprPort);

const serviceStoreName = "statestore";
var app_instance_id = 0

const PORT = process.env.APP_PORT || "3100"

// create an HTTP server that handles HTTP requests; it is handed two parameters: the request and response objects
const server = http.createServer( async (req, res) => {
    if (req.method === 'GET') {
        // get all query parameters from the URL
        const query = url.parse(req.url, true).query
        // return the HTTP response; use the value of the name parameter if it was provided, or use World if it was not
        res.setHeader('Content-Type', 'text/html');
        let key = query.name ? query.name : "World"
        let keyOccurrenceCount = await retrieveIncrementSave(key);
        res.end(`Hello ${key} from Application Instance ${app_instance_id} - greeting #${keyOccurrenceCount}`)
    }
})
server.listen(PORT);
determineAppInstanceId();
console.log(`HTTP Server is listening at port ${PORT} for HTTP GET requests`)


async function determineAppInstanceId() {
    app_instance_id = await retrieveIncrementSave("instance-sequence-number");
    console.log(`HelloWorld application with instance id ${app_instance_id} reports for duty`)    
}


async function retrieveIncrementSave(key) {
    let value = 0;
    let response = await client.state.get(serviceStoreName, key );
    if (!response) {
        value = 1;
    } else {
        value = parseInt(response) + 1;
    }
    response = await client.state.save(serviceStoreName, [
        {
            key: key,
            value: `${value}`
        }
    ]);
    return value;
}