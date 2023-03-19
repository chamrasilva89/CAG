const mongoose = require("mongoose");
const { Schema } = mongoose;

const poheadersSchema = new Schema({
  ponumber: String,
  pobackorder: String,
  pototal: String,
  projectcode: String,
  projectdescription: String,
  status: String,
  suppliercode: String,
  suppliername: String,
  type: String,
  whsecode: String,
  supplierAddress: String,
  supplierPhone: String,
  invoiceAmount: String,
  invoiceDate: String,
  invoiceNo: String,
  poNotes: String,
  poUserID: String,
  shipmentNo: String,
  warehouse: String,
  orderdate: String,
});

mongoose.model("poheader", poheadersSchema);
