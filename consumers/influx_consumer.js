import kafka from "kafka-node";

const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: "35.183.71.251:9092" });

const fetchReqPayload = [
  {
    topic: "jsonlogs",
    partition: 0
  }
];

const options = {
  fromOffset: "latest",
  encoding: "utf8",
  groupId: "queriable-group"
};

const InfluxConsumer = new Consumer(client, fetchReqPayload, [
  { autoCommit: false },
  options
]);

export default InfluxConsumer;
