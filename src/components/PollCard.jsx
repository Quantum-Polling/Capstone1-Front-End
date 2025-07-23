import React from "react";
import "./PollList.css";
import { useNavigate } from "react-router";
//pass down one poll at a time
const PollCard = ({ poll }) => {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/polls/${id}`);
  };
  return (
    <div className="poll-card" onClick={() => handleClick(poll.id)}>
      <div className="poll-title">{poll.title}</div>
      <div className="poll-author">
        Created by: {poll.creator.creatorFirstName}{" "}
        {poll.creator.creatorLastName}
      </div>
      <div className="poll-close-date">
        Closes: {poll.close_date ? poll.close_date : "Manually"}
      </div>
      <div className="poll-auth-votes">
        {poll.authVotes ? "Open to all" : "Logged in Users Only"}
      </div>
      <div className="poll-options">
        {poll.poll_options.length} options
        <div className="total-poll-votes">
          {poll.poll_votes.length} total votes
        </div>
        <div className="poll-status"></div>
      </div>
    </div>
  );
};

export default PollCard;
