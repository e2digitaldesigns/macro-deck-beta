const express = require("express");
const router = express.Router();
const actionParser = require("../../macroActions/macroActions");

const { connectSQL } = require("../../../listeners/databaseSql/utils/connect");

router.get("/start", async (req, res) => {
  try {
    const data = await mobileProfileParser();

    res.json(data);
  } catch (error) {
    res.send(error);
  }
});

router.post("/actions", async (req, res) => {
  const io = req.app.get("socketio");
  const mainWindow = req.app.get("mainWindow");

  actionParser(io, req.body, mainWindow);
  res.send("hello");
});

router.get("/update", async (req, res) => {
  const io = req.app.get("socketio");

  try {
    const data = await mobileProfileParser();

    console.log(31, "macroDeckerSocketAutoUpdate");

    io.emit("macroDeckerSocketAutoUpdate", {
      action: "system",
      subAction: "dbUpdate",
      profiles: data
    });

    res.json(data);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;

async function mobileProfileParser() {
  const database = await connectSQL();

  const profiles = await database.all(
    "SELECT * FROM profiles ORDER BY `order` ASC"
  );
  const pages = await database.all("SELECT * FROM pages ORDER BY `order` ASC");
  const buttonPads = await database.all("SELECT * FROM buttonPads");

  const theButtonPads = buttonPads.map(buttonPad => {
    buttonPad.icon = buttonPad.icon === "NONE" ? null : buttonPad.icon;
    const newButtonPad = { ...buttonPad };
    return newButtonPad;
  });

  const mobileProfiles = profiles.map(profile => {
    const newProfile = { ...profile };
    newProfile.pages = pages.filter(page => page.profileId === profile._id);

    newProfile.pages.forEach(page => {
      const thebuttonPads = theButtonPads.filter(
        buttonPad => buttonPad.pageId === page._id
      );

      console.log(71, newProfile.buttonPads, newProfile.profileName);

      page.buttonPads = buttonPadParser(newProfile.buttonPads, thebuttonPads);
    });
    return newProfile;
  });

  return mobileProfiles;
}

function buttonPadParser(numberOfPads, buttonPads) {
  const defaultObj = {
    _id: "",
    bgColor: "",
    buttonPadNum: 1,
    icon: "",
    iconColor: "",
    image: null,
    pageId: "",
    profileId: "",
    text: "",
    textColor: ""
  };
  const defaultArray = new Array(numberOfPads).fill(null).map((_, index) => ({
    ...defaultObj,
    buttonPadNum: index + 1,
    _id: index + "11"
  }));

  const combinedButtonPads = [...buttonPads, ...defaultArray];

  const finalSet = combinedButtonPads.filter(
    (obj, index, self) =>
      index ===
      self.findIndex(
        t =>
          t.buttonPadNum === obj.buttonPadNum && t.buttonPadNum <= numberOfPads
      )
  );

  finalSet.sort((a, b) => a.buttonPadNum - b.buttonPadNum);

  return finalSet;
}
