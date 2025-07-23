import React, { useState } from "react";
import PollCard from "./PollCard";
import "./PollList.css";
import SearchField from "./SearchField";

const PollList = ({ polls }) => {
  const [filteredPolls, setFilteredPolls] = useState(polls);

  // Update filteredPolls when polls prop changes
  React.useEffect(() => {
    setFilteredPolls(polls);
  }, [polls]);

  const handleSearch = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    setFilteredPolls(
      polls.filter((poll) => poll.title.toLowerCase().includes(term))
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
