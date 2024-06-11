import React, { useContext } from "react";
import { NodeContext } from "../Context/NodeContext";

const Navbar = () => {
  const { flowHaveChanges, setFlowHaveChanges } = useContext(NodeContext);
  return (
    <div className="w-full min-h-[80px] px-5 py-3 bg-gray-200 flex justify-end items-center">
      <button
        onClick={() => setFlowHaveChanges(false)}
        className={`submit-btn transisition-all duration-200 ${
          flowHaveChanges ? "border-red-300 text-red-300" : ""
        } `}
      >
        Save changes
      </button>
    </div>
  );
};

export default Navbar;
