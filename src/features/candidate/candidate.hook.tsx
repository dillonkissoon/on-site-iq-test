import React, { useState } from "react";
import { Candidate, ICandidateHttpResponse, IComment } from "./candidate.model";
import * as CandidateService from "./candidate.service";
import { createContainer } from "unstated-next";

/**
 * mock user to add identity to comments as no auth service
 */
export const user = {
  email: "hrmanager@examplecompnay.com",
  name: "HR Manager",
  userId: "0",
};

/**
 * interface for the return object of useCandidate()
 */
export interface IUseCandidate {
  approveCandidate: (candidate: Candidate) => void;
  candidates: Candidate[];
  commentCandidate: (
    candidate: Candidate,
    comment: string,
    userId: string
  ) => void;
  getCandidates: () => Promise<Candidate[]>;
  rejectCandidate: (candidate: Candidate) => void;
  resetApprovalStatus: (candidate: Candidate) => void;
}

export const useCandidateLogic = (): IUseCandidate => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  /**
   * approve a candidate
   */
  const approveCandidate = (candidate: Candidate): void => {
    candidate.approveCandidate();
    updateCandidateList(candidate);
  };

  const rejectCandidate = (candidate: Candidate): void => {
    candidate.rejectCandidate();
    updateCandidateList(candidate);
  };

  /**
   * undo approval or rejection of candidate
   */
  const resetApprovalStatus = (candidate: Candidate): void => {
    candidate.resetApproval();
    updateCandidateList(candidate);
  };

  /**
   * add a comment to the candidate
   */
  const commentCandidate = (
    candidate: Candidate,
    comment: string,
    userId: string
  ): void => {
    candidate.updateComment(comment, user.userId);
    updateCandidateList(candidate);
  };

  /**
   * replace the candidate that updated in state
   */
  const updateCandidateList = (updatedCandidate: Candidate): void => {
    const updatedCandidates: Candidate[] = candidates.map(
      (current: Candidate): Candidate => {
        const { uuid } = current;
        if (uuid === updatedCandidate.uuid) {
          current = updatedCandidate;
        }
        return current;
      }
    );
    CandidateService.persistReviewedCandidates(updatedCandidates);
    setCandidates(updatedCandidates);
  };

  /**
   * GET list of candidtes from API
   */
  const getCandidates = async (): Promise<Candidate[]> => {
    try {
      const persisted = CandidateService.getPersitedCandidateData();
      const formattedCandidates: Candidate[] = formatCandidatesData(
        await CandidateService.getCandidates()
      );

      // adding this because no real API and need to remove any UUIDs that could match
      const uuids = persisted.map((c) => c.uuid);
      const filtered = formattedCandidates.filter(
        (c) => uuids.indexOf(c.uuid) == -1
      );
      // End hack

      setCandidates([...persisted, ...filtered]);

      return formattedCandidates;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  /**
   * Format results returned from API response    *
   */
  const formatCandidatesData = (
    candidates: ICandidateHttpResponse[]
  ): Candidate[] => {
    const formattedCandidates: Candidate[] = candidates.map(
      (candidate: ICandidateHttpResponse): Candidate => {
        return new Candidate(
          candidate.cell,
          candidate.email,
          candidate.name.first,
          candidate.name.last,
          candidate.phone,
          candidate.login.uuid // @TODO: uuid from API not always unique
        );
      }
    );

    return formattedCandidates;
  };

  return {
    approveCandidate,
    candidates,
    commentCandidate,
    getCandidates,
    rejectCandidate,
    resetApprovalStatus,
  };
};

/**
 * create context from factory method to return interface of IUseCandidate to components
 */
export const CandidateContext = createContainer(useCandidateLogic);

/**
 * exported methods and state to components
 */
export const useCandidate = (): IUseCandidate => {
  return CandidateContext.useContainer();
};
