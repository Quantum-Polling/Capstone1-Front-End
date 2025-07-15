import React from "react";

//pass down props(in this case 'polls') so we can map thru and display them
const PollList = ({ polls }) => {
  return (
    <div className="poll-list">
      <h2>Here are the list of polls!</h2>
      {polls.length > 0 ? (
        polls.map((poll) => (
          <div className="poll-card">
            <h3>{poll.title}</h3>
          </div>
        ))
      ) : (
        <p>No polls found</p>
      )}
    </div>
  );
};

export default PollList;
