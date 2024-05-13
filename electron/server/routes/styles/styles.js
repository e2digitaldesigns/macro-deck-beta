const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { connectSQL } = require("../../../listeners/databaseSql/utils/connect");

router.get("/", async (req, res) => {
  try {
    const database = await connectSQL();
    const styles = await database.all(
      "SELECT * FROM styles ORDER BY `tableId` ASC"
    );

    res.json({ success: 1, error: 0, styles });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.post("/", async (req, res) => {
  const database = await connectSQL();

  try {
    const _id = uuidv4();
    const { textColor, icon, iconColor, image, bgColor } = req.body;

    await database.run(
      "INSERT INTO styles (`_id`, `textColor`,`icon`,`iconColor`,`image`,`bgColor`) VALUES (?, ?, ?, ?, ?, ?)",
      [_id, textColor, icon, iconColor, image, bgColor]
    );

    res.json({
      success: 1,
      error: 0,
      style: { _id, textColor, icon, iconColor, image, bgColor }
    });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const database = await connectSQL();
    await database.run("DELETE FROM styles WHERE _id = ?", [req.params._id]);

    res.json({ success: 1, error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

module.exports = router;
