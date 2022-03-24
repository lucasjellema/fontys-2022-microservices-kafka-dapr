const Kafka = require("node-rdkafka"); // see: https://github.com/blizzard/node-rdkafka
const externalConfig = require('./config').config;

const CONSUMER_GROUP_ID = "iot-platform-consumer"+new Date().getTime() // only use a static consumer_group_id once all messages are persisted in the IoT Platform microservice

const kafkaConf = {
     "group.id": CONSUMER_GROUP_ID, 
    "metadata.broker.list": externalConfig.KAFKA_BROKERS,
    "socket.keepalive.enable": true,
    "debug": "generic,broker,security"
};

const topics = [externalConfig.KAFKA_TOPIC];

let messageHandler // a reference to a function that wants to handle each message received
const setMessageHandler = function (messageHandlingFunction) {
    messageHandler = messageHandlingFunction
}

function initializeConsumer() {
    const stream = new Kafka.KafkaConsumer.createReadStream(kafkaConf, { "auto.offset.reset": "earliest" }, {
        topics: topics
    });
    stream.on('data', function (message) {
        console.log(`Consumed message on Stream: ${message.value.toString()}`);
        if (messageHandler) messageHandler(message)
        // the structure of the messages is as follows:
        //   {
        //     value: Buffer.from('hi'), // message contents as a Buffer
        //     size: 2, // size of the message, in bytes
        //     topic: 'librdtesting-01', // topic the message comes from
        //     offset: 1337, // offset the message was read from
        //     partition: 1, // partition the message was on
        //     key: 'someKey', // key of the message if present
        //     timestamp: 1510325354780 // timestamp of message creation
        //   }
    });

    console.log(`Stream consumer created to consume (from the beginning) from topic ${topics}`);

    stream.consumer.on("disconnected", function (arg) {
        console.log(`The stream consumer has been disconnected`)
        process.exit();
    });
}
module.exports = { setMessageHandler, initializeConsumer };