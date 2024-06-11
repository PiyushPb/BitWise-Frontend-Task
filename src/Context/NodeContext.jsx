import React, { createContext, useState } from "react";

export const NodeContext = createContext();

const ContextProvider = (props) => {
  const [flowHaveChanges, setFlowHaveChanges] = useState(false);

  return (
    <NodeContext.Provider value={{ flowHaveChanges, setFlowHaveChanges }}>
      {props.children}
    </NodeContext.Provider>
  );
};

export default ContextProvider;
