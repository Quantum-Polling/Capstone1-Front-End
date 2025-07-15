import React, { useState } from "react";
import "./PollStyles.css";
import OptionInputList from "./OptionInputList";

const PollCreator = ({ poll }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  
  const editTitle = (event) => {
    setTitle(event.target.value);
  }

  const editDescription = (event) => {
    setDescription(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
        title: title,
        description: description,
        options: options,
    })
  }

  return (
    <form className="create-poll" onSubmit={handleSubmit}>
      <input 
        type="text" 
        className="poll-title" 
        placeholder="Untitled Poll" 
        value={title}
        onChange={editTitle}
      />

      <label><h3>Description</h3></label>
      <textarea 
        className="poll-description" 
        rows={4} 
        cols={30} 
        value={description}
        onChange={editDescription}
      />
    
      <label><h3>Options</h3></label>
      <OptionInputList options={options} setOptions={setOptions} />

      <button type="submit">Submit</button>
    </form>
  );
};

export default PollCreator;