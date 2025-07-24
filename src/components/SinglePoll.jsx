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
  const [isDisabled, setIsDisabled] = useState(false);
  const params = useParams();
  const id = params.id;

  // const handleDisabler = (opt) => {
  //   if (!ballot.includes(opt)) {
  //     setBallot([...ballot, option]);
  //     setIsDisabled(true);
  //     console.log("this option is disabled because it was already chosen");
  //   }
  // };

  const handleBallotClick = (option) => {
    console.log("Option clicked:", option);
    if (!ballot.includes(option)) {
      if (setBallot([...ballot, option])) {
        setIsDisabled(true);
      }
    } else {
      console.log("thats already in the list bro");
    }
  };

  const getSinglePoll = async () => {
    try {
      await axios.get(`${API_URL}/api/polls/${id}`).then((response) => {
        setPoll(response.data.poll);
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
        <div
          className="single-poll-options"
          style={{
            cursor: isDisabled ? "not-allowed" : "pointer",
          }}
          onClick={(e) =>
            !isDisabled && handleBallotClick(e.target.textContent)
          }
        >
          {poll.poll_options.map((option) => (
            <h3>{option.text} </h3>
          ))}
        </div>
      </div>
      <div className="ballot-container">
        <ol
          className="ballot-options"
          // onClick={(e) => isDisabled && handleDisabler(e.target.textContent)}
        >
          {ballot.map((opt) => (
            <li>{opt}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};
export default SinglePoll;
