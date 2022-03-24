const Kafka = require("node-rdkafka"); // see: https://github.com/blizzard/node-rdkafka
const externalConfig = require('./config').config;


const CONSUMER_GROUP_ID = "node-consumer-one"

const kafkaConf = {
    "group.id": CONSUMER_GROUP_ID,
    "metadata.broker.list": externalConfig.KAFKA_BROKERS,
    "socket.keepalive.enable": true,
    "debug": "generic,broker,security"
};

const topics = [externalConfig.KAFKA_TOPIC];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
    "auto.offset.reset": "earliest"  // [smallest, earliest, beginning] or [largest, latest, end] , error ; see: https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md
});


const numMessages = 5;
let counter = 0;
consumer.on("error", function (err) {
    console.error("error " + err);
});
consumer.on("ready", function (arg) {
    console.log(`Consumer ${arg.name} ready to consume from topic ${topics}`);
    consumer.subscribe(topics);
    consumer.consume();
});
consumer.on("data", function (m) {
    // every time a message is consumed from one of the topics, this handler is invoked
    counter++;
    if (counter % numMessages === 0) {
        console.log("calling commit");
        consumer.commit(m);
    }
    // unpack the value from a message and stringify it in order to write to the console.
    console.log(m.value.toString());
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

consumer.on('event.error', function (err) {
    console.error("event error: " + err);
    process.exit(1);
});
consumer.on('event.log', function (log) {
    // uncomment the next line if you want to see a log message every step of the way
    //console.log(log);
});
consumer.connect();

//automatically disconnect the consumer after 30 seconds
setTimeout(function () {
    consumer.disconnect();
}, 300000)

