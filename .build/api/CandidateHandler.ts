import { CandidateController } from './CandidateController';

const controller: CandidateController = new CandidateController();

export const postCandidateHandler: any = controller.postCandidateDetails;
export const listCandidateHandler: any = controller.listCandidateDetails;
