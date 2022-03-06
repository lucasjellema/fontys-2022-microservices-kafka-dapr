//dependencies
const DaprClient = require("dapr-client").DaprClient;
const CommunicationProtocolEnum = require("dapr-client").CommunicationProtocolEnum;

const daprHost = "127.0.0.1"; 
const daprPort = process.env.DAPR_HTTP_PORT ;

const PUBSUB_NAME = "pubsub"
const TOPIC_NAME  = "orders"
const client = new DaprClient(daprHost, daprPort, CommunicationProtocolEnum.HTTP)

var main = function() {
    for(var i=0;i<10;i++) {
        sleep(5000);
        var orderId = Math.floor(Math.random() * (1000 - 1) + 1);
        start(orderId).catch((e) => {
            console.error(e);
            process.exit(1);
        });
    }
}

async function start(orderId) {
    console.log("Published data:" + orderId)
    //Using Dapr SDK to publish a topic
    await client.pubsub.publish(PUBSUB_NAME, TOPIC_NAME, orderId);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();
