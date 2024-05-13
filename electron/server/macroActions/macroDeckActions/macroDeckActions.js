const actionObj = {
  mdHome: plugin => ({
    subAction: "mdHome"
  }),

  mdPage: action => ({
    subAction: "mdPage",
    pageNumber: action.pluginData.pageNumber
  }),

  mdProfile: action => ({
    subAction: "mdProfile",
    profile: action.pluginData.profileId
  }),

  mdProfileSelect: action => ({
    subAction: "mdProfileSelector"
  }),

  mdRefresh: action => ({
    subAction: "mdReset"
  }),

  mdSettings: action => ({
    subAction: "mdSettings"
  }),

  mdFullScreen: action => ({
    subAction: "mdFullScreen"
  }),

  mdFsToggle: action => ({
    subAction: "mdFsToggle"
  }),

  mdFsClose: action => ({
    subAction: "mdFsClose"
  })
};

async function macroDeckActions(plugin) {
  console.log("STARTED: Macro Deck function:", plugin.action);

  console.log(4343, actionObj[plugin.action.pluginAction](plugin.action));

  return new Promise(resolve => {
    plugin.io.emit("macroDeckerSocket", {
      action: "md",
      deviceId: plugin.deviceId,
      ...actionObj[plugin.action.pluginAction](plugin.action)
    });

    resolve();
  });
}

module.exports = { macroDeckActions };
