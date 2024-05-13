const express = require("express");
const cors = require("cors");
const path = require("path");

const fetchIPAddress = require("../utils/fetchIPAddress");
const SETTINGS = require("../settings/system.json");
const actionParser = require("./macroActions/macroActions");
const listners = require("../listeners");
const { connectSQL } = require("../listeners/databaseSql/utils/connect");

const getPortNumber = async () => {
  try {
    const database = await connectSQL();
    const settings = await database.all("SELECT md_port FROM settings");

    return settings[0].md_port;
  } catch (error) {
    return null;
  }
};

const service = async mainWindow => {
  const app = express();
  const server = require("http").createServer(app);
  // const io = require("socket.io")(server);

  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET"]
    }
  });

  app.use(cors());

  // app.use(
  //   cors({
  //     origin: "*"
  //   })
  // );

  app.set("socketio", io);
  app.set("mainWindow", mainWindow);

  require("./routes")(app);

  const staticPath = path.join(__dirname, "md-public");

  app.use(express.static(staticPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  app.get("/", (req, res) => {
    res.send("MACRO DECK API server is running...");
  });

  io.on("connection", socket => {
    socket.on("macroDeckerSocket", data => {
      actionParser(io, data);
    });

    socket.on("disconnect", reason => {
      console.log({ disconnected: reason });
    });
  });

  require("./twitch")();

  listners.listeners(io, mainWindow);
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////

  const ipAddress = fetchIPAddress() || "127.0.0.1";
  const portNumber = (await getPortNumber()) || SETTINGS.DEFAULT_PORT;

  console.log("IP Address: " + ipAddress);

  server.listen(portNumber, ipAddress, () =>
    console.log("MD API server is running on port " + portNumber + "...")
  );
};

module.exports = service;
