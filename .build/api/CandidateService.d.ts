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
    scanCandidate(params: any, callback: any): Promise<void>;
}
