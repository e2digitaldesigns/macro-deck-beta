const OBSWebSocket = require("obs-websocket-js").default;
const { connectSQL } = require("../../../listeners/databaseSql/utils/connect");

async function obsConnection(obs) {
  const database = await connectSQL();
  const obsSettings = await database.all("SELECT * FROM plugins_obs");

  const { ipAddress, password, port } = obsSettings[0];

  await obs.connect(`ws://${ipAddress}:${port}`, password || "");
}

async function obsActions(plugin) {
  console.log("Async OBS function:", plugin.action.displayText);

  const obs = new OBSWebSocket();

  await obsConnection(obs);

  try {
    const obs = new OBSWebSocket();
    await obsConnection(obs);

    switch (plugin.action.pluginAction) {
      case "obsLayerToggle":
        const { sceneName, sceneItemId } = plugin.action.pluginData;

        const { sceneItemEnabled } = await obs.call("GetSceneItemEnabled", {
          sceneName,
          sceneItemId: Number(sceneItemId)
        });

        await obs.call("SetSceneItemEnabled", {
          sceneName,
          sceneItemId: Number(sceneItemId),
          sceneItemEnabled: !sceneItemEnabled
        });

        break;

      case "obsLayerHide":
        await obs.call("SetSceneItemEnabled", {
          sceneName: plugin.action.pluginData.sceneName,
          sceneItemId: Number(plugin.action.pluginData.sceneItemId),
          sceneItemEnabled: false
        });
        break;

      case "obsLayerShow":
        console.log(52, "scene", plugin.action.pluginData.sceneName);
        console.log(53, "item", plugin.action.pluginData.sceneItemId);

        await obs.call("SetSceneItemEnabled", {
          sceneName: plugin.action.pluginData.sceneName,
          sceneItemId: Number(plugin.action.pluginData.sceneItemId),
          sceneItemEnabled: true
        });
        break;

      case "obsSceneChange":
        await obs.call("SetCurrentProgramScene", {
          sceneName: plugin.action.pluginData.sceneName
        });
        break;

      case "obsRecordToggle":
        await obs.call("ToggleRecord");
        break;

      case "obsRecordStart":
        await obs.call("StartRecord");
        break;

      case "obsRecordStop":
        await obs.call("StopRecord");
        break;

      case "obsRecordPause":
        await obs.call("PauseRecord");
        break;

      case "obsRecordResume":
        await obs.call("ResumeRecord");
        break;

      case "obsStreamToggle":
        await obs.call("ToggleStream");
        break;

      case "obsStreamStart":
        await obs.call("StartStream");
        break;

      case "obsStreamStop":
        await obs.call("StopStream");
        break;

      default:
        break;
    }

    await obs.disconnect();
  } catch (error) {}
}

module.exports = { obsActions };
