const express = require("express");
const router = express.Router();
const { connectSQL } = require("../../../listeners/databaseSql/utils/connect");

const { dynamicProfile } = require("./dynamicProfile");

router.get("/", async (req, res) => {
  try {
    const database = await connectSQL();
    const profiles = await database.all(
      "SELECT _id, buttonPads, profileName FROM profiles ORDER BY `order` ASC"
    );

    res.json({ success: 1, error: 0, profiles });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.put("/reOrder", async (req, res) => {
  const database = await connectSQL();

  try {
    for (const profile of req.body.data) {
      await database.run("UPDATE profiles SET `order` = ? WHERE _id = ?", [
        profile.order,
        profile._id
      ]);
    }

    res.json({ success: 1, error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.put("/", async (req, res) => {
  const database = await connectSQL();
  const { _id, profileName, buttonPads } = req.body;

  try {
    await database.run(
      "UPDATE profiles SET profileName = ?, buttonPads = ? WHERE _id = ?",
      [profileName, buttonPads, _id]
    );

    res.json({ success: 1, error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await dynamicProfile(req.body.type);
    res.json(result);
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.delete("/:_id", async (req, res) => {
  const database = await connectSQL();
  const { _id } = req.params;

  try {
    await database.run("DELETE FROM profiles WHERE _id = ?", [_id]);
    await database.run("DELETE FROM pages WHERE profileId = ?", [_id]);
    await database.run("DELETE FROM buttonPads WHERE profileId = ?", [_id]);
    await database.run("DELETE FROM actions WHERE profileId = ?", [_id]);

    res.json({ success: 1, error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

module.exports = router;
