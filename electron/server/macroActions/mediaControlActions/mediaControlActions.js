const { keyboard, Key } = require("@nut-tree/nut-js");

async function mediaControlsActions(plugin) {
  console.log("Async Media Controls function:", plugin.action.displayText);
  const action = plugin.action.pluginAction;
  console.log({ action });

  await new Promise(resolve => {
    keyboard.pressKey(Key[action]);
    keyboard.releaseKey(Key[action]);
    resolve();
  });

  console.log(
    "Async Media Controls function completed:",
    plugin.action.displayText
  );
}

module.exports = { mediaControlsActions };
