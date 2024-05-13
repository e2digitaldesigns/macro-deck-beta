const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const storage = require("electron-json-storage");
const databaseLocation = `${storage.getDataPath()}/database.db`;

const connectSQL = async () => {
  const database = await open({
    filename: databaseLocation,
    driver: sqlite3.Database
  })
    .then(async db => {
      return db;
    })
    .catch(err => {
      return null;
    });

  return database;
};

module.exports.connectSQL = connectSQL;
