import { Consumer, EachMessageHandler, Kafka, Producer } from "kafkajs";

let consumer: Consumer | null = null;
let producer: Producer | null = null;

const KAFKA_BROKERS = process.env.KAFKA_BROKERS
  ? process.env.KAFKA_BROKERS.split(",")
  : [];

const kafka = new Kafka({
  clientId: "monopoly-controller",
  brokers: KAFKA_BROKERS,
});

export const connectKafkaConsumer = async () => {
  consumer = kafka.consumer({ groupId: "monopoly-controller-group" });
  await consumer.connect();
  return consumer;
};

export const getConsumer = () => {
  if (!consumer) {
    throw new Error("Consumer not available!");
  }
  return consumer;
};

export const subscribeTopic = async (
  topic: string,
  eachMessageHandler: EachMessageHandler | undefined = undefined
) => {
  const consumer = getConsumer();
  await consumer.stop();
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({
    eachMessage: eachMessageHandler,
  });
};

export const connectKafkaProducer = async () => {
  producer = kafka.producer();
  await producer.connect();
  return producer;
};

export const getProducer = () => {
  if (!producer) {
    throw new Error("Producer not available!");
  }
  return producer;
};

export const sendTopic = async (topic: string, message: any = {}) => {
  const producer = getProducer();
  return producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};
