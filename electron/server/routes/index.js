const express = require("express");
const mobile = require("./mobile/mobile");

module.exports = function (app) {
  const prefix = "/api/v1/";

  app.use(express.json());
  app.use(`${prefix}mobile`, mobile);

  //settings

  //profiles (folders)
  app.use(`${prefix}profiles`, require("./profiles/profiles"));

  //pages
  app.use(`${prefix}pages`, require("./pages/pages"));

  //buttonPads
  app.use(`${prefix}buttonPads`, require("./buttonPads/buttonPads"));

  //actions
  app.use(`${prefix}actions`, require("./actions/actions"));

  //styles
  app.use(`${prefix}styles`, require("./styles/styles"));

  //settings
  app.use(`${prefix}settings`, require("./settings/settings"));

  //plugins
  app.use(`${prefix}plugins/obs`, require("./plugins/obs/obs")); //OBS
};
