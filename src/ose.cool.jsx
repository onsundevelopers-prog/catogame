// ose.cool is a simple game system like neal.fun but with brainrot games

import React from "react";
import brainrot from "./brainro1.png";

export default function OseCool() {
  return (
    <h1 id="ose-cool">Ose.Cool</h1>
  );
}

export function BrainrotCatalogue() {

  const playGame = () => {
    window.location.href = "/brainrot-clicker";
  };

  return (
    <div>
      <h1>Catalogue</h1>

      {/* Bento boxes */}
      <div className="bentoboxes">

        <div className="bentobox">
          <h2>Brainrot Clicker</h2>

          <img
            src={brainrot}
            alt="brainrot"
            width="200"
            style={{ borderRadius: "10px" }}
          />

          <button onClick={playGame}>Play</button>
        </div>

      </div>

      <a href="/brainrot-clicker" className="page-link">
        <img
          alt="brainrot"
          src={brainrot}
          className="page-link-img"
          width="200"
        />
      </a>
    </div>
  );
}