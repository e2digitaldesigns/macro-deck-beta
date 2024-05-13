const express = require("express");
const { v4: uuidv4 } = require("uuid");
const timestamp = require("time-stamp");

const {
  connectSQL
} = require("../../../../listeners/databaseSql/utils/connect");

const createEmptyProfile = async () => {
  const database = await connectSQL();
  const profileName = "New Profile";
  const buttonPads = 6;

  try {
    const profileId = uuidv4();
    const pageId = uuidv4();
    const pageOrder = Number(timestamp("YYYYMMDDmmssms"));
    const buttonPadId = uuidv4();
    const actionId = uuidv4();

    await database.run(
      "INSERT INTO profiles (`_id`, `profileName`, `buttonPads`) VALUES (?, ?, ?)",
      [profileId, profileName, buttonPads]
    );

    await database.run(
      "INSERT INTO pages (`_id`, `profileId`, `order`) VALUES (?, ?, ?)",
      [pageId, profileId, pageOrder]
    );

    await database.run(
      "INSERT INTO buttonPads (`_id`, `profileId`, `pageId`, `buttonPadNum`) VALUES (?, ?, ?, ?)",
      [buttonPadId, profileId, pageId, 1]
    );

    await database.run(
      "INSERT INTO actions (`_id`, `profileId`, `pageId`, `buttonPadId`, `action`, `subAction`) VALUES (?, ?, ?, ?, ?, ?)",
      [actionId, profileId, pageId, buttonPadId, "md", "mdHome"]
    );

    return {
      success: 1,
      error: 0,
      profile: { _id: profileId, profileName, buttonPads },
      page: { _id: pageId, profileId, order: pageOrder },
      buttonPad: { _id: buttonPadId, profileId, pageId },
      action: { _id: actionId, profileId, pageId, buttonPadId }
    };
  } catch (error) {
    return { error: 1, errorMessage: error };
  }
};

module.exports.createEmptyProfile = createEmptyProfile;
