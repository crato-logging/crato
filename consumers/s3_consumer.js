import kafka from "kafka-node";

const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_HOST + ':29092' });

const fetchReqPayload = [
  {
    topic: "jsonlogs",
    partition: 0
  }
];

const options = {
  fromOffset: "latest",
  encoding: "utf8",
  groupId: "archive-group",
  autoCommitIntervalMs: 5000,
  fetchMaxWaitMs: 100,
  fetchMinBytes: 1,
  fetchMaxBytes: 1024 * 1024,
  encoding: "utf8"
};

const s3Consumer = new Consumer(client, fetchReqPayload, [
  { autoCommit: false },
  options
]);

export default s3Consumer;
