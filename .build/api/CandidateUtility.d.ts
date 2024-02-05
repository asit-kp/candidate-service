export declare class CandidateUtility {
    /**
     * returns random uuid number
     */
    createUUID(): string;
    /**
   *
   * @param event
   */
    extractRequestDataAndValidateRequest(event: any, method: any): {
        isValid: boolean;
        data: any;
        requestorId: any;
    };
    /**
     *
     * @param body
     * @param schema
     */
    validateRequestBody(body: any, schema: any): {
        isValid: boolean;
        errors: any[];
    };
    /**
     * safely get deeply nested property
     *
     * @returns {any} returns property if present else {}
     * @param {Object} propertyList list of object keys which are ancestors of the key whos value is being requested
     * @param {Object} object object on which the get property is to be performed
     */
    getProp: (propertyList: any, object: any) => any;
    /**
     * Create Lambda proxy response object
     *
     * @returns {Object}
     * @param {Number} status HTTP status
     * @param {Any} data data to be sent in HTTP response
     */
    createResponseObject(status: any, data: any): {
        statusCode: any;
        headers: {
            'Access-Control-Allow-Origin': string;
            'Access-Control-Allow-Credentials': boolean;
        };
        body: string;
    };
}
