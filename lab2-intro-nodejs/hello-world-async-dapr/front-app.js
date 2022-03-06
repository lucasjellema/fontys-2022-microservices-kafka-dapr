const DaprClient = require("dapr-client").DaprClient;
const CommunicationProtocolEnum = require("dapr-client").CommunicationProtocolEnum
const http = require('http')
const url = require('url')

const PORT = process.env.APP_PORT || "3200"
const daprHost = "127.0.0.1"; 
const daprPort = process.env.DAPR_HTTP_PORT ;

const PUBSUB_NAME = "pubsub"
const TOPIC_NAME  = "names"
const client = new DaprClient(daprHost, daprPort, CommunicationProtocolEnum.HTTP)

const serviceStoreName = "statestore";

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url !== '/dapr/config') { // note: the first GET request sent to the application is from the sidecar at path /dapr/config; we do not currently have a proper implementation for that path
        const query = url.parse(req.url, true).query
        let key = query.name ? query.name : "World"
        let text
 
        if (key != null) {
            try {
                await client.pubsub.publish(PUBSUB_NAME, TOPIC_NAME, key); // publish the name to the pubsub topic
                console.log(`Published name ${key} to topic ${TOPIC_NAME}`)
                let value = 0;
                let response = await client.state.get(serviceStoreName, key ); // try to find entry in statestore with this key
                if (!response) {
                    value = 1; // if it was not found, the name is now mentioned for the first time
                } else {
                    value = parseInt(response) + 1; // if it was found, the response indicates how many times before now the name was mentioned
                }
                text = `Hello ${key} - greeting #${value}`
            } catch (e) { text = `Exception occurred ${e}` }
        }

        res.setHeader('Content-Type', 'text/html');
        res.end(text)
    }
})

server.listen(PORT);
console.log(`HTTP Server is listening at port ${PORT} for HTTP GET requests`)

