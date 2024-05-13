const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const timestamp = require("time-stamp");
const { connectSQL } = require("../../../listeners/databaseSql/utils/connect");

router.get("/:buttonPadId", async (req, res) => {
  const database = await connectSQL();
  try {
    const actions = await database.all(
      "SELECT * FROM actions WHERE buttonPadId = ? ORDER BY `order` ASC",
      req.params.buttonPadId
    );

    const actionData = actions.map(action => {
      const newAction = { ...action };
      newAction.data = JSON.parse(action.data);
      return newAction;
    });

    res.json({ success: 1, error: 0, actions: actionData });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
  database.close();
});

router.post("/", async (req, res) => {
  const database = await connectSQL();
  try {
    const actionId = uuidv4();
    const actionOrder = Number(timestamp("YYYYMMDDmmssms"));

    await database.run(
      `INSERT INTO actions ("_id", "profileId", "pageId", "buttonPadId", "order") VALUES (?, ?, ?, ?, ?)`,
      [
        actionId,
        req.body.profileId,
        req.body.pageId,
        req.body.buttonPadId,
        actionOrder
      ]
    );

    const action = await database.all(
      "SELECT * FROM actions WHERE _id = ?",
      actionId
    );

    if (action.length === 0) {
      throw "Action not found";
    }

    action[0].data = JSON.parse(action[0].data);

    res.json({ success: 1, error: 0, action: action[0] });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }

  database.close();
});

router.put("/reOrder", async (req, res) => {
  const database = await connectSQL();

  try {
    for (const rowValues of req.body.data) {
      await database.run(`UPDATE actions SET "order" = ? WHERE _id = ?`, [
        rowValues.order,
        rowValues._id
      ]);
    }

    res.json({ success: 1, error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }

  database.close();
});

router.put("/:_id", async (req, res) => {
  const database = await connectSQL();

  try {
    await database.run(`UPDATE actions SET data = ? WHERE _id = ?`, [
      req.body.data,
      req.params._id
    ]);

    res.json({ success: 1, error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }

  database.close();
});

router.delete("/:_id", async (req, res) => {
  const database = await connectSQL();
  try {
    await database.run("DELETE FROM actions WHERE _id = ?", req.params._id);

    res.json({ success: 1, error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }

  database.close();
});

module.exports = router;
