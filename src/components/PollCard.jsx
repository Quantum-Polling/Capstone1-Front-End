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
    <div className="polls-card open" onClick={() => handleClick(poll.id)}>
      <div className="details-left">
        <h3>{poll.title}</h3>
        <h4>{poll.description}</h4>
        <h5>Created by: {poll.creator.creatorFirstName} {poll.creator.creatorLastName}</h5>
        <h5>Closes: {poll.close_date ? poll.close_date : "Manually"}</h5>
      </div>
      <div className="details-right">
        <h5>{poll.authVotes ? "Open to all" : "Logged in Users Only"}</h5>
        <h5>{poll.poll_options.length} options</h5>
        <h5>Votes: {poll.poll_votes.length}</h5>
      </div>
    </div>
  );
};

export default PollCard;
