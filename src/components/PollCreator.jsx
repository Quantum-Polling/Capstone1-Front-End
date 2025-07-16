import React, { useEffect, useState } from "react";
import "./PollStyles.css";
import OptionInputList from "./OptionInputList";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const PollCreator = ({ user, poll }) => {
//   User not logged in, display message instead of form
//   if (!user) {
//     return (
//       <p>Log in to create a poll</p>
//     )
//   }

  // Poll Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  const [endDate, setEndDate] = useState(null);
  const [open, setOpen] = useState(false);

  // Poll Errors
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [optionsError, setOptionsError] = useState("");
  
  const editTitle = (event) => {
    setTitle(event.target.value);
  }

  const editDescription = (event) => {
    setDescription(event.target.value);
  }

  const editDate = (d) => {
    const date = new Date(d.$d);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${month}-${day}-${year}`;
    setEndDate(formattedDate);
  }

  // Validate and publish poll
  const handleSubmit = (event) => {
    event.preventDefault();

    const newPoll = {
      title: title.trim(),
      description: description.trim(),
      options: options,
      open: open,
      endDate: endDate
    }

    setTitleError(newPoll.title ? "" : "Title cannot be empty");
    setDescriptionError(newPoll.description ? "" : "Description cannot be empty");

    for (const option of newPoll.options) {
      if (!(option.trim())) {
        setOptionsError("Options cannot be empty");
        break;
      }
    }

    console.log(newPoll);
  }

  useEffect(() => {
    if (poll) {
        setTitle(poll.title);
        setDescription(poll.description);
        setOptions(poll.options);   
    }
  }, []);

  return (
    <form className="create-poll drop-shadow" onSubmit={handleSubmit}>
      <input 
        required
        type="text" 
        className="poll-title" 
        placeholder="Untitled Poll" 
        value={title}
        onChange={editTitle}
      />

      <label><h3>Description</h3></label>
      <textarea 
        required
        className="poll-description" 
        rows={4} 
        cols={30} 
        value={description}
        onChange={editDescription}
      />
    
      <div className="panel">
        <div className="privacy-select">
          <label className="header">
            <h4>Privacy</h4>
          </label>
          <br />

          <input 
            type="radio" 
            name="privacy" 
            id="public"
            checked={open}
            onChange={() => {setOpen(true)}}
          />
          <label htmlFor="public">&nbsp;Public</label>

          <input 
            type="radio" 
            name="privacy" 
            id="restricted" 
            checked={!open}
            onChange={() => {setOpen(false)}}
          />
          <label htmlFor="restricted">&nbsp;Accounts Only</label>
        </div>

        <div className="date-picker">
          <label>
            <h4>End Date</h4>
          </label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
              disablePast
              value={endDate ? dayjs(endDate, 'MM-DD-YYYY') : null}
              onChange={(date) => {editDate(date)}}
            />
          </LocalizationProvider>
        </div>
      </div>

      <label><h3>Options</h3></label>
      <OptionInputList options={options} setOptions={setOptions} />
      
      {
        (titleError || descriptionError || optionsError) &&
        <div className="errors">
          <ul>
            {titleError && <li>{titleError}</li>}
            {descriptionError && <li>{descriptionError}</li>}
            {optionsError && <li>{optionsError}</li>}
          </ul>
        </div>
      }

      <button type="submit">Submit</button>
    </form>
  );
};

export default PollCreator;