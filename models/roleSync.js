const { Schema, model } = require("mongoose");

const schema = new Schema({
  initGuild: String,
  toGuild: String,
});

module.exports = new model("roleSync673", schema);
