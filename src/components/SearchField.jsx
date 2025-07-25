import React, { useState } from "react";
import "./SearchField.css";

const SearchField = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <form className="search-input" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
      />
    </form>
  );
};

export default SearchField;
