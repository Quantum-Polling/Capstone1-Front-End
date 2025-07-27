import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { API_URL } from "../shared";
import "./PollList.css";

const SinglePoll = () => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ballot, setBallot] = useState([]);
  const [isDisabled, setIsDisabled] = useState([]);
  const params = useParams();
  const id = params.id;

  const handleBallotClick = (option, index) => {
    console.log("option clicked", option);
    if (!ballot.includes(option)) {
      setBallot([...ballot, option]);
      setIsDisabled([
        ...isDisabled.slice(0, index),
        true,
        ...isDisabled.slice(index + 1),
      ]);
    }
  };

  const getSinglePoll = async () => {
    try {
      await axios.get(`${API_URL}/api/polls/${id}`).then((response) => {
        setPoll(response.data.poll);
        setIsDisabled(
          new Array(response.data.poll.poll_options.length).fill(false)
        );
        setLoading(false);
      });
    } catch (err) {
      console.error("error:", err);
    }
  };
  useEffect(() => {
    getSinglePoll();
  }, []);

  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <div>
      <div className="poll-card">
        <div className="poll-title">{poll.title}</div>
        <h2 className="poll-description">{poll.description}</h2>
        <div className="single-poll-options">
          {poll.poll_options.map((option, index) => (
            <h3
              key={option._id || option.id}
              style={{
                cursor: isDisabled[index] ? "not-allowed" : "pointer",
              }}
              onClick={(e) =>
                !isDisabled[index] &&
                handleBallotClick(e.target.textContent, index)
              }
            >
              {option.text}
            </h3>
          ))}
        </div>
        <div className="poll-close-date">
          Closes: {poll.close_date ? poll.close_date : "Manually"}
        </div>
      </div>
      <div className="ballot-container">
        <ol className="single-ballot-choices">
          {ballot.map((opt, i) => (
            <li key={i}>
              <h3>{opt}</h3>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
export default SinglePoll;
