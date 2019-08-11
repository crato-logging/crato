import fs from "fs";

const writeToFile = queue => {
  const d = new Date();
  const date = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
  const filePath = `../log_files/${Date.now()}_${date}_log_data.json`;
  console.log(filePath);

  const content = queue.join("\n");

  fs.writeFile(
    `./log_files/${Date.now()}_${date}_log_data.json`,
    JSON.stringify(content, null, 1),
    "utf8",
    err => {
      if (err) {
        console.log("Error encountered while writing file");
      }
    }
  );
};

export default writeToFile;
