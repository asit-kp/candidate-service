import { APIGatewayEvent, Context, ProxyCallback } from 'aws-lambda';
export declare class CandidateController {
    static initialized: boolean;
    constructor();
    static init(): void;
    postCandidateDetails(event: APIGatewayEvent, context: Context, callback: ProxyCallback): Promise<void>;
    listCandidateDetails(event: APIGatewayEvent, context: Context, callback: ProxyCallback): Promise<void>;
}
