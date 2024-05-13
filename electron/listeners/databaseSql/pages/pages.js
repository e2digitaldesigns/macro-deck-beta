const { connectSQL } = require("../utils/connect");
const { v4: uuidv4 } = require("uuid");

const TYPE = "SQLite::return::pages";
const TYPE_ERROR = "SQLite::return::pages::error";

async function readByProfileId({ _id }) {
  try {
    const database = await connectSQL();
    const pages = await database.all(
      "SELECT * FROM pages WHERE profileId = ? ORDER BY `order` DESC",
      _id
    );

    return {
      type: TYPE,
      data: pages
    };
  } catch (error) {
    return {
      type: TYPE_ERROR,
      data: { error: 1 }
    };
  }
}

const pages = {
  readByProfileId
};

module.exports.pages = pages;
