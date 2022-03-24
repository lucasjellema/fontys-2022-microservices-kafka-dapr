//Configuration Details for the Kafka Brokers and Topic
const config = {
    // Specify the endpoints of the CloudKarafka Servers for your instance found under Connection Details on the Instance Details Page
    // this looks like this: moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094"
    "metadata.broker.list": "rocket-01.srvs.cloudkafka.com:9094,rocket-02.srvs.cloudkafka.com:9094,rocket-03.srvs.cloudkafka.com:9094"
    , "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "xa1ds2jz",
    "sasl.password": "ZoEVTK7_b50L3IvtjuosICGRpurA56TY" 
    , KAFKA_TOPIC: "xa1ds2jz-Test-Topic"
};
module.exports = { config };
