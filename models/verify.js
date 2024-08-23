const { Schema, model } = require("mongoose");

const schema = new Schema({
  guildId: String,
  role: String,
});

module.exports = new model("verifies987", schema);
