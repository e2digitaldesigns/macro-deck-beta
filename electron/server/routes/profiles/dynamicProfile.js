const express = require("express");
const { v4: uuidv4 } = require("uuid");
const timestamp = require("time-stamp");

const { connectSQL } = require("../../../listeners/databaseSql/utils/connect");

const profileEmpty = [
  {
    plugin: "md",
    pluginAction: "mdHome",
    displayText: "Home Screen",
    text: "Home",
    textColor: "#eeeeee",
    icon: "Home",
    iconColor: "#ffffff",
    bgColor: "#9147ff",
    buttonPadNum: 1
  }
];

const profileMD = [
  {
    plugin: "md",
    pluginAction: "mdHome",
    displayText: "Home Screen",
    text: "Home",
    textColor: "#ffffff",
    icon: "Home",
    iconColor: "#ffffff",
    bgColor: "#333333",
    buttonPadNum: 1
  },
  {
    plugin: "md",
    pluginAction: "mdProfileSelector",
    displayText: "Profile Selector",
    text: "Profile Selector",
    textColor: "#ffffff",
    icon: "FileText",
    iconColor: "#ffffff",
    bgColor: "#333333",
    buttonPadNum: 2
  },
  {
    plugin: "md",
    pluginAction: "mdReset",
    displayText: "Reset",
    text: "Reset",
    textColor: "#ffffff",
    icon: "RefreshCw",
    iconColor: "#ffffff",
    bgColor: "#333333",
    buttonPadNum: 3
  },
  {
    plugin: "md",
    pluginAction: "mdSettings",
    displayText: "Settings",
    text: "Settings",
    icon: "Settings",
    iconColor: "#ffffff",
    textColor: "#ffffff",
    bgColor: "#333333",
    buttonPadNum: 4
  }
];

const profileStream = [
  {
    plugin: "obs",
    pluginAction: "obsStreamToggle",
    displayText: "Go Live",
    text: "Go Live",
    textColor: "#eeeeee",
    icon: "Twitch",
    iconColor: "#ffffff",
    bgColor: "#9147ff",
    buttonPadNum: 1
  },
  {
    plugin: "obs",
    pluginAction: "obsRecordToggle",
    displayText: "Record",
    text: "Record",
    textColor: "#eeeeee",
    icon: "PlayCircle",
    iconColor: "#ffffff",
    bgColor: "#ff0000",
    buttonPadNum: 2
  },
  {
    plugin: "obs",
    pluginAction: "obsSceneChange",
    pluginData: "sceneName",
    displayText: "Starting",
    text: "Starting",
    textColor: "#eeeeee",
    icon: "Image",
    iconColor: "#aaaaaa",
    bgColor: "#222222",
    buttonPadNum: 3
  },
  {
    plugin: "obs",
    pluginAction: "obsSceneChange",
    pluginData: "sceneName",
    displayText: "Be Right Back",
    text: "Be Right Back",
    textColor: "#eeeeee",
    icon: "Image",
    iconColor: "#aaaaaa",
    bgColor: "#222222",
    buttonPadNum: 4
  },
  {
    plugin: "obs",
    pluginAction: "obsSceneChange",
    pluginData: "sceneName",
    displayText: "Ending",
    text: "Ending",
    textColor: "#eeeeee",
    icon: "Image",
    iconColor: "#aaaaaa",
    bgColor: "#222222",
    buttonPadNum: 5
  }
];

