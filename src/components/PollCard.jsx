import React from "react";
import "./PollList.css";
//pass down one poll at a time
const PollCard = ({ poll }) => {
  return (
    <div className="poll-card">
      <h3>
        {poll.title}
        {poll.description}
      </h3>
    </div>
  );
};

export default PollCard;
