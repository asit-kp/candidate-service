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
exports.CandidateService = void 0;
const AWS = __importStar(require("aws-sdk"));
const uuid_1 = require("uuid");
const CandidateUtility_1 = require("./CandidateUtility");
const utilities = new CandidateUtility_1.CandidateUtility();
AWS.config.setPromisesDependency(require('bluebird'));
let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    };
}
const dynamoDb = new AWS.DynamoDB.DocumentClient(options);
class CandidateService {
    constructor() {
        //log.config.debug = process.env.debug;
    }
    postCandidateData(fullname, email, experience) {
        const timestamp = new Date().getTime();
        return {
            id: (0, uuid_1.v4)(),
            fullname: fullname,
            email: email,
            experience: experience,
            submittedAt: timestamp,
            updatedAt: timestamp,
        };
    }
    async submitCandidateData(candidate) {
        console.log('Submitting candidate', candidate);
        const candidateInfo = {
            TableName: process.env.CANDIDATE_TABLE,
            Item: candidate
        };
        console.log('Candidate Info', candidateInfo);
        const res = dynamoDb.put(candidateInfo).promise();
        if (res != undefined) {
            return candidate;
        }
        else {
            return undefined;
        }
    }
    async scanCandidate(params, callback) {
        const res = dynamoDb.scan(params, function (err, data) {
            if (err) {
                console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
                return callback(null, utilities.createResponseObject(400, `Failed to retrieve the candidate list`));
            }
            else {
                console.log("Scan succeeded.", data);
                return callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({
                        candidates: data.Items
                    })
                });
            }
        });
    }
}
exports.CandidateService = CandidateService;
