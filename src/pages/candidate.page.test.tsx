import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  getByText,
} from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import CandidatePage from "./candidate.page";
import CandidatesHttpMock from "../features/candidate/candidates.example.http.response.json";

const server = setupServer(
  rest.get("https://randomuser.me/api", (req, res, ctx) => {
    return res(ctx.json({ ...CandidatesHttpMock }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("loads and displays candidates", async () => {
  render(<CandidatePage />);
  const candidates = await screen.findAllByText(/Pending Review/i);
  expect(candidates.length).toBe(5);
});

test("select and display a candidate", async () => {
  render(<CandidatePage />);

  const candidates = await screen.findAllByText(/Pending Review/i);
  fireEvent(
    candidates[0],
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );

  await waitFor(() => {
    expect(
      screen.queryByText(CandidatesHttpMock.results[0].login.uuid)
    ).toBeInTheDocument();
  });
});

test("add a comment to candidate", async () => {
  render(<CandidatePage />);
  // select a candidate
  let candidates = await screen.findAllByText(/Pending Review/i);
  fireEvent(
    candidates[0],
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );

  await waitFor(() => {
    expect(
      screen.queryByText(CandidatesHttpMock.results[0].login.uuid)
    ).toBeInTheDocument();
  });

  // add a comment
  let input = await screen.findAllByPlaceholderText("Add a comment...");
  let button = await screen.findAllByText("Submit Comment");

  fireEvent.change(input[0], { target: { value: "adding a comment" } });

  fireEvent(
    button[0],
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );

  await waitFor(() => {
    expect(screen.queryByText("adding a comment")).toBeInTheDocument();
  });
});

test("can approve or reject candidate and also undo", async () => {
  render(<CandidatePage />);

  // select a candidate to view
  let candidates = await screen.findAllByText(/Pending Review/i);
  fireEvent(
    candidates[0],
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );

  await waitFor(() => {
    expect(
      screen.queryByText(CandidatesHttpMock.results[0].login.uuid)
    ).toBeInTheDocument();
  });

  // approve selected candidate
  let buttonToClick = await screen.findAllByText("approve");

  fireEvent(
    buttonToClick[0],
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );

  await waitFor(() => {
    expect(
      screen.queryByText(`This candidate is approved`)
    ).toBeInTheDocument();
  });

  // undo selection
  buttonToClick = await screen.findAllByText("Undo Approval");

  fireEvent(
    buttonToClick[0],
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );

  // reject candidate
  buttonToClick = await screen.findAllByText("reject");

  fireEvent(
    buttonToClick[0],
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );

  await waitFor(() => {
    expect(
      screen.queryByText(`This candidate is rejected`)
    ).toBeInTheDocument();
  });
});

test("persist approved, rejected, and has comment candiate(s) on page reload", async () => {
  render(<CandidatePage />);
  // reviewed candidate criteria: approved, rejected, has comment
});
