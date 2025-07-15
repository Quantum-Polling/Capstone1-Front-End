import React from "react";

const OptionInput = ({ index, option, onChange, onDelete }) => {
  return (
    <li className="poll-option">
      <input 
        type="text"
        placeholder={"Option " + (index + 1)}
        value={option}
        onChange={(e) => {onChange(e, index)}}
      />
      <button type="button" onClick={() => {onDelete(index)}} value={index}>➖</button>
    </li>
  );
};

export default OptionInput;