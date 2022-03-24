const Kafka = require("node-rdkafka"); // see: https://github.com/blizzard/node-rdkafka
const externalConfig = require('./config').config;

const CONSUMER_GROUP_ID = "node-consumer-two"

const kafkaConf = {
    "group.id": CONSUMER_GROUP_ID,
    "metadata.broker.list": externalConfig.KAFKA_BROKERS,
    "socket.keepalive.enable": true,
    "debug": "generic,broker,security"
};

const topics = [externalConfig.KAFKA_TOPIC];

var stream = new Kafka.KafkaConsumer.createReadStream(kafkaConf, { "auto.offset.reset": "earliest" }, {
    topics: topics
});

stream.on('data', function (message) {
    console.log(`Consumed message on Stream: ${message.value.toString()}`);
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

console.log(`Stream consumer created to consume from topic ${topics}`);

stream.consumer.on("disconnected", function (arg) {
    console.log(`The stream consumer has been disconnected`)
    process.exit();
});

// automatically disconnect the consumer after 30 seconds
setTimeout(function () {
    stream.consumer.disconnect();
}, 30000)