import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../shared";
import axios from "axios";
import "./MyPolls.css";

const MyPolls = ({ user }) => {
  if (!user)
    return <p>Log in to view your polls</p>

  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);

  const deleteDraft = async (event) => {
    event.stopPropagation();
    const pollId = event.target.value;
    if (window.confirm("Are you sure you want to delete this draft?")) {
      try {
        const response = await axios.delete(`${API_URL}/api/polls/${user.id}/delete/${pollId}`, {
          withCredentials: true,
        });
        getPolls();
      } catch (error) {
        console.error(error);
      }
    }
  }

  const closePoll = async (event) => {
    event.stopPropagation();
    const pollId = event.target.value;
    if (window.confirm("Are you sure you want to close this poll?")) {
      try {
        const response = await axios.patch(`${API_URL}/api/polls/${user.id}/close/${pollId}`, {}, {
          withCredentials: true,
        });
        getPolls();
      } catch (error) {
        console.error(error);
      }
    }
  }

  const getPolls = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/polls/mypolls`, {
        params: { userId: user.id },   // Pass as query param
        withCredentials: true
      });
      console.log(response.data);
      setPolls(response.data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
      getPolls();
  }, []);

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
              <div className="details">
                <h3>{poll.title}</h3>
                <h4>{poll.description}</h4>
                <h5>{poll.status}</h5>
              </div>
              <div className="actions">
                { /* Delete Draft Button */
                  poll.status === "Draft" &&
                  <button
                    value={poll.id}
                    onClick={deleteDraft}
                  >
                    Delete
                  </button>
                }
                { /* Manually Close Poll Button */
                  poll.status === "Open" &&
                  poll.close_date === null &&
                  <button 
                    value={poll.id}
                    onClick={closePoll}
                  >
                    Close
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
