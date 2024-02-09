import { CandidateController } from './CandidateController';

const controller: CandidateController = new CandidateController();

export const postCandidateHandler: any = controller.postCandidateDetails;
export const listCandidateHandler: any = controller.listCandidateDetails;
export const getCandidateHandler: any = controller.getCandidateDetails;
export const deleteCandidateHandler: any = controller.deleteCandidateDetails;
