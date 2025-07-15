import React, { useEffect } from "react";
import OptionInput from "./OptionInput";

const OptionInputList = ({ options, setOptions }) => {
  
  const editOption = (event, index) => {
    const updatedOptions = [...options];
    updatedOptions[index] = event.target.value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    setOptions([...options.slice(0, index), ...options.slice(index + 1)]);
  };

  return (
    <div className="option-list">
      <button type="button" onClick={addOption}>➕ Add New Option</button>
      <ul>
        { 
          options.length > 0 ? (
            options.map((option, index) => (
              <OptionInput
                key={index}
                index={index}
                option={option}
                onChange={editOption}
                onDelete={removeOption}
              />
            ))
          ) : (
            <p>No options added</p>
          )
        }
      </ul>
    </div>
  );
};

export default OptionInputList;