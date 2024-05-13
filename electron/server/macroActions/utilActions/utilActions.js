const axios = require("axios");
const exec = require("child_process").execFile;

async function utilActions(plugin) {
  const utAPI = pluginData =>
    new Promise(resolve => {
      axios.get(pluginData.url);
      resolve();
    });

  const utDelay = pluginData =>
    new Promise(resolve => setTimeout(resolve, pluginData.seconds * 1000));

  const utExe = pluginData =>
    new Promise(resolve => {
      exec(pluginData.filepath);
      resolve();
    });

  const utSound = pluginData =>
    new Promise(resolve => {
      plugin.mainWindow.webContents.send("MacroDeck:playSound", {
        path: pluginData.filepath,
        volume: pluginData.volume
      });
      resolve();
    });

  const actions = { utAPI, utDelay, utExe, utSound };

  return actions[plugin.action.pluginAction](plugin.action.pluginData);
}

module.exports = { utilActions };