const profileMediaControls = [
  {
    plugin: "mc",
    pluginAction: "AudioPrev",
    displayText: "Prev",
    text: "Prev",
    textColor: "#eeeeee",
    icon: "ArrowLeftCircle",
    iconColor: "#ffffff",
    bgColor: "#9147ff",
    buttonPadNum: 1
  },
  {
    plugin: "mc",
    pluginAction: "AudioStop",
    displayText: "Stop",
    text: "Stop",
    textColor: "#eeeeee",
    icon: "StopCircle",
    iconColor: "#ffffff",
    bgColor: "#9147ff",
    buttonPadNum: 2
  },
  {
    plugin: "mc",
    pluginAction: "AudioPause",
    displayText: "Pause",
    text: "Pause",
    textColor: "#eeeeee",
    icon: "StopCircle",
    iconColor: "#ffffff",
    bgColor: "#222222",
    buttonPadNum: 3
  },
  {
    plugin: "mc",
    pluginAction: "AudioPlay",
    displayText: "Play",
    text: "Play",
    textColor: "#eeeeee",
    icon: "PlayCircle",
    iconColor: "#ffffff",
    bgColor: "#222222",
    buttonPadNum: 4
  },
  {
    plugin: "mc",
    pluginAction: "AudioNext",
    displayText: "Next",
    text: "Next",
    textColor: "#eeeeee",
    icon: "ArrowRightCircle",
    iconColor: "#ffffff",
    bgColor: "#9147ff",
    buttonPadNum: 5
  },
  {
    plugin: "mc",
    pluginAction: "AudioMute",
    displayText: "Mute",
    text: "Mute",
    textColor: "#eeeeee",
    icon: "VolumeX",
    iconColor: "#ffffff",
    bgColor: "#333333",
    buttonPadNum: 6
  },
  {
    plugin: "mc",
    pluginAction: "AudioVolDown",
    displayText: "Volume Down",
    text: "Volume Down",
    textColor: "#eeeeee",
    icon: "Volume1",
    iconColor: "#ffffff",
    bgColor: "#333333",
    buttonPadNum: 7
  },
  {
    plugin: "mc",
    pluginAction: "AudioVolUp",
    displayText: "Volume Up",
    text: "Volume Up",
    textColor: "#eeeeee",
    icon: "Volume2",
    iconColor: "#ffffff",
    bgColor: "#333333",
    buttonPadNum: 8
  }
];

const profileDefaults = {
  profileEmpty: {
    name: "New Profile",
    buttonPadCount: 15,
    buttonPads: profileEmpty
  },
  profileMD: { name: "MacroDeck", buttonPadCount: 15, buttonPads: profileMD },
  profileStream: {
    name: "Streaming",
    buttonPadCount: 15,
    buttonPads: profileStream
  },
  profileMediaControls: {
    name: "Media Controls",
    buttonPadCount: 15,
    buttonPads: profileMediaControls
  }
};

const dynamicProfile = async type => {
  const database = await connectSQL();

  const defaultValues = profileDefaults[type];
  const profileName = defaultValues.name;
  const buttonPads = defaultValues.buttonPadCount;

  try {
    const profileId = uuidv4();
    const profileOrder = Number(timestamp("YYYYMMDDmmssms"));
    const pageId = uuidv4();
    const pageOrder = Number(timestamp("YYYYMMDDmmssms"));

    const buttonPadArray = [];
    const actionArray = [];

    profileDefaults[type].buttonPads.forEach(row => {
      const buttonPadId = uuidv4();
      const actionId = uuidv4();

      buttonPadArray.push([
        buttonPadId,
        profileId,
        pageId,
        row.buttonPadNum,
        row.bgColor,
        row.icon,
        row.iconColor,
        row.text,
        row.textColor
      ]);

      const thisAction = {
        plugin: row.plugin,
        pluginAction: row.pluginAction,
        displayText: row.displayText
      };

      if (row.pluginData) {
        thisAction.pluginData = row.pluginData;
      }

      actionArray.push([
        actionId,
        profileId,
        pageId,
        buttonPadId,
        JSON.stringify(thisAction)
      ]);
    });

    await database.run(
      "INSERT INTO profiles (`_id`, `order`, `profileName`, `buttonPads`) VALUES (?, ?, ?, ?)",
      [profileId, profileOrder, profileName, buttonPads]
    );

    await database.run(
      "INSERT INTO pages (`_id`, `profileId`, `order`) VALUES (?, ?, ?)",
      [pageId, profileId, pageOrder]
    );

    for (const rowValues of buttonPadArray) {
      await database.run(
        "INSERT INTO buttonPads (`_id`, `profileId`, `pageId`, `buttonPadNum`, `bgColor`, `icon`, `iconColor`, `text`, `textColor`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [...rowValues]
      );
    }

    for (const rowValues of actionArray) {
      await database.run(
        "INSERT INTO actions (`_id`, `profileId`, `pageId`, `buttonPadId`, `data`) VALUES (?, ?, ?, ?, ?)",
        [...rowValues]
      );
    }

    return {
      success: 1,
      error: 0,
      profile: { _id: profileId, profileName, buttonPads }
    };
  } catch (error) {
    return { error: 1, errorMessage: error };
  }
};

module.exports.dynamicProfile = dynamicProfile;
