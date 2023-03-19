"use strict";
const chatbot = require("../chatbot/chatbot");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.send({
      hello: "Welcome to Chat and Get AI bot Backend application..!",
    });
  });

  app.post("/api/df_text_query", async (req, res) => {
    try {
      let responses = await chatbot.textQuery(
        req.body.text,
        req.body.userID,
        req.body.parameters
      );
      res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins to access the API
      res.send(responses[0].queryResult);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
  });

  app.post("/api/df_event_query", async (req, res) => {
    try {
      let responses = await chatbot.eventQuery(
        req.body.event,
        req.body.userID,
        req.body.parameters
      );
      res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins to access the API
      res.send(responses[0].queryResult);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
  });
};
