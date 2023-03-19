const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const config = require("./config/keys");
const mongoose = require("mongoose");
mongoose.connect(config.mongoURI, { useNewUrlParser: true });
require("./models/Registration");
require("./models/Demand");
require("./models/Coupons");
require("./models/Fruits");
require("./models/Poheaders");
require("./models/Suppliers");
require("./models/Codes");

app.use(bodyParser.json());

require("./routes/dialogFlowRoutes")(app);
require("./routes/fullfillmentRoutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
