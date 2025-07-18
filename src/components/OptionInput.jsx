import React from "react";

const OptionInput = ({ index, option, onChange, onDelete, displayButton }) => {
  return (
    <li className="poll-option">
      <input 
        required
        type="text"
        placeholder={"Option " + (index + 1)}
        value={option}
        onChange={(e) => {onChange(e, index)}}
      />
      {
        displayButton && 
        <button type="button" onClick={() => {onDelete(index)}} value={index}>➖</button>
      }
    </li>
  );
};

export default OptionInput;