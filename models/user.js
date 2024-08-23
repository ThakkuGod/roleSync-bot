const { Schema, model } = require("mongoose");

const schema = new Schema({
  userId: String,
  status: { type: String, default: "Pending" },
  roles: [String],
});

module.exports = new model("statusUsers123", schema);
