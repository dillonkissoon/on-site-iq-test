import React, { useEffect, useState } from "react";
import {
  useCandidate,
  CandidateContext,
} from "../features/candidate/candidate.hook";
import CandidateList from "../features/candidate/candidate.list";
import Container from "react-bootstrap/Container";

interface CandidatePageProps {}

const WrappedCandidatePageInContext = () => {
  return (
    <>
      <CandidateContext.Provider>
        <CandidatePage />
      </CandidateContext.Provider>
    </>
  );
};

const CandidatePage: React.FunctionComponent<CandidatePageProps> = () => {
  const { getCandidates, candidates } = useCandidate();

  useEffect(() => {
    try {
      getCandidates();
    } catch (error: any) {
      console.log(`from page ${error.message}`);
    }
  }, []);

  return (
    <>
      <Container>
        <h1>Review Candidates</h1>
        <CandidateList
          candidates={candidates}
          handleLoadMoreCandidates={getCandidates}
        />
      </Container>
    </>
  );
};

export default WrappedCandidatePageInContext;
