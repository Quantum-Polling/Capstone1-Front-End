import React from "react";
import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts";

const RoundResults = ({ data, round, setRound, maxRounds }) => {
  const goPrevious = () => {
    if (round > 1)
      setRound(round - 1);
  }
  
  const goNext = () => {
    if (round < maxRounds)
      setRound(round + 1);
  }

  return (
    <div className="round-display">
      <div 
        className={`previous drop-shadow ${round <= 1 && "disabled"}`}
        onClick={goPrevious}
        >
        <div className="arrow left"></div>
      </div>

      <div 
        className={`next drop-shadow ${round >= maxRounds && "disabled"}`}
        onClick={goNext}
        >
        <div className="arrow right"></div>
      </div>

      { round === maxRounds && 
        <h5 className="final-round-message">Final Round</h5>
      }
      <h1>Round {round}</h1>
      <h5>Hover to view individual results</h5>
      <Stack width="100%" direction="row" flexWrap="wrap">
        <PieChart 
          series={[
            {
              innerRadius: 45,
              outerRadius: 60,
              startAngle: -100,
              endAngle: 100,
              cy: "75%",
              data: data,
            },
          ]}
          height={100}
          slotProps={{
            legend: {
              direction: "horizontal",
              position: {
                vertical: "bottom",
              },
              sx: {
                color: "white",
              }
            }
          }}
        />
      </Stack>
    </div>
  );
}

export default RoundResults;