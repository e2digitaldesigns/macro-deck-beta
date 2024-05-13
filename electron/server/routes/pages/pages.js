const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { connectSQL } = require("../../../listeners/databaseSql/utils/connect");

const timestamp = require("time-stamp");

router.get("/:profileId", async (req, res) => {
  try {
    const database = await connectSQL();
    const pages = await database.all(
      "SELECT _id, profileId FROM pages WHERE profileId = ? ORDER BY `tableId` ASC",
      req.params.profileId
    );

    res.json({ success: 1, error: 0, pages });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.post("/", async (req, res) => {
  const database = await connectSQL();

  try {
    const _id = uuidv4();
    const order = Number(timestamp("YYYYMMDDmmssms"));

    await database.run(
      "INSERT INTO pages (`_id`, `profileId`, `order`) VALUES (?, ?, ?)",
      [_id, req.body.profileId, order]
    );

    res.json({
      success: 1,
      error: 0,
      page: { _id, profileId: req.body.profileId, order }
    });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const database = await connectSQL();
    await database.run("DELETE FROM pages WHERE _id = ?", [req.params._id]);

    res.json({ success: 1, error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

module.exports = router;
