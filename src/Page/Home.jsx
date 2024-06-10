import React from "react";
import Navbar from "../Components/Navbar";
import ReactflowContainer from "../Components/ReactflowContainer/ReactflowContainer";

const Home = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* navbar */}
      <Navbar />
      <ReactflowContainer />
    </div>
  );
};

export default Home;
