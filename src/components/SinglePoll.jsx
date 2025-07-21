import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { API_URL } from "../shared";

const SinglePoll = () => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id;

  const getSinglePoll = async () => {
    try {
      await axios.get(`${API_URL}/api/polls/${id}`).then((response) => {
        setPoll(response.data.poll);
      });
    } catch (err) {
      console.error("error:", err);
    }
  };
  useEffect(() => {
    getSinglePoll();
    setLoading(false);
  }, [id]);

  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <div>
      <ul>
        {poll && poll.poll_options.map((option) => <li>{option.text} </li>)}
      </ul>
    </div>
  );
};
export default SinglePoll;
