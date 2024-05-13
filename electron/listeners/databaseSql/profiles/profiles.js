const { connectSQL } = require("../utils/connect");
const { v4: uuidv4 } = require("uuid");

const TYPE = "SQLite::return::profiles";
const TYPE_ERROR = "SQLite::return::profiles::error";

async function read(x = null) {
  try {
    const database = await connectSQL();
    const profiles = await database.all("SELECT * FROM profiles");

    return {
      type: TYPE,
      data: profiles
    };
  } catch (error) {
    return {
      type: TYPE_ERROR,
      data: { error: 1 }
    };
  }
}

async function getById({ _id }) {
  try {
    const database = await connectSQL();
    const profile = await database.get(
      "SELECT * FROM profiles WHERE _id = ?",
      _id
    );

    return {
      type: TYPE,
      data: profile
    };
  } catch (error) {
    return {
      type: TYPE_ERROR,
      data: { error: 1 }
    };
  }
}

async function updateById({ _id, profileName, buttonPads }) {
  const database = await connectSQL();

  try {
    await database.run(
      "UPDATE profiles SET profileName = ?, buttonPads = ? WHERE _id = ?",
      [profileName, buttonPads, _id]
    );

    return {
      type: TYPE,
      data: { _id, profileName, buttonPads }
    };
  } catch (error) {
    return {
      type: TYPE_ERROR,
      data: { error: 1 }
    };
  }
}

async function create({ profileName, buttonPads }) {
  try {
    const database = await connectSQL();
    const _id = uuidv4();

    await database.run(
      "INSERT INTO profiles (`_id`, `profileName`, `buttonPads`) VALUES (?, ?, ?)",
      [_id, profileName, buttonPads]
    );

    return {
      type: TYPE,
      data: { _id, profileName, buttonPads }
    };
  } catch (error) {
    return {
      type: TYPE_ERROR,
      data: { error: 1 }
    };
  }
}

async function removeById({ _id }) {
  try {
    const database = await connectSQL();
    await database.run("DELETE FROM profiles WHERE _id = ?", [_id]);

    return {
      type: TYPE,
      data: { _id }
    };
  } catch (error) {
    return {
      type: TYPE_ERROR,
      data: { error: 1 }
    };
  }
}

const profiles = {
  read,
  getById,
  updateById,
  create,
  removeById
};

module.exports.profiles = profiles;
