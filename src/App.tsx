import React from "react";
import "./App.css";
import CandidatePage from "./pages/candidate.page";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * @TODO interface things
 * implement loading state
 * return errors to the screen
 *
 * @TODO state things
 * implement redux
 * undo, redo
 */

function App() {
  return (
    <div className="App">
      <CandidatePage />
    </div>
  );
}

export default App;
