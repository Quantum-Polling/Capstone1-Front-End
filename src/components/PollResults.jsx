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
  
  const { id } = useParams();
  const [poll, setPoll] = useState({});
  const [options, setOptions] = useState([]);

  const loadResults = async () => {
    if (!id){
      console.error("Cannot load poll results without poll ID");
      return;
    }

    try {
      const pollResponse = await axios.get(`${API_URL}/api/polls/${id}`);
      const pollData = pollResponse.data.poll;
      setPoll(pollData);

      const pollOptions = pollData.poll_options;
      setOptions(pollOptions);

      const response = await axios.get(`${API_URL}/api/polls/${id}/results`);
      const results = response.data.results;
      setResults(results);
      setWinners(getWinners(results[results.length - 1], pollOptions));
      setRound(1);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
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
      <div className="info">
        <h1 className="title">{poll.title}</h1>
        <h5 className="creator">By {poll.creatorName}</h5>
        <h4 className="description">{poll.description}</h4>
      </div>
      <h2>Winner{winners.length > 1 && "s"}:</h2>
      <h4 className="winner-list">{
        winners.join(", ")
      }</h4>
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