import React, { useState } from "react";
import { useCandidate, user } from "./candidate.hook";
import { Candidate } from "./candidate.model";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";

interface CandidateDetailsProps {
  candidate: Candidate;
}

const CandidateDetails: React.FC<CandidateDetailsProps> = ({
  candidate,
}: CandidateDetailsProps) => {
  const {
    approveCandidate,
    rejectCandidate,
    resetApprovalStatus,
    commentCandidate,
  } = useCandidate();

  const [comment, setComment] = useState<string>("");

  const handleAddNewComment = (event: any) => {
    if (event) event.preventDefault();
    commentCandidate(candidate, comment, user.userId);
    setComment("");
  };
  const { firstName, lastName, approved, uuid, comments } = candidate;

  return (
    <>
      <Card className="candidate-details">
        <Card.Header>
          <h4 className="m0">Review Candidate: {`${firstName} ${lastName}`}</h4>
        </Card.Header>
        <Card.Body>
          {approved === null ? (
            <>
              <Card.Title>Decide this candidate status</Card.Title>
              <Card.Text>What do you think about this candidate?</Card.Text>
              <ButtonGroup aria-label="select-candidate">
                <Button
                  variant="success"
                  onClick={() => approveCandidate(candidate)}
                >
                  approve
                </Button>
                <Button
                  variant="danger"
                  onClick={() => rejectCandidate(candidate)}
                >
                  reject
                </Button>
              </ButtonGroup>
            </>
          ) : (
            <>
              <Card.Title>
                This candidate is {approved ? "approved" : "rejected"}
              </Card.Title>
              <Card.Text>You can undo this decion below:</Card.Text>
              <Button
                variant="warning"
                onClick={() => resetApprovalStatus(candidate)}
              >
                Undo {approved ? "Approval" : "Rejection"}
              </Button>
            </>
          )}

          <Form onSubmit={handleAddNewComment} className="mt-3">
            <InputGroup>
              <InputGroup.Text>Comment</InputGroup.Text>
              <Form.Control
                as="textarea"
                aria-label="Comment"
                onChange={(event) => setComment(event.target.value)}
                value={comment}
                name="comment"
                placeholder="Add a comment..."
              />
            </InputGroup>

            <Button disabled={comment === ""} className="mt-3" type="submit">
              Submit Comment
            </Button>
          </Form>

          <div className="mt-3">
            {comments.length > 0 ? (
              <>
                <hr />
                <h5 className="mt-2">
                  What your peers are saying about {firstName}
                </h5>

                {comments.map(({ comment }, index) => (
                  <Card className="mb-3" key={index}>
                    <Card.Body>
                      <blockquote className="blockquote mb-0">
                        <p> {comment} </p>
                        <footer className="blockquote-footer">
                          {user.name}
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Card>
                ))}
              </>
            ) : (
              ""
            )}
          </div>
        </Card.Body>
        <Card.Footer>{uuid}</Card.Footer>
      </Card>
    </>
  );
};

export default CandidateDetails;
