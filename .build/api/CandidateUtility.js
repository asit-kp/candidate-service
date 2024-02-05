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
exports.CandidateUtility = void 0;
const log = __importStar(require("lambda-log"));
const responses = __importStar(require("../common/responses.json"));
const postSchema = __importStar(require("../jsonSchema/postCandidateData.json"));
const jsonschema_1 = require("jsonschema");
class CandidateUtility {
    /**
     * returns random uuid number
     */
    createUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    /**
   *
   * @param event
   */
    extractRequestDataAndValidateRequest(event, method) {
        try {
            let validationResponse = {
                isValid: false,
                data: null,
                requestorId: null
            };
            log.info('Entered VaccinationUtility::extraceRequestDataAndValidateRequest()');
            const requestorProfileData = this.getProp(['requestContext', 'authorizer'], event);
            let requestorProfileId = requestorProfileData.profile;
            let requestorType = requestorProfileData['custom:group'];
            requestorType = requestorType ? requestorType.toLowerCase() : 'patient';
            requestorProfileId = requestorProfileId.replace('UserProfile/', '');
            const requestBody = JSON.parse(event.body || '{}');
            log.info('Successfully extracted requestor profile id in VaccinationUtility::extraceRequestDataAndValidateRequest()', requestorProfileId);
            let schema;
            schema = postSchema;
            const validationResults = this.validateRequestBody(requestBody, schema);
            if (!validationResults.isValid) {
                // return invalid schema response here
                log.info('Invalid request body schema in Utility::extraceRequestDataAndValidateRequest()', validationResults);
                const errorResponse = this.createResponseObject(400, null);
                validationResponse = {
                    isValid: false,
                    data: errorResponse,
                    requestorId: requestorProfileId
                };
            }
            if (requestorType !== 'system') {
                let subjectInRequestBody = ((requestBody || {}).subject || {}).reference || '';
                subjectInRequestBody = subjectInRequestBody.replace('UserProfile/', '');
                if (subjectInRequestBody !== requestorProfileId) {
                    // return invalid requestor response here
                    log.info('Requestor profile id does not match profile id in requestBody VaccinationUtility::extraceRequestDataAndValidateRequest()', validationResponse);
                    const errorResponse = this.createResponseObject(401, null);
                    validationResponse = {
                        isValid: false,
                        data: errorResponse,
                        requestorId: requestorProfileId
                    };
                }
            }
            validationResponse = {
                isValid: true,
                data: requestBody,
                requestorId: requestorProfileId
            };
            return validationResponse;
        }
        catch (error) {
            log.error('Errored out in VaccinationUtility::extraceRequestDataAndValidateRequest', error);
        }
        return undefined;
    }
    /**
     *
     * @param body
     * @param schema
     */
    validateRequestBody(body, schema) {
        try {
            let validationResponse = {
                isValid: true,
                errors: []
            };
            log.info('Entered VaccinationUtility::validateRequestBody()');
            const v = new jsonschema_1.Validator();
            const validationResults = v
                .validate(body, schema)
                .toString()
                .split(/\n/);
            if (validationResults.length > 1) {
                validationResponse = {
                    isValid: false,
                    errors: validationResults
                };
            }
            return validationResponse;
        }
        catch (error) {
            log.error('Error in validation function', error);
        }
    }
    /**
     * safely get deeply nested property
     *
     * @returns {any} returns property if present else {}
     * @param {Object} propertyList list of object keys which are ancestors of the key whos value is being requested
     * @param {Object} object object on which the get property is to be performed
     */
    getProp = (propertyList, object) => propertyList.reduce((innerObj, property) => (innerObj && innerObj[property] ? innerObj[property] : {}), object);
    /**
     * Create Lambda proxy response object
     *
     * @returns {Object}
     * @param {Number} status HTTP status
     * @param {Any} data data to be sent in HTTP response
     */
    createResponseObject(status, data) {
        const responseStatus = status || 500;
        let responseData;
        if (data) {
            responseData = typeof data === 'string' ? { message: data } : data;
        }
        else {
            responseData = responses[status.toString()];
        }
        const response = {
            statusCode: responseStatus,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify(responseData)
        };
        log.info('Created response body in  utilities :: createResponseObject()');
        return response;
    }
}
exports.CandidateUtility = CandidateUtility;
