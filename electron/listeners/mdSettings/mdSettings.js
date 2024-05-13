const electron = require("electron");
const { ipcMain } = electron;

const { connectSQL } = require("../databaseSql/utils/connect");
const fetchIPAddress = require("../../utils/fetchIPAddress");

const getSettings = async () => {
  try {
    const database = await connectSQL();
    const settings = await database.all("SELECT * FROM settings");
    const ipAddress = fetchIPAddress();
    const port = settings[0].md_port;

    const settingsObj = {
      baseUrl: `http://${ipAddress}:${port}/api/v1/`,
      ipAddress,
      port
    };

    return settingsObj;
  } catch (error) {
    return null;
  }
};

const mdSettings = async io => {
  ipcMain.on("fetchMDSettings", async (event, data) => {
    console.log(6, data);

    const settings = await getSettings();

    console.log(7, "settings fired");

    event.reply("fetchMDSettings:return", settings);
  });
};

module.exports = mdSettings;
