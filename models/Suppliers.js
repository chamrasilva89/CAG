const mongoose = require("mongoose");
const { Schema } = mongoose;

const supplierssSchema = new Schema({
  suppiercode: String,
  suppiername: String,
  supplieraddress: String,
  supplierphoneno: String,
  supplieroutstanding: String,
  supplierfax: String,
});

mongoose.model("supplier", supplierssSchema);
