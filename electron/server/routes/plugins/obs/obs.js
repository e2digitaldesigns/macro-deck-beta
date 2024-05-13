const express = require("express");
const router = express.Router();

const {
  connectSQL
} = require("../../../../listeners/databaseSql/utils/connect");

router.get("/", async (req, res) => {
  try {
    const database = await connectSQL();
    const settings = await database.all("SELECT * FROM plugins_obs");
    const ipAddress = settings[0].ipAddress;
    const port = settings[0].port;

    const settingsObj = {
      baseUrl: `ws://${ipAddress}:${port}`,
      ipAddress,
      port,
      password: settings[0].password
    };

    console.log(24, settingsObj);

    res.json({ success: 1, error: 0, settings: settingsObj });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.put("/", async (req, res) => {
  const database = await connectSQL();
  const { ipAddress, port, password } = req.body;

  console.log(36, ipAddress, port, password);

  try {
    await database.run(
      "UPDATE plugins_obs SET ipAddress = ? , port = ?, password = ? WHERE tableId = 1",
      [ipAddress, port, password]
    );

    res.json({ success: 1, error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

module.exports = router;
