"use strict";
const dialogflow = require("dialogflow");
const structjson = require("./structjson.js");
const { google } = require("googleapis");
const fs = require("fs");
const config = require("../config/keys");
const mongoose = require("mongoose");

const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

const auth = new google.auth.GoogleAuth({
  keyFile: config.googleApplicationCredentials,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

const sessionClient = new dialogflow.SessionsClient({ auth });
//const sessionPath = sessionClient.sessionPath(projectId, sessionId);
const Registration = mongoose.model("registration");

// Connect to MongoDB
mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

module.exports = {
  textQuery: async function (text, userID, parameters = {}) {
    let sessionPath = sessionClient.sessionPath(projectId, sessionId + userID);
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
      // Set the maximum size of the response message to 32MB (32 * 1024 * 1024 bytes)
      outputAudioConfig: {
        audioEncoding: "OUTPUT_AUDIO_ENCODING_LINEAR_16",
        sampleRateHertz: 16000,
        synthesizeSpeechConfig: {
          maxResults: 5,
          speakingRate: 0.9,
          pitch: -6.0,
        },
      },
      inputAudioConfig: {
        audioEncoding: "AUDIO_ENCODING_LINEAR_16",
        sampleRateHertz: 16000,
        languageCode: "en-US",
        enableAutomaticPunctuation: true,
      },
    };

    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);
    return responses;
  },

  eventQuery: async function (event, userID, parameters = {}) {
    let sessionPath = sessionClient.sessionPath(projectId, sessionId + userID);
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
      // Set the maximum size of the response message to 32MB (32 * 1024 * 1024 bytes)
      outputAudioConfig: {
        audioEncoding: "OUTPUT_AUDIO_ENCODING_LINEAR_16",
        sampleRateHertz: 16000,
        synthesizeSpeechConfig: {
          maxResults: 5,
          speakingRate: 0.9,
          pitch: -6.0,
        },
      },
      inputAudioConfig: {
        audioEncoding: "AUDIO_ENCODING_LINEAR_16",
        sampleRateHertz: 16000,
        languageCode: "en-US",
        enableAutomaticPunctuation: true,
      },
    };

    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);
    return responses;
  },

  handleAction: function (responses) {
    let self = module.exports;
    let queryResult = responses[0].queryResult;

    switch (queryResult.action) {
      case "recommendfeatures-yes":
        if (queryResult.allRequiredParamsPresent) {
          self.saveRegistration(queryResult.parameters.fields);
        }
        break;
    }
    return responses;
  },

  saveRegistration: async function (fields) {
    const registration = new Registration({
      purchaseorder: fields.purchaseorder.stringValue,
      suppliercode: fields.suppliercode.stringValue,
      ordertotal: fields.ordertotal.stringValue,
      address: fields.address.stringValue,
      phone: fields.phone.stringValue,
      email: fields.email.stringValue,
      dateSent: Date.now(),
    });
    try {
      let reg = await registration.save();
      console.log(reg);
    } catch (err) {
      console.log(err);
    }
  },
};
