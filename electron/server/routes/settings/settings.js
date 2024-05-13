const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { connectSQL } = require("../../../listeners/databaseSql/utils/connect");
const fetchIPAddress = require("../../../utils/fetchIPAddress");

router.get("/", async (req, res) => {
  try {
    const database = await connectSQL();
    const settings = await database.all("SELECT * FROM settings");
    const ipAddress = fetchIPAddress();
    const port = settings[0].md_port;

    const settingsObj = {
      baseUrl: `http://${ipAddress}:${port}`,
      ipAddress,
      port
    };

    res.json({ success: 1, error: 0, settings: settingsObj });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.put("/", async (req, res) => {
  const database = await connectSQL();
  const { port } = req.body;

  try {
    await database.run("UPDATE settings SET md_port = ?  WHERE tableId = 1", [
      port
    ]);

    res.json({ success: 1, error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

module.exports = router;
