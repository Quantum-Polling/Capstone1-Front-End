import React from "react";
import "./PollList.css";
//pass down one poll at a time
const PollCard = ({ poll }) => {
  return (
    <div className="poll-card">
      <div className="poll-title">{poll.title}</div>
      <div className="poll-author">
        {/* Created by: {poll.creatorId.creator.creatorFirstName}{" "}
        {poll.creatorId.creatorLastName} */}
      </div>
      <div className="poll-close-date">
        Closes: {poll.close_date ? poll.close_date : Manually}
      </div>
      <div className="poll-auth-votes">
        {poll.authVotes ? "Open to all" : "Logged in Users Only"}
      </div>
      <div className="poll-options">{poll.poll_options.length} options</div>
    </div>
  );
};

export default PollCard;
