const DaprServer = require("dapr-client").DaprServer;
const CommunicationProtocolEnum = require("dapr-client").CommunicationProtocolEnum;

//code
const daprHost = "127.0.0.1"; 
const daprPort = process.env.DAPR_HTTP_PORT ;
const serverHost = "127.0.0.1";
const serverPort = process.env.APP_PORT ; 
const PUBSUB_NAME = "pubsub"
const TOPIC_NAME  = "orders"

start().catch((e) => {
    console.error(e);
    process.exit(1);
});

async function start() {
    const server = new DaprServer(
        serverHost, 
        serverPort, 
        daprHost, 
        daprPort, 
        CommunicationProtocolEnum.HTTP
    );
    //Subscribe to a topic
    await server.pubsub.subscribe(PUBSUB_NAME, TOPIC_NAME, async (orderId) => { // function to be invoked whenever a message is received from the sidecar
        console.log(`Subscriber received: ${JSON.stringify(orderId)}`)
    });
    await server.start();
}