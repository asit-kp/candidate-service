import * as AWS from 'aws-sdk';
import {v4 as uuidv4} from 'uuid';
import { CandidateUtility } from './CandidateUtility';
const utilities: CandidateUtility = new CandidateUtility();

AWS.config.setPromisesDependency(require('bluebird'));

let options = {};
if (process.env.IS_OFFLINE) {
  options = {
  region: 'localhost',
  endpoint: 'http://localhost:8000'
  };
}

const dynamoDb = new AWS.DynamoDB.DocumentClient(options);

export class CandidateService {
  constructor() {
    //log.config.debug = process.env.debug;
  }

  public postCandidateData(fullname, email, experience){
    const timestamp = new Date().getTime();
      return {
        id: uuidv4(),
        fullname: fullname,
        email: email,
        experience: experience,
        submittedAt: timestamp,
        updatedAt: timestamp,
      };

  }

  public async submitCandidateData(candidate){
    console.log('Submitting candidate', candidate);
    const candidateInfo = {
      TableName: process.env.CANDIDATE_TABLE,
      Item: candidate
    };
    console.log('Candidate Info',candidateInfo);
    const res =  dynamoDb.put(candidateInfo).promise()
    if (res !=  undefined){
      return candidate
    }else{
      return undefined
    }
  }

  public async scanCandidate(params, callback) {
    const res = dynamoDb.scan(params, function(err, data) {
      if (err) {
          console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
          return callback(null, utilities.createResponseObject(
            400,
            `Failed to retrieve the candidate list`
          ));
      } else {
          console.log("Scan succeeded.",data);
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