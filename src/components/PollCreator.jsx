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

  // Form State
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [disabled, setDisabled] = useState(true);

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
        const response = await axios.patch(`${API_URL}/api/polls/${user.id}/edit/${id}`, pollInfo, {
          withCredentials: true,
        });
        console.log("PATCH Response:", response.data);
      } catch (error) {
        console.error(`Error ${pollInfo.status === "Draft" ? "saving" : "publishing"} draft:`, error);
      }
    }
    // New poll
    else {
      pollInfo.creatorId = user.id;
      try {
        const response = await axios.post(`${API_URL}/api/polls/`, pollInfo, {
          withCredentials: true,
        });
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
    if (pollId) {
      loadPoll: try {
        const response = await axios.get(`${API_URL}/api/polls/${pollId}`);
        const poll = response.data.poll;

        // Verify that the user can edit this poll
        const isOwner = poll.creatorId === user.id;
        if (!isOwner) {
          setAuthorized(isOwner);
          break loadPoll;
        }

        setId(poll.id);
        setTitle(poll.title === "Untitled Poll" ? "" : poll.title);
        setDescription(poll.description === "[DRAFT]" ? "" : poll.description);
        setEndDate(poll.end_date);
        setOpen(!poll.authVotes);
        setDisabled(poll.status !== "Draft");

        const opts = poll.poll_options.map((opt) => (
          opt.text.startsWith("[OPTION PLACEHOLDER") ? "" : opt.text
        ));

        setOptions(opts);
      } catch (error) {
        console.error("Error loading poll:", error);
        navigate("/polls/create");
      }
    } else {
      setAuthorized(true);
      setDisabled(false);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadPoll();
  }, []);

  if (loading) {
    return <p>Loading...</p>
  }

  if (!authorized) {
    return (
      <div className="disabled-message">
        <img
          className="spongebob-404"
          src="/spongebob-404.webp"
          alt="Spongebob 404"
        />
        <h1>This poll cannot be edited</h1>
        <h2>You are not the owner!</h2>
      </div>
    )
  }

  return (
    <form className="create-poll drop-shadow" onSubmit={handleSubmit}>
      {
        disabled && 
        <div className="disabled-message">
          <h1>This poll cannot be edited</h1>
        </div>
      }
        
      { /* Title */
        disabled ? (
          <div className="poll-title">
            <h1>{title}</h1>
          </div>
        ) : (
          <input
            type="text"
            className="poll-title"
            placeholder="Untitled Poll"
            value={title}
            onChange={editTitle}
          />
        )
      }
      
      <label><h4>Description</h4></label>
      { /* Description */
        disabled ? (
          <div className="poll-description">
            <p>{description}</p>
          </div>
        ) : (
          <textarea
            className="poll-description"
            rows={4}
            cols={30}
            value={description}
            onChange={editDescription}
          />
        )
      }
    
      <div className="panel">
        <div className="privacy-select">
          <label className="header">
            <h4>Privacy</h4>
          </label>
          <br />

          { /* Privacy */
            disabled ? (
              <p>{open ? "Public": "Accounts Only"}</p>
            ) : (
              <div>
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
            )
          }
        </div>

        <div className="date-picker">
          { /* End Date */
            disabled ? (
              <div>
                <label>
                  <h4>End Date</h4>
                </label>
                <p>{endDate ? endDate : "Manual"}</p>
              </div>
            ) : (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disablePast
                  label="End Date (Optional)"
                  value={endDate ? dayjs(endDate, 'YYYY-MM-DD') : null }
                  onChange={(date) => {editDate(date)}}
                  slotProps={{
                    field: {
                      readOnly: true
                    },
                    layout: {
                      sx: { boxShadow: "0 4px 8px 0 #00000068, 0 6px 20px 0 #00000060" }
                    }
                  }}
                />
              </LocalizationProvider>
            )
          }
        </div>
      </div>

      <label><h4>Options</h4></label>
      <OptionInputList options={options} setOptions={setOptions} disabled={disabled}/>
      
      { /* Errors */
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

      { /* Save and Publish Buttons */
        !disabled &&
        <div className="submit-buttons">
          <button type="button" onClick={handleSave}>Save Draft</button>
          <button type="submit">Publish</button>
        </div>
      }
    </form>
  );
};

export default PollCreator;
