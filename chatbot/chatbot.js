"use strict";
const dialogflow = require("dialogflow");
const structjson = require("./structjson.js");
const { google } = require("googleapis");
const fs = require("fs");
const config = require("../config/keys");

const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

const auth = new google.auth.GoogleAuth({
  keyFile: config.googleApplicationCredentials,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

const sessionClient = new dialogflow.SessionsClient({ auth });
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

module.exports = {
  textQuery: async function (text, parameters = {}) {
    let self = module.exports;
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: languageCode,
        },
      },
      queryParams: {
        payload: {
          data: parameters,
        },
      },
    };

    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);
    return responses;
  },

  eventQuery: async function (event, parameters = {}) {
    let self = module.exports;
    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          name: event,
          parameters: structjson.jsonToStructProto(parameters), //Dialogflow's v2 API uses gRPC. You'll need a jsonToStructProto method to convert your JavaScript object to a proto struct.
          languageCode: languageCode,
        },
      },
    };

    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);
    return responses;
  },

  handleAction: function (responses) {
    return responses;
  },
};