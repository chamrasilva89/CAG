const mongoose = require("mongoose");
const { Schema } = mongoose;

const registrationSchema = new Schema({
  purchaseorder: String,
  suppliercode: String,
  ordertotal: String,
  address: String,
  phone: String,
  email: String,
  registerDate: Date,
});

mongoose.model("registration", registrationSchema);
