import fs from "fs";

const writeToFile = (fileName, content) => {
  const filePath = `./log_files/${fileName}`;

  fs.writeFile(filePath, JSON.stringify(content, null, 1), "utf8", err => {
    if (err) {
      console.log("Error encountered while writing file");
    } else {
      console.log("New file written: " + filePath);
    }
  });
};

export default writeToFile;
