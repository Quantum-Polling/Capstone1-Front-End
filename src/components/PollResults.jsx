import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../shared";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";
import "./PollStyles.css";
import Stack from "@mui/material/Stack";


const PollResults = () => {
  const { pollId } = useParams();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [round, setRound] = useState(-1);

  /* REMOVE LATER */
  const [options, setOptions] = useState([]);

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
      setOptions(options);
      console.log("POLL RESULTS OPTIONS:", options);
    } catch (error) {
      console.error(error);
      return <p>{error}</p>;
    }
    /* END REMOVE LATER */

    const response = await axios.get(`${API_URL}/api/polls/${pollId}/results`);
    const results = response.data.results;
    console.log("POLL RESULTS:", results);
    setResults(results);
    setRound(0);
    setLoading(false);
  };

  useEffect(() => {
    loadResults();
  }, []);

  if (loading)
    return <p>Loading...</p>

  const getData = () => {
    return results[round].map((roundResult, index) => (
      {
        id: index,
        value: roundResult,
        label: options[index].text,
      }
    ));
  }

  return (
    <div className="poll-results drop-shadow">
      <div className="previous drop-shadow">
        <div className="arrow left"></div>
      </div>
      <div className="next drop-shadow">
        <div className="arrow right"></div>
      </div>
      <h5>Hover to view individual results</h5>
      <PieChart 
        series={[
          {
            innerRadius: 45,
            outerRadius: 60,
            startAngle: -100,
            endAngle: 100,
            data: [...getData()],
          },
        ]}
        width={250}
        height={150}
        hideLegend
      />
      <h1>Round {round + 1}</h1>
    </div>
  );
};

export default PollResults;