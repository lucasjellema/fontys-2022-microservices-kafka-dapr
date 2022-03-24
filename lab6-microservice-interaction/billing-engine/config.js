//Configuration Details for the Kafka Brokers and Topic
const config = {
    // If you added kafka-1, kafka-2 and/or kafka-3 to the hosts file mapped to the IP address of the Docker Host machine, then you can work with these Broker Endpoints
    KAFKA_BROKERS: "kafka-1:19092,kafka-2:29093,kafka-3:29094"
    //KAFKA_BROKERS: "localhost:29092,localhost:29093,localhost:29094"    // If you did not (add kafka to the hosts file) you need to uncomment this next line, comment out the previous line and make sure the right IP address is used
    //KAFKA_BROKERS: "192.168.188.110:19092,192.168.188.110:19093,192.168.188.110:19094" 
    , KAFKA_PRODUCE_TOPIC: "questions-topic"
    , KAFKA_CONSUME_TOPICS: ["workflow-queue", "answers-topic"]

};
module.exports = { config };