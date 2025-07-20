import React, { useEffect } from "react";
import OptionInput from "./OptionInput";

const OptionInputList = ({ options, setOptions, disabled }) => {
  const minOptions = 2;

  const editOption = (event, index) => {
    const updatedOptions = [...options];
    updatedOptions[index] = event.target.value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length <= minOptions)
      return;

    setOptions([...options.slice(0, index), ...options.slice(index + 1)]);
  };

  return (
    <div className="option-list">
      { /* New Option Button */
        !disabled && <button type="button" onClick={addOption}>➕ Add New Option</button>
      }
      <ul>
        { /* Options List */
          options.length > 0 ? (
            options.map((option, index) => (
              disabled ? (
                <li key={index} className="poll-option-finalized">
                  {option}
                </li>
              ) : (
                <OptionInput
                  key={index}
                  index={index}
                  option={option}
                  onChange={editOption}
                  onDelete={removeOption}
                  displayButton={options.length > minOptions}
                />
              )
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