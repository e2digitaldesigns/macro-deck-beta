const electron = require("electron");
const database = require("./database/database");
const dialogueBox = require("./dialogueBox/dialogueBox");
const header = require("./header/header");
const settings = require("./settings/settings");
const initSQL = require("./databaseSql/databaseSql");
const mdSettings = require("./mdSettings/mdSettings");
const { ipcMain } = electron;

const listeners = (io, mainWindow) => {
  mdSettings(io);
  database(io);
  dialogueBox(mainWindow);
  header(mainWindow);
  settings(mainWindow);
  ipcMain.on("ping", (e, data) => console.log(data));

  initSQL();
};

module.exports.listeners = listeners;
