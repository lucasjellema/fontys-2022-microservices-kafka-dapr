const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:29092', 'localhost:29093']
})

const producer = kafka.producer()

const produceMessage = async (message) =>  { 
await producer.connect()
await producer.send({
  topic: 'test-topic',
  messages: [
    {key:"2", value: message },
  ],
})

await producer.disconnect()
}

const consumeMessage = async () => { 
const consumer = kafka.consumer({ groupId: 'test-group' })

await consumer.connect()
await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      value: message.value.toString(),
    })
  },
})
}

produceMessage(`Here I am telling you a story`)