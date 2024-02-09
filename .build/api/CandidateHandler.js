"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCandidateHandler = exports.getCandidateHandler = exports.listCandidateHandler = exports.postCandidateHandler = void 0;
const CandidateController_1 = require("./CandidateController");
const controller = new CandidateController_1.CandidateController();
exports.postCandidateHandler = controller.postCandidateDetails;
exports.listCandidateHandler = controller.listCandidateDetails;
exports.getCandidateHandler = controller.getCandidateDetails;
exports.deleteCandidateHandler = controller.deleteCandidateDetails;
