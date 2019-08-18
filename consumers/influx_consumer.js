import kafka from "kafka-node";

const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: "kafka:29092,kafka2:29092,kafka3:29092" });

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
