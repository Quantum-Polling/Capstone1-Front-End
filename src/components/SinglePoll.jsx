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

  // const handleDisabler = (opt) => {
  //   if (!ballot.includes(opt)) {
  //     setBallot([...ballot, option]);
  //     setIsDisabled(true);
  //     console.log("this option is disabled because it was already chosen");
  //   }
  // };

  const handleBallotClick = (option, index) => {
    // console.log("Option clicked:", option);
    // // setIsDisabled(false);
    // if (!ballot.includes(option)) {
    //   setBallot([...ballot, option]);
    //   // setIsDisabled(true);
    // } else {
    //   console.log("thats already in the list bro");
    // }

    console.log("option clicked", option);
    if (!ballot.includes(option)) {
      console.log("hello");
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
        <div
          className="single-poll-options"
          // style={{
          //   cursor: isDisabled ? "not-allowed" : "pointer",
          // }}
          // onClick={(e) =>
          //   !isDisabled && handleBallotClick(e.target.textContent)
          // }
        >
          {poll.poll_options.map((option, index) => (
            <h3
              style={{
                cursor: isDisabled[index] ? "not-allowed" : "pointer",
              }}
              onClick={(e) =>
                !isDisabled[index] &&
                handleBallotClick(e.target.textContent, index)
              }
            >
              {option.text}{" "}
            </h3>
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
