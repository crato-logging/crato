import writeToFile from "./write_to_file.js";

function createQueue(maxSize) {
  let queue = [];
  let size = 0;

  const Queue = {
    add(message) {
      queue.push(message);
      size += 1;
      this.checkSize();
    },

    checkSize() {
      if (size >= maxSize) this.flush();
    },

    flush() {
      const logsArr = [...queue];
      this.clear();
      writeToFile(logsArr);
    },

    clear() {
      queue = [];
      size = 0;
    }
  };

  return Object.create(Queue);
}
export default createQueue;
