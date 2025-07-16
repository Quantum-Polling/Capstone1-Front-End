import React, { useState } from "react";
import SearchBar from "./Searchbar";
const Home = () => {
  const [searchResult, setSearchResult] = useState("");

  const handleSearch = (query) => {
    console.log("Search for:", query);
  };
  return (
    <div className="home-container">
      <SearchBar onSearch={handleSearch} />
      {searchResult && <p>{searchResult}</p>}
    </div>
    
  );
};

export default Home;
