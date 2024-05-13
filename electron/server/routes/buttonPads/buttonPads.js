const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { connectSQL } = require("../../../listeners/databaseSql/utils/connect");

router.get("/:pageId", async (req, res) => {
  try {
    const database = await connectSQL();
    const buttonPads = await database.all(
      "SELECT * FROM buttonPads WHERE pageId = ? ORDER BY `buttonPadNum` ASC",
      req.params.pageId
    );

    res.json({ success: 1, error: 0, buttonPads });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const database = await connectSQL();
    const buttonPadId = uuidv4();
    const actionId = uuidv4();

    await database.run(
      `INSERT INTO buttonPads (
        "_id",
        "profileId",
        "pageId",
        "buttonPadNum"
      ) VALUES (?, ?, ?, ?)`,
      [buttonPadId, req.body.profileId, req.body.pageId, req.body.buttonPadNum]
    );

    await database.run(
      `INSERT INTO actions (
        "_id",
        "profileId",
        "pageId",
        "buttonPadId"
      ) VALUES (?, ?, ?, ?)`,
      [actionId, req.body.profileId, req.body.pageId, buttonPadId]
    );

    const buttonPad = await database.all(
      "SELECT * FROM buttonPads WHERE _id = ?",
      buttonPadId
    );

    res.json({ success: 1, error: 0, buttonPad: buttonPad[0] });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.post("/copy", async (req, res) => {
  const database = await connectSQL();

  try {
    const originButtonPad = await database.all(
      "SELECT * FROM buttonPads WHERE _id = ?",
      req.body.originId
    );

    const originAction = await database.all(
      "SELECT * FROM actions WHERE buttonPadId = ?",
      req.body.originId
    );

    const destinationButtonPad = await database.all(
      "SELECT * FROM buttonPads WHERE _id = ?",
      req.body.destinationId
    );

    await database.run("DELETE FROM actions WHERE buttonPadId = ?", [
      req.body.destinationId
    ]);

    const originActionsArr = [];

    originAction.forEach(row => {
      let newAction = [
        uuidv4(),
        destinationButtonPad[0].profileId,
        destinationButtonPad[0].pageId,
        destinationButtonPad[0]._id,
        row.order,
        row.data
      ];
      originActionsArr.push(newAction);
    });

    for (const rowValues of originActionsArr) {
      await database.run(
        "INSERT INTO actions (`_id`, `profileId`, `pageId`, `buttonPadId`, `order`, `data`) VALUES (?, ?, ?, ?, ?, ?)",
        [...rowValues]
      );
    }

    await database.run(
      `UPDATE buttonPads SET
        "bgColor" = ?,
        "icon" = ?,
        "iconColor" = ?,
        "image" = ?,
        "text" = ?,
        "textColor" = ?
      WHERE _id = ?`,
      [
        originButtonPad[0].bgColor,
        originButtonPad[0].icon,
        originButtonPad[0].iconColor,
        originButtonPad[0].image,
        originButtonPad[0].text,
        originButtonPad[0].textColor,
        req.body.destinationId
      ]
    );

    const newButtonPad = await database.all(
      "SELECT * FROM buttonPads WHERE _id = ?",
      req.body.destinationId
    );

    res.json({ success: 1, buttonPad: newButtonPad[0], error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }

  database.close();
});

router.put("/buttonPadSwap", async (req, res) => {
  const database = await connectSQL();

  try {
    req.body.destinationPadId &&
      (await database.run(
        `UPDATE buttonPads SET
        "buttonPadNum" = ?
      WHERE _id = ?`,
        [req.body.sourcePadNumber, req.body.destinationPadId]
      ));

    await database.run(
      `UPDATE buttonPads SET
        "buttonPadNum" = ?
      WHERE _id = ?`,
      [req.body.destinationPadNumber, req.body.sourcePadId]
    );

    res.json({ success: 1, error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.put("/buttonPadOverwrite", async (req, res) => {
  const database = await connectSQL();

  const { destinationPadNumber, destinationPadId, sourcePadId } = req.body;

  if (destinationPadId) {
    await database.run("DELETE FROM buttonPads WHERE _id = ?", [
      destinationPadId
    ]);

    await database.run("DELETE FROM actions WHERE buttonPadId = ?", [
      destinationPadId
    ]);
  }

  const originButtonPad = await database.all(
    "SELECT * FROM buttonPads WHERE _id = ?",
    sourcePadId
  );

  const originAction = await database.all(
    "SELECT * FROM actions WHERE buttonPadId = ?",
    sourcePadId
  );

  const newButtonPadId = uuidv4();

  await database.run(
    `INSERT INTO buttonPads (
      "_id",
      "profileId",
      "pageId",
      "bgColor",
      "buttonPadNum",
      "icon",
      "iconColor",
      "image",
      "text",
      "textColor"
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newButtonPadId,
      originButtonPad[0].profileId,
      originButtonPad[0].pageId,
      originButtonPad[0].bgColor,
      destinationPadNumber,
      originButtonPad[0].icon,
      originButtonPad[0].iconColor,
      originButtonPad[0].image,
      originButtonPad[0].text,
      originButtonPad[0].textColor
    ]
  );

  const originActionsArr = [];

  originAction.forEach(row => {
    let newAction = [
      uuidv4(),
      originButtonPad[0].profileId,
      originButtonPad[0].pageId,
      newButtonPadId,
      row.order,
      row.data
    ];
    originActionsArr.push(newAction);
  });

  for (const rowValues of originActionsArr) {
    await database.run(
      "INSERT INTO actions (`_id`, `profileId`, `pageId`, `buttonPadId`, `order`, `data`) VALUES (?, ?, ?, ?, ?, ?)",
      [...rowValues]
    );
  }

  const newButtonPad = await database.all(
    "SELECT * FROM buttonPads WHERE _id = ?",
    newButtonPadId
  );

  try {
    res.json({ success: 1, error: 0, buttonPad: newButtonPad[0] });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.put("/:_id", async (req, res) => {
  const database = await connectSQL();
  const { _id } = req.params;

  try {
    await database.run(
      `UPDATE buttonPads SET
        "bgColor" = ?,
        "buttonPadNum" = ?,
        "icon" = ?,
        "iconColor" = ?,
        "image" = ?,
        "pageId" = ?,
        "profileId" = ?,
        "text" = ?,
        "textColor" = ?
      WHERE _id = ?`,
      [
        req.body.bgColor,
        req.body.buttonPadNum,
        req.body.icon,
        req.body.iconColor,
        req.body.image,
        req.body.pageId,
        req.body.profileId,
        req.body.text,
        req.body.textColor,
        _id
      ]
    );

    res.json({ success: 1, error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.delete("/:buttonPadId", async (req, res) => {
  try {
    const database = await connectSQL();

    await database.run("DELETE FROM buttonPads WHERE _id = ?", [
      req.params.buttonPadId
    ]);

    await database.run("DELETE FROM actions WHERE buttonPadId = ?", [
      req.params.buttonPadId
    ]);

    res.json({ success: 1, error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

router.patch("/applyStyle", async (req, res) => {
  const database = await connectSQL();

  try {
    await database.run(
      `UPDATE buttonPads SET
        "bgColor" = ?,
        "icon" = ?,
        "iconColor" = ?,
        "image" = ?,
        "textColor" = ?
      WHERE _id = ?`,
      [
        req.body.bgColor,
        req.body.icon,
        req.body.iconColor,
        req.body.image,
        req.body.textColor,
        req.body.buttonPadId
      ]
    );

    res.json({ success: 1, error: 0 });
  } catch (error) {
    res.json({ error: 1, errorMessage: error });
  }
});

module.exports = router;
