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

  public async scanCandidate(params) {
    var res = await dynamoDb.scan(params).promise();
    console.log(res.Items.length)
    if (res !=  undefined && res.Items.length != 0){
      return res
    }else{
      return undefined
    }

  }
  public async getCandidate(params) {
    var res = await dynamoDb.get(params).promise();
    if (res !=  undefined){
      return res
    }else{
      return undefined
    }
  }
  public async deleteCandidate(params) {
    var res = await dynamoDb.delete(params).promise();
    if (res !=  undefined){
      return res
    }else{
      return undefined
    }
  }
}