import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { API_URL } from "../shared";
import "./PollList.css";

const SinglePoll = () => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id;

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
        <h2 className="poll-description">{poll.description}</h2>
        {poll.poll_options.map((option) => (
          <React.Fragment key={option._id || option.id}>
            <h3>{option.text}</h3>
          </React.Fragment>
        ))}
        <div className="poll-close-date">
          Closes: {poll.close_date ? poll.close_date : "Manually"}
        </div>
      </div>
    </div>
  );
};
export default SinglePoll;
