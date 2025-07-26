import React from "react";
import PollCard from "./PollCard";
import "./PollList.css";
//pass down props(in this case 'polls') so we can map thru and display them
const PollList = ({ polls }) => {
  console.log("Polls:", polls);
  return (
    <div className="poll-list">
      {polls.length > 0 ? (
        polls.map((poll) => <PollCard key={poll.id} poll={poll} />)
      ) : (
        <p>No polls found</p>
      )}
    </div>
  );
};

export default PollList;
