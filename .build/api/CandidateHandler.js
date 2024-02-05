"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCandidateHandler = exports.postCandidateHandler = void 0;
const CandidateController_1 = require("./CandidateController");
const controller = new CandidateController_1.CandidateController();
exports.postCandidateHandler = controller.postCandidateDetails;
exports.listCandidateHandler = controller.listCandidateDetails;
