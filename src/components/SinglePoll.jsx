import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { API_URL } from "../shared";
import "./PollList.css";

const SinglePoll = ({ user }) => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ballot, setBallot] = useState([]);
  const [isDisabled, setIsDisabled] = useState([]);
  const { id } = useParams();

  const handleBallotClick = (option, index) => {
    const alreadyChosen = ballot.some((opt) => opt.id === option.id);
    if (!alreadyChosen) {
      setBallot((prev) => [...prev, option]);
      setIsDisabled((prev) => {
        const updated = [...prev];
        updated[index] = true;
        console.log("Updated isDisabled:", updated);
        return updated;
      });
    }
  };

  const getSinglePoll = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/polls/${id}`);
      console.log("Poll options loaded:", response.data.poll.poll_options);

      const pollData = response.data.poll;
      setPoll(pollData);
      setIsDisabled(new Array(pollData.poll_options.length).fill(false)); // ✅ always reinitialize correctly
      setLoading(false);
    } catch (err) {
      console.error("Error loading poll:", err);
    }
  };

  useEffect(() => {
    getSinglePoll();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!poll) return <p>Poll not found.</p>;
  if (!user?.id) return <p>You must be logged in to vote.</p>;

  return (
    <div>
      <div className="poll-card">
        <div className="poll-title">{poll.title}</div>
        <h2 className="poll-description">{poll.description}</h2>

        <div className="single-poll-options">
          {poll.poll_options.map((option, index) => (
            <h3
              key={option.id}
              style={{
                cursor: isDisabled[index] ? "not-allowed" : "pointer",
                color: isDisabled[index] ? "#aaa" : "#000",
              }}
              onClick={() =>
                !isDisabled[index] && handleBallotClick(option, index)
              }
            >
              {option.text}
            </h3>
          ))}
        </div>

        <div className="poll-close-date">
          Closes: {poll.close_date || "Manually"}
        </div>
      </div>

      <div className="ballot-container">
        <h3>Your Ballot</h3>
        <ol className="single-ballot-choices">
          {ballot.map((opt, i) => (
            <li key={i}>
              <h3>
                #{i + 1}: {opt.text}
              </h3>
            </li>
          ))}
        </ol>

        {ballot.length > 0 && (
          <button
            className="submit-vote-btn"
            onClick={async () => {
              const confirmSubmit =
                ballot.length < poll.poll_options.length
                  ? window.confirm(
                      "WARNING: Not all options are ranked. Submit anyway?"
                    )
                  : true;

              if (!confirmSubmit) return;

              try {
                console.log("Submitting vote:", {
                  userId: user.id,
                  pollId: poll.id,
                  rankings: ballot.map((option, index) => ({
                    optionId: option.id,
                    rank: index + 1,
                  })),
                });

                await axios.post(
                  `${API_URL}/api/polls/${user.id}/vote/${poll.id}`,
                  {
                    rankings: ballot.map((option, index) => ({
                      optionId: option.id,
                      rank: index + 1,
                    })),
                  },
                  { withCredentials: true }
                );

                alert("✅ Your vote was submitted successfully!");
              } catch (err) {
                console.error("Error submitting vote:", err);
                alert("❌ Error submitting vote.");
              }
            }}
          >
            Submit Vote
          </button>
        )}
      </div>
    </div>
  );
};

export default SinglePoll;
