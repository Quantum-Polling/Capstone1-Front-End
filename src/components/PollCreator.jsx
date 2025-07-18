import React, { useEffect, useState } from "react";
import "./PollStyles.css";
import OptionInputList from "./OptionInputList";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { API_URL } from "../shared";

const PollCreator = ({ user, poll }) => {
  // User not logged in, display message instead of form
  if (!user) {
    return (
      <p>Log in to create a poll</p>
    )
  }

  // Poll Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  const [endDate, setEndDate] = useState(null);
  const [open, setOpen] = useState(false);

  // Poll Errors
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [optionsErrors, setOptionsErrors] = useState([]);
  
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
    const formattedDate = `${year}-${month}-${day}`;
    setEndDate(formattedDate);
  }

  // Validate and publish poll
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Trim whitespace from poll details
    const pollTitle = title.trim();
    const pollDesc = description.trim();
    const pollOptions = options.map((option) => (option.trim()));
    console.log("Options:", pollOptions);

    const titleErr = pollTitle ? "" : "Title cannot be empty";
    const descErr = pollDesc ? "" : "Description cannot be empty";
    const optErrs = [];
    
    // Check for empty options
    for (let i = 0; i < pollOptions.length; i++)
      if (!pollOptions[i])
        optErrs.push(`Option ${i + 1} cannot be empty`);
      
    // Check minimum number of options
    if (pollOptions.length < 3)
      optErrs.push("Must have at least 3 options");
    
    // Check for duplicate options
    if (new Set(pollOptions).size !== pollOptions.length)
      optErrs.push("Cannot have duplicate options");
    
    setOptionsErrors(optErrs);
    setTitleError(titleErr);
    setDescriptionError(descErr);
    
    console.log("Title Error:", titleError);
    console.log("Description Error:", descriptionError);
    console.log("Option Errors:", optErrs);

    // Don't attempt to submit poll if there are form errors
    if (titleErr || descErr || optErrs.length > 0)
      return;

    const pollInfo = {
      title: pollTitle,
      description: pollDesc,
      options: pollOptions,
      endDate: endDate,
      open: open,
    }

    // Publish a draft poll
    if (poll)
    {
      try {
        const response = await axios.patch(`${API_URL}/api/polls/${user.id}/edit/${poll.id}`, pollInfo);
        console.log("PATCH Response:", response.data);
      } catch (error) {
        console.error("Error publishing draft:", error);
      }
    }
    // Publish a new poll
    else {
      pollInfo.creatorId = user.id;
      try {
        console.log("New Poll Details:", pollInfo);
        const response = await axios.post(`${API_URL}/api/polls/`, pollInfo);
        console.log("POST response:", response.data);
      } catch (error) {
        console.error("Error publishing new poll:", error);
      }
    }
  }

  useEffect(() => {
    if (poll) {
        setTitle(poll.title);
        setDescription(poll.description);
        setOptions(poll.options);
        setEndDate(poll.endDate);
        setOpen(poll.open);
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
              slotProps={{
                layout: {
                  sx: { boxShadow: "0 4px 8px 0 #00000068, 0 6px 20px 0 #00000060" }
                }
              }}
            />
          </LocalizationProvider>
        </div>
      </div>

      <label><h3>Options</h3></label>
      <OptionInputList options={options} setOptions={setOptions} />
      
      {
        (titleError || descriptionError || optionsErrors.length > 0) &&
        <div className="errors">
          <ul>
            {titleError && <li>{titleError}</li>}
            {descriptionError && <li>{descriptionError}</li>}
            {optionsErrors.length > 0 && 
              optionsErrors.map((error, index) => (
                <li key={"Opt Err " + index}>{error}</li>
              ))}
          </ul>
        </div>
      }

      <div className="submit-buttons">
        <button type="button">Save</button>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default PollCreator;
