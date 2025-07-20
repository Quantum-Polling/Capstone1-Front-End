import React, { useEffect, useState } from "react";
import "./PollStyles.css";
import OptionInputList from "./OptionInputList";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate, useParams } from "react-router-dom";

const PollCreator = ({ user }) => {
  // User not logged in, display message instead of form
  if (!user) {
    return (
      <p>Log in to create a poll</p>
    )
  }

  const navigate = useNavigate();

  // Poll Details
  const { pollId } = useParams();
  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
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

  const submitPoll = async (pollInfo) => {
    // Draft poll
    if (id !== 0)
    {
      try {
        const response = await axios.patch(`${API_URL}/api/polls/${user.id}/edit/${id}`, pollInfo);
        console.log("PATCH Response:", response.data);
      } catch (error) {
        console.error(`Error ${pollInfo.status === "Draft" ? "saving" : "publishing"} draft:`, error);
      }
    }
    // New poll
    else {
      pollInfo.creatorId = user.id;
      try {
        const response = await axios.post(`${API_URL}/api/polls/`, pollInfo);
        setId(response.data.pollId);
        pollInfo.id = response.data.pollId;
        console.log("POST response:", response.data);
      } catch (error) {
        console.error(`Error ${pollInfo.status === "Draft" ? "saving" : "publishing"} new poll:`, error);
      }
    }
  };

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
    if (pollOptions.length < 2)
      optErrs.push("Must have at least 2 options");
    
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
      status: "Open",
      open: open,
    }

    await submitPoll(pollInfo);
    navigate(`/polls/${pollInfo.id ? pollInfo.id : id}`);
  }

  // Save poll as draft
  const handleSave = async () => {
    // Save everything as is
    const pollInfo = {
      title: title,
      description: description,
      options: options,
      endDate: endDate,
      status: "Draft",
      open: open,
    }

    await submitPoll(pollInfo);
  }

  // Load a draft poll
  const loadPoll = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/polls/${pollId}`);
      const poll = response.data.poll;

      setId(poll.id);
      setTitle(poll.title === "Untitled Poll" ? "" : poll.title);
      setDescription(poll.description === "[DRAFT]" ? "" : poll.description);
      setEndDate(poll.end_date);
      setOpen(!poll.authVotes);

      const opts = poll.poll_options.map((opt) => (
        opt.text.startsWith("[OPTION PLACEHOLDER") ? "" : opt.text
      ));

      setOptions(opts);
    } catch (error) {
      console.error("Error loading poll:", error);
      navigate("/polls/create");
    }
  }

  useEffect(() => {
    if (pollId) {
      loadPoll();
    }
  }, []);

  return (
    <form className="create-poll drop-shadow" onSubmit={handleSubmit}>
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
              value={endDate ? dayjs(endDate, 'YYYY-MM-DD') : null }
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
        <button type="button" onClick={handleSave}>Save Draft</button>
        <button type="submit">Publish</button>
      </div>
    </form>
  );
};

export default PollCreator;
