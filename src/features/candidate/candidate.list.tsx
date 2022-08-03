import React, { useEffect, useState } from "react";
import { Candidate } from "./candidate.model";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import CandidateDetails from "./candidate.details";

import Accordion from "react-bootstrap/Accordion";
import { Badge, Container } from "react-bootstrap";

interface CandidateListProps {
  candidates: Candidate[];
  handleLoadMoreCandidates: () => void;
}

enum Filters {
  REVIEWED,
  REJECTED,
  APPROVED,
}

const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
}: // handleSelectCandidate,
CandidateListProps) => {
  const [candidatesInView, setCandidatesInView] =
    useState<Candidate[]>(candidates);

  const [selectedFilters, setSelectedFilters] = useState<Filters[]>([]);

  useEffect(() => {
    console.log("candidates updated");
    setCandidatesInView(candidates);
    updateFilterdList(candidates);
  }, [candidates]);

  const updateFilterdList = (candidates: Candidate[]): void => {
    if (selectedFilters.length === 0) return;

    selectedFilters.forEach((filterType: Filters) => {
      applyFilter(filterType, candidates);
    });
  };

  const handleClearFilters = (): void => {
    setCandidatesInView(candidates);
    setSelectedFilters([]);
  };

  const applyFilter = (filterType: Filters, candidates: Candidate[]): void => {
    let filteredList: Candidate[] = [];

    switch (filterType) {
      case Filters.REJECTED:
        filteredList = candidates.filter(
          (candidate) => candidate.approved !== null && !candidate.approved
        );
        setSelectedFilters([Filters.REJECTED]);
        break;
      case Filters.APPROVED:
        filteredList = candidates.filter(
          (candidate) => candidate.approved !== null && candidate.approved
        );
        setSelectedFilters([Filters.APPROVED]);
        break;
      default:
        filteredList = candidates;
    }

    setCandidatesInView(filteredList);
    // handleSelectCandidate(null);
  };

  return candidates.length > 0 ? (
    <>
      {/* <button
        disabled={
          selectedFilters.length > 0 &&
          selectedFilters.indexOf(Filters.REJECTED) !== -1
        }
        onClick={() => applyFilter(Filters.REJECTED, candidates)}
      >
        Rejected
      </button>

      <button
        disabled={
          selectedFilters.length > 0 &&
          selectedFilters.indexOf(Filters.APPROVED) !== -1
        }
        onClick={() => applyFilter(Filters.APPROVED, candidates)}
      >
        Approved
      </button>

      {selectedFilters.length > 0 && (
        <button onClick={handleClearFilters}>Clear Filters</button>
      )} */}

      {candidatesInView.length > 0 ? (
        <Accordion defaultActiveKey="0" flush>
          {candidatesInView.map((candidate, index) => {
            return (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>
                  <Container>
                    <Row>
                      <Col>
                        {candidate.firstName} {candidate.lastName}
                      </Col>
                      <Col dir="rtl">
                        {candidate.approved !== null ? (
                          candidate.approved ? (
                            <Badge bg="success">Approved</Badge>
                          ) : (
                            <Badge bg="danger">Rejected</Badge>
                          )
                        ) : (
                          <Badge bg="secondary">Pending Review</Badge>
                        )}
                      </Col>
                    </Row>
                  </Container>
                </Accordion.Header>
                <Accordion.Body>
                  <CandidateDetails candidate={candidate} />
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      ) : (
        <p>Loading...</p>
      )}
    </>
  ) : (
    <p>Loading ...</p>
  );
};

export default CandidateList;
