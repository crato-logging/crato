import fs from "fs";

const writeToFile = queue => {
  //fs.appendFile(`./log_files/log_data_${fileNum}.json`, jsonStr + "\n", err => {
  //  if (err) {
  //    console.log("Error write to file", err);
  //  } else {
  //    console.log("SUCCESS: Message written to file");
  //    size += 1;
  //    if (size >= MAX) {
  //      sendToS3(fileNum);
  //      size = 0;
  //      fileNum += 1;
  //    }
  //  }
  //});

  const d = new Date();
  const date = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
  const filePath = `../log_files/${Date.now()}_${date}_log_data.json`;
  console.log(filePath);

  const content = queue
    .map(message => {
      return JSON.parse(message);
    })
    .join("\n");

  fs.writeFile(
    `./log_files/${Date.now()}_${date}_log_data.json`,
    JSON.stringify(content),
    err => {
      if (err) {
        console.log("Error encountered while writing file");
      }
    }
  );
};

export default writeToFile;
