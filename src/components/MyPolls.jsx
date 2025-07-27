import React from "react";
import { Link } from "react-router-dom";
import "./MyPolls.css";

const MyPolls = ({ polls }) => {
  return (
    <div className="polls-list">
      <h2>All Polls</h2>
      {polls.length > 0 ? (
        polls.map((poll) => (
          <Link to={`/polls/${poll.id}`} key={poll.id} className="polls-link">
            <div 
              className={`polls-card
                ${poll.disabled ? "disabled" : 
                  poll.status === "Draft" ? "draft" :
                  poll.status === "Open" ? "open" : "closed"
                }`} 
            >
              <h3>{poll.title}</h3>
              <h4>{poll.description}</h4>
              <h5>{poll.status}</h5>
            </div>
          </Link>
        ))
      ) : (
        <p>No polls found</p>
      )}
    </div>
  );
};

export default MyPolls;
