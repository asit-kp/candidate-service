import * as AWS from 'aws-sdk';
export declare class CandidateService {
    constructor();
    postCandidateData(fullname: any, email: any, experience: any): {
        id: string;
        fullname: any;
        email: any;
        experience: any;
        submittedAt: number;
        updatedAt: number;
    };
    submitCandidateData(candidate: any): Promise<any>;
    scanCandidate(params: any): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.DynamoDB.DocumentClient.ScanOutput, AWS.AWSError>>;
    getCandidate(params: any): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.DynamoDB.DocumentClient.GetItemOutput, AWS.AWSError>>;
    deleteCandidate(params: any): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.DynamoDB.DocumentClient.DeleteItemOutput, AWS.AWSError>>;
}
