import React, { useEffect, useState } from "react";
import { API_URL } from "../shared";
import PollCard from "./PollCard";
import SearchField from "./SearchField";
import axios from "axios";
import "./PollList.css";

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);

  const getPolls = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/polls`, {
        withCredentials: true,
      });
      setPolls(response.data);
      setFilteredPolls(response.data.filter((poll) => poll.status === "Open"));
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    getPolls();
  }, []);

  const handleSearch = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    const openPolls = polls.filter((poll) => poll.status === "Open");
    console.log(openPolls);
    setFilteredPolls(
      openPolls.filter((poll) => poll.title.toLowerCase().includes(term))
    );
  };

  return (
    <>
      <SearchField onSearch={handleSearch} />
      <div className="poll-list">
        {filteredPolls.length > 0 ? (
          filteredPolls.map((poll) => <PollCard key={poll.id} poll={poll} />)
        ) : (
          <p>No polls found</p>
        )}
      </div>
    </>
  );
};

export default PollList;
