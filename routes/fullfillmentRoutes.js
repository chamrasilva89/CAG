const { WebhookClient } = require("dialogflow-fulfillment");

const mongoose = require("mongoose");
const Demand = mongoose.model("demand");
const Coupon = mongoose.model("coupon");
const Fruit = mongoose.model("fruit");
const Poheader = mongoose.model("poheader");
const Supplier = mongoose.model("supplier");
const Code = mongoose.model("code");

module.exports = (app) => {
  app.post("/", async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    function snoopy(agent) {
      agent.add(`Welcome to my Snoopy fulfillment!`);
    }

    async function learn(agent) {
      try {
        const course = await Demand.findOne({
          course: agent.parameters.course,
        });
        let responseText = "";
        if (course !== null) {
          course.counter++;
          await course.save();
        } else {
          const demand = new Demand({ course: agent.parameters.course });
          await demand.save();
        }

        let coupon = await Coupon.findOne({ course: agent.parameters.course });
        if (coupon !== null) {
          responseText = `You want to learn about ${agent.parameters.course}. Here is a link to the course: ${coupon.link}`;
        } else {
          responseText = `You want to learn about ${agent.parameters.course}. Here is a link to all of my courses: https://www.udemy.com/user/jana-bergant`;
        }
        agent.add(responseText);
      } catch (err) {
        console.log(err);
      }
    }

    async function getFruitPrice(agent) {
      try {
        console.log("fruit is ", agent.parameters.fruit_name);
        let fruitdata = await Fruit.findOne({
          fruit: agent.parameters.fruit_name,
        });
        console.log("fruit data", fruitdata);
        if (fruitdata !== null) {
          responseText = `price is ${fruitdata.price}. Here is the fruit: ${fruitdata.fruit}`;
        } else {
          responseText = `can't get data`;
        }
        agent.add(responseText);
      } catch (err) {
        console.log(err);
        agent.add(`Sorry, an error occurred while processing your request`);
      }
    }

    async function getPoDetails(agent) {
      try {
        console.log("Po Number is ", agent.parameters.po_number);
        let podata = await Poheader.findOne({
          ponumber: agent.parameters.po_number,
        });
        console.log("PO data", podata);
        if (podata !== null) {
          responseText = `
          <table>
            <tr>
              <th>Purchase Order Data</th>
            </tr>
            <tr>
              <td>PO number</td>
              <td>${podata.ponumber}</td>
            </tr>
            <tr>
              <td>PO total</td>
              <td>${podata.pototal}</td>
            </tr>
            <tr>
              <td>PO supplier</td>
              <td>${podata.suppliername}</td>
            </tr>
            <tr>
              <td>PO status</td>
              <td>${podata.status}</td>
            </tr>
          </table>
          You can also request more details`;
        } else {
          responseText = `can't get data related to your PO ; ${podata.ponumber}`;
        }
        agent.add(responseText);
      } catch (err) {
        console.log(err);
        agent.add(`Sorry, an error occurred while processing your request`);
      }
    }

    async function getPoDetailsByNumber(agent) {
      try {
        console.log("Po Number is ", agent.parameters.po_number);
        let podata = await Poheader.findOne({
          ponumber: agent.parameters.po_number,
        });
        console.log("PO data", podata);
        if (podata !== null) {
          responseText = `
          <table>
            <tr>
              <th>Purchase Order Data</th>
            </tr>
            <tr>
              <td>PO number</td>
              <td>${podata.ponumber} ${podata.pobackorder} </td>
            </tr>
            <tr>
            <td>PO Date</td>
            <td>${podata.orderdate}</td>
            </tr>
            <td>PO Type</td>
            <td>${podata.type}</td>
            </tr>
            <tr>
              <td>PO total</td>
              <td>${podata.pototal}</td>
            </tr>
            <tr>
            <td>PO status</td>
            <td>${podata.status}</td>
            </tr>
            <tr>
              <td>PO supplier</td>
              <td>${podata.suppliername}</td>
            </tr>
          </table>`;
        } else {
          responseText = `we didn't find data related to your PO; ${agent.parameters.po_number}`;
        }
        agent.add(responseText);
      } catch (err) {
        console.log(err);
        agent.add(`Sorry, an error occurred while processing your request`);
      }
    }

    async function getSupplierbyCode(agent) {
      try {
        console.log("Supplier code is ", agent.parameters.supplier_code);
        let supdata = await Supplier.findOne({
          suppiercode: agent.parameters.supplier_code,
        });
        console.log("Sup data", supdata);
        if (supdata !== null) {
          responseText = `
          <table>
            <tr>
              <th>Supplier Data</th>
            </tr>
            <tr>
              <td>Supplier code</td>
              <td>${supdata.suppiercode}</td>
            </tr>
            <tr>
            <td>Supplier Name</td>
            <td>${supdata.suppiername}</td>
            </tr>
            <td>Supplier Address</td>
            <td>${supdata.supplieraddress}</td>
            </tr>
            <tr>
              <td>Supplier Phone</td>
              <td>${supdata.supplierphoneno}</td>
            </tr>
            <tr>
            <td>Supplier Outstanding</td>
            <td>${supdata.supplieroutstanding}</td>
            </tr>
            <tr>
              <td>Supplier Fax</td>
              <td>${supdata.supplierfax}</td>
            </tr>
          </table>`;
        } else {
          responseText = `we didn't find data related to your Supplier; ${agent.parameters.supplier_code}`;
        }
        agent.add(responseText);
      } catch (err) {
        console.log(err);
        agent.add(`Sorry, an error occurred while processing your request`);
      }
    }

    async function prontolearn(agent) {
      try {
        let prontocodes = await Code.findOne({
          subject: agent.parameters.syntax,
        });
        if (prontocodes !== null) {
          responseText = `
          <table>
            <tr>
              <th>Learn 4GL</th>
            </tr>
            <tr>
              <td>Syntax</td>
              <td>${prontocodes.subject}</td>
            </tr>
            <tr>
            <td>Description</td>
            <td>${prontocodes.description}</td>
            </tr>
            <td>Syntax</td>
            <td><code>${prontocodes.syntax}</code></td>
            </tr>
            <tr>
              <td>Link</td>
              <td>${prontocodes.codelink}</td>
            </tr>
          </table>`;
        } else {
          responseText = `We don't have updated code base to give you details about ${agent.parameters.syntax}`;
        }
        agent.add(responseText);
      } catch (err) {
        console.log(err);
      }
    }

    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }
    let intentMap = new Map();
    intentMap.set("snoopy", snoopy);
    intentMap.set("learn courses", learn);
    intentMap.set("Default Fallback Intent", fallback);
    intentMap.set("getPoDetails", getPoDetails);
    intentMap.set("getFruitPrice", getFruitPrice);
    intentMap.set("getPoDetailsByNumber", getPoDetailsByNumber);
    intentMap.set("getSupplierbyCode", getSupplierbyCode);
    intentMap.set("learn pronto4gl", prontolearn);
    agent.handleRequest(intentMap);
  });
};
