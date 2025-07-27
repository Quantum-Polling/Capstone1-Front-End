import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyPolls.css";

const MyPolls = ({ polls, getPolls }) => {
  const navigate = useNavigate();

  const deleteDraft = (event) => {
    const pollId = event.target.value;
    console.log("Delete Draft");
    event.stopPropagation();
  }

  const closePoll = (event) => {
    const pollId = event.target.value;
    console.log("Close Poll");
    event.stopPropagation();
  }

  return (
    <div className="polls-list">
      <h2>All Polls</h2>
      {polls.length > 0 ? (
        polls.map((poll) => (
          <div
            onClick= {() => {navigate(`/polls/${poll.id}${
              poll.status === "Draft" ? "/edit" :
              poll.status === "Closed" ? "/results" : ""
              }`)
            }}
            key={poll.id}
            className="polls-link"
          >
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
              <div className="actions">
                { /* Delete Draft Button */
                  poll.status === "Draft" &&
                  <button
                    value={poll.id}
                    onClick={deleteDraft}
                  >
                    Delete Draft
                  </button>
                }
                { /* Manually Close Poll Button */
                  poll.status === "Open" &&
                  poll.close_date === null &&
                  <button 
                    value={poll.id}
                    onClick={closePoll}
                  >
                    Close Poll
                  </button>
                }
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No polls found</p>
      )}
    </div>
  );
};

export default MyPolls;
