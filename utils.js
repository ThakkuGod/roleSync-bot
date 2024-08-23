const path = require('node:path');
const fs = require('node:fs')

module.exports = {
  getAllFiles: (directory, foldersOnly = false) => {
    let fileNames = [];

    const files = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(directory, file.name);

      if (foldersOnly) {
        if (file.isDirectory()) {
          fileNames.push(filePath);
        }
      } else {
        if (file.isFile()) {
          fileNames.push(filePath);
        }
      }
    }
    return fileNames;
  },

  cleanObject: (obj) => {
    const filteredObj = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        filteredObj[key] = obj[key];
      }
    }
    return filteredObj;
  },
};
