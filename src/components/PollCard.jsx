import React from "react";
import "./PollList.css";
//pass down one poll at a time
const PollCard = ({ poll }) => {
  return (
    <div className="poll-card">
      <div className="poll-title">{poll.title}</div>
      <div className="poll-author">
        Created by: {poll.creator.creatorFirstName}{" "}
        {poll.creator.creatorLastName}
      </div>
      <div className="poll-close-date">
        Closes: {poll.close_date ? poll.close_date : Manually}
      </div>
    </div>
  );
};

export default PollCard;
