// native
const path = require("path");

// packages
const colors = require("ansi-colors");
const fs = require("fs-extra");

// internal
const { google } = require("googleapis");
const { docToArchieML } = require("@newswire/doc-to-archieml");
const { sheetToData } = require("@newswire/sheet-to-data");
const config = require("../project.config.json");

module.exports = (resolve, reject) => {
  getData();
  resolve();
};

async function getData() {
  const auth = await google.auth.getClient({
    scopes: [
      "https://www.googleapis.com/auth/documents.readonly",
      "https://www.googleapis.com/auth/spreadsheets.readonly",
    ],
  });
  const { files } = config;
  for (const file of files) {
    const filepath = path.join("src/data", `${file.name}.json`);

    let data;
    let color;

    switch (file.type) {
      case "doc":
        data = await docToArchieML({ documentId: file.fileId, auth });
        color = "magenta";
        break;
      case "sheet":
        data = await sheetToData({ spreadsheetId: file.fileId, auth });
        color = "cyan";
        break;
      default:
        throw new Error(
          `No data fetching method found for type "${file.type}"`
        );
    }

    await fs.outputJson(filepath, data, { spaces: 2 });

    logDownload(file.name, file.fileId, color);
  }
}

function logDownload(fileName, fileId, color) {
  console.log(colors[color](`Downloaded \`${fileName}\` (${fileId})`));
}
