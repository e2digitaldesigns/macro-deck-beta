const fs = require("fs");
const { connectSQL } = require("../../listeners/databaseSql/utils/connect");

const { macroDeckActions } = require("./macroDeckActions/macroDeckActions");

const { utilActions } = require("./utilActions/utilActions");

const {
  mediaControlsActions
} = require("./mediaControlActions/mediaControlActions");

const { obsActions } = require("./obsActions/obsActions");

const functionObj = {
  md: macroDeckActions,
  mc: mediaControlsActions,
  obs: obsActions,
  ut: utilActions
};

const actionParser = async (io, data, mainWindow) => {
  console.log("xxxxx xxxxx xxxxx xxxxx");
  console.log("xxxxx xxxxx xxxxx xxxxx");
  console.log("xxxxx xxxxx xxxxx xxxxx");

  const database = await connectSQL();

  try {
    const actions = await database.all(
      "SELECT * FROM actions WHERE buttonPadId = ?",
      data._id
    );

    const actionData = actions.map(action => {
      const newAction = { ...action };
      newAction.data = JSON.parse(action.data);
      return newAction;
    });

    const actionInitArray = [];

    actionData.forEach(async ({ data: action }) => {
      console.log(action.pluginAction);
      actionInitArray.push({
        fn: functionObj[action.plugin],
        arg: { action, io, mainWindow, deviceId: data.deviceId }
      });
    });

    for (const { fn, arg } of actionInitArray) {
      await fn(arg);
    }

    console.log("xxxxx xxxxx xxxxx xxxxx");
    console.log("xxxxx xxxxx xxxxx xxxxx");
    console.log("xxxxx xxxxx xxxxx xxxxx");
  } catch (error) {
    console.log(253, error);
  }
};

module.exports = actionParser;
