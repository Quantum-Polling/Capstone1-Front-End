import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../shared";
import axios from "axios";

const PollResults = () => {
  const { pollId } = useParams();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  const loadResults = async () => {
    if (!pollId)
      return <p>Cannot load poll results without poll ID</p>

    /* REMOVE LATER AFTER TESTING: THIS WILL BE PASSED AS A PROP */
    let poll = {};
    let options = [];
    try {
      const pollResponse = await axios.get(`${API_URL}/api/polls/${pollId}`);
      poll = pollResponse.data.poll;
      options = poll.poll_options;
      console.log("POLL RESULTS OPTIONS:", options);
    } catch (error) {
      console.error(error);
      return;
    }
    /* END REMOVE LATER */

    const response = await axios.get(`${API_URL}/api/polls/${pollId}/results`);
    const results = response.data.results;
    console.log("POLL RESULTS:", results);
    setResults(results);
    setLoading(false);
  };

  useEffect(() => {
    loadResults();
  }, []);

  if (loading)
    return <p>Loading...</p>
};

export default PollResults;