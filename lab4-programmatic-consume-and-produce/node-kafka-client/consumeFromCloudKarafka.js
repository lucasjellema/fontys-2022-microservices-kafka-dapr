const Kafka = require("node-rdkafka"); 
const CONSUMER_GROUP_ID = "node-consumer-one"

const kafkaConfig = {
    // Specify the endpoints of the CloudKarafka Servers for your instance found under Connection Details on the Instance Details Page
    "metadata.broker.list": "rocket-01.srvs.cloudkafka.com:9094,rocket-02.srvs.cloudkafka.com:9094,rocket-03.srvs.cloudkafka.com:9094"
    , "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "xa1daaa",
    "sasl.password": "ZoEASK7_b5" ,
    "group.id": CONSUMER_GROUP_ID
};

const KAFKA_TOPIC= "xa1daaaa-Test-Topic"
const topics = [KAFKA_TOPIC];

var stream = new Kafka.KafkaConsumer.createReadStream(kafkaConfig, { "auto.offset.reset": "earliest" }, {
    topics: topics
});

stream.on('data', function (message) {
    console.log(`Consumed message on Stream: ${message.value.toString()}`);
   
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