const electron = require("electron");
const { ipcMain } = electron;

const { profiles } = require("./profiles/profiles");
const { pages } = require("./pages/pages");

const databaseMap = {
  pages: {
    getByProfileId: pages.readByProfileId
  },

  profile: {
    get: profiles.read,
    getById: profiles.getById,
    updateById: profiles.updateById,
    removeById: profiles.removeById
  }
};

const initSQL = async () => {
  ipcMain.on("SQLite", async (event, request) => {
    try {
      const resData = await databaseMap[request.type][request.action](
        request.data || undefined
      );

      event.reply(resData.type, {
        action: request.returnAction,
        data: resData.data
      });
    } catch (error) {
      console.log(34, error);
    }
  });
};

module.exports = initSQL;
