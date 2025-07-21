import React from "react";
import PollList from "./PollList";
const Home = ({ polls }) => {
  return (
    <>
      <PollList polls={polls} />
    </>
  );
};

export default Home;
