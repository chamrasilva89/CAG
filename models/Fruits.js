const mongoose = require("mongoose");
const { Schema } = mongoose;

const fruitsSchema = new Schema({
  fruit: String,
  price: String,
});

mongoose.model("fruit", fruitsSchema);
