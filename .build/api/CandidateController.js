"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateController = void 0;
const AWS = __importStar(require("aws-sdk"));
const log = __importStar(require("lambda-log"));
const CandidateUtility_1 = require("./CandidateUtility");
const CandidateService_1 = require("./CandidateService");
const utility = new CandidateUtility_1.CandidateUtility();
const service = new CandidateService_1.CandidateService();
AWS.config.setPromisesDependency(require('bluebird'));
let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    };
}
const dynamoDb = new AWS.DynamoDB.DocumentClient(options);
class CandidateController {
    static initialized = false;
    constructor() {
        //log.config.debug = process.env.debug;
    }
    static init() {
        CandidateController.initialized = true;
    }
    async postCandidateDetails(event, context, callback) {
        try {
            context.callbackWaitsForEmptyEventLoop = false;
            log.info('Entered post controller in CandidateController::post()', event);
            if (!CandidateController.initialized) {
                CandidateController.init();
            }
            const requestBody = JSON.parse(event.body);
            const fullname = requestBody.fullname;
            const email = requestBody.email;
            const experience = requestBody.experience;
            if (typeof fullname !== 'string' || typeof email !== 'string' || typeof experience !== 'number') {
                console.error('Validation Failed');
                callback(new Error('Couldn\'t submit candidate because of validation errors.'));
                return;
            }
            const postInfo = service.postCandidateData(fullname, email, experience);
            log.info('return result', postInfo);
            const res = await service.submitCandidateData(postInfo);
            if (res !== undefined) {
                callback(null, utility.createResponseObject(200, `Successfully added the candidate with email id ${res.email}`));
            }
            else {
                callback(null, utility.createResponseObject(400, `Failed to add the candidate with email id ${res.email}`));
            }
        }
        catch (error) {
            log.error('errored out in CandidateController::post()', error);
            callback(null, utility.createResponseObject(500, null));
        }
    }
    async listCandidateDetails(event, context, callback) {
        try {
            context.callbackWaitsForEmptyEventLoop = false;
            log.info('Entered list controller in CandidateController::post()');
            if (!CandidateController.initialized) {
                CandidateController.init();
            }
            let params = {
                TableName: process.env.CANDIDATE_TABLE,
                ProjectionExpression: "id, fullname, email, experience"
            };
            log.info('Params', params);
            console.log("Scanning Candidate table.");
            var res = await dynamoDb.scan(params).promise();
            if (res.Items != undefined) {
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({
                        candidates: res.Items
                    })
                });
            }
        }
        catch (error) {
            log.error('errored out in CandidateController::post()', error);
            callback(null, utility.createResponseObject(500, null));
        }
    }
}
exports.CandidateController = CandidateController;
/*
module.exports.list = (event, context, callback) => {
  var params = {
      TableName: process.env.CANDIDATE_TABLE,
      ProjectionExpression: "id, fullname, email, experience"
  };

  console.log("Scanning Candidate table.");
  const onScan = (err, data) => {

      if (err) {
          console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
          callback(err);
      } else {
          console.log("Scan succeeded.");
          return callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                  candidates: data.Items
              })
          });
      }

  };

  

};

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.CANDIDATE_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.get(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t fetch candidate.'));
      return;
    });
};

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.CANDIDATE_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.delete(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully deleted the candidate`,
        })
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t Delete candidate.'));
      return;
    });
};
*/ 
