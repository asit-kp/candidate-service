import * as AWS from 'aws-sdk';
import { APIGatewayEvent, CloudWatchLogsEvent, Context, ProxyCallback } from 'aws-lambda';
import * as log from 'lambda-log';
import { CandidateUtility } from './CandidateUtility';
import { CandidateService } from './CandidateService';
const utility: CandidateUtility = new CandidateUtility();
const service: CandidateService = new CandidateService();

AWS.config.setPromisesDependency(require('bluebird'));


export class CandidateController {
  static initialized: boolean = false;
  constructor() {
    //log.config.debug = process.env.debug;
  }
  static init() {
    CandidateController.initialized = true;
  }

  public async postCandidateDetails(event: APIGatewayEvent, context: Context, callback: ProxyCallback) {
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
      log.info('return result',postInfo);
      const res = await service.submitCandidateData(postInfo);
      if (res !== undefined){
        callback(null, utility.createResponseObject(
          200,
          `Successfully added the candidate with email id ${res.email}`
        ));
      }
      else{
        callback(null, utility.createResponseObject(
          400,
          `Failed to add the candidate with email id ${res.email}`
        ));
      }
 
    
    
    } catch (error) {
      log.error('errored out in CandidateController::post()', error);
      callback(null, utility.createResponseObject(500,null));
    }
  }

public async listCandidateDetails(event: APIGatewayEvent, context: Context, callback: ProxyCallback) {
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
  log.info('Params',params)
  console.log("Scanning Candidate table.");
  

  var res = await service.scanCandidate(params);
  console.log(res);
  if (res != undefined){
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
          candidates: res.Items
      })
    });
  }
  else{
    callback(null, utility.createResponseObject(
      400,
      `Database is empty`
    ));
  }
  
  } catch (error) {
    log.error('errored out in CandidateController::post()', error);
    callback(null, utility.createResponseObject(500,null));
  }
}

public async getCandidateDetails(event: APIGatewayEvent, context: Context, callback: ProxyCallback) {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    log.info('Entered get controller in CandidateController::get()');
    if (!CandidateController.initialized) {
      CandidateController.init();
    }
    const params = {
      TableName: process.env.CANDIDATE_TABLE,
      Key: {
        id: event.pathParameters.id,
      },
    };
    var res = await service.getCandidate(params);

    if (res.Item != undefined){
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
            candidates: res.Item
        })
      });
    }
    else{
      callback(null, utility.createResponseObject(
        400,
        `No candidate found with id ${event.pathParameters.id}`
      ));
    }
  
  } catch (error) {
    log.error('errored out in CandidateController::post()', error);
    callback(null, utility.createResponseObject(500,null));
  }
}
public async deleteCandidateDetails(event: APIGatewayEvent, context: Context, callback: ProxyCallback) {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    log.info('Entered delete controller in CandidateController::post()');
    if (!CandidateController.initialized) {
      CandidateController.init();
    }
    const params = {
      TableName: process.env.CANDIDATE_TABLE,
      Key: {
        id: event.pathParameters.id,
      },
    };
    var res = await service.deleteCandidate(params);

    if (res != undefined){
      callback(null, utility.createResponseObject(
        200,
        `Successfully delete the candidate with id ${event.pathParameters.id}`
      ));
    }
    else{
      callback(null, utility.createResponseObject(
        400,
        `No candidate found with id ${event.pathParameters.id}`
      ));
    }
  
  } catch (error) {
    log.error('errored out in CandidateController::post()', error);
    callback(null, utility.createResponseObject(500,null));
  }
}
}