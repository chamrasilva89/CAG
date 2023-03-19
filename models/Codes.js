const mongoose = require("mongoose");
const { Schema } = mongoose;

const codesSchema = new Schema({
  subject: String,
  description: String,
  syntax: String,
  codelink: String,
});

mongoose.model("code", codesSchema);
