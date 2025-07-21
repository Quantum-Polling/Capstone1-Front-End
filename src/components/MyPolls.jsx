import React from "react";
import "./MyPolls.css";
const PollList = ({ polls }) => {
  return (
    <div className="poll-list">
      <h2>All Polls</h2>
      {polls.length > 0 ? (
        polls.map((poll) => (
          <div className="poll-card">
            <h3>{poll.title}</h3>
            <h4>{poll.description}</h4>
            <h5>{poll.status}</h5>
          </div>
        ))
      ) : (
        <p>No polls found</p>
      )}
    </div>
  );
};

export default PollList;
