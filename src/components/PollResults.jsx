import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../shared";
import RoundResults from "./RoundResults";
import axios from "axios";
import "./PollStyles.css";


const PollResults = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [winners, setWinners] = useState([]);
  const [round, setRound] = useState(0);
  const [data, setData] = useState([]);
  
  /* REMOVE LATER */
  const { pollId } = useParams();
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
    setWinners(getWinners(results[results.length - 1], options));
    setRound(1);
    setLoading(false);
  };

  const getWinners = (finalRound, options) => {
    if (!finalRound || finalRound.length == 0)
      return;

    const winnerIndexes = [];
    let mostVotes = finalRound[0];
    for (let i = 1; i < finalRound.length; i++) {
      if (finalRound[i] > mostVotes) {
        mostVotes = finalRound[i];
        winnerIndexes.length = 0;
        winnerIndexes.push(i);
      } else if (finalRound[i] === mostVotes) {
        winnerIndexes.push(i);
      }
    }

    const winners = [];
    for (const index of winnerIndexes)
      winners.push(options[index].text);

    return winners;
  }

  useEffect(() => {
    loadResults();
  }, []);

  useEffect(() => {
    if (round < 1 || round > results.length)
      return;

    const roundData = results[round - 1].map((roundResult, index) => (
      {
        id: index,
        value: roundResult,
        label: options[index].text,
      }
    ));
    setData(roundData);
  }, [round]);
  
  if (loading)
    return <p>Loading...</p>
  
  return (
    <div className="poll-results drop-shadow">
      <h1>Winner{winners.length > 1 && "s"}:</h1>
      <h3 className="winner-list">{
        winners.join(", ")
      }</h3>
      <RoundResults 
        data={data}
        round={round}
        setRound={setRound}
        maxRounds={results.length}
      />
    </div>
  );
};

export default PollResults;