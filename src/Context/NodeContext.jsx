import React, { createContext, useState } from "react";

export const NodeContext = createContext();

const ContextProvider = (props) => {
  const [flowHaveChanges, setFlowHaveChanges] = useState(false);
  const [flowHaveErrors, setFlowHaveErrors] = useState(false);
  const [toggleBtnClick, setToggleBtnClick] = useState(false);

  const [nodeSelected, setNodeSelected] = useState(null);

  return (
    <NodeContext.Provider
      value={{
        flowHaveChanges,
        setFlowHaveChanges,
        flowHaveErrors,
        setFlowHaveErrors,
        toggleBtnClick,
        setToggleBtnClick,
        nodeSelected,
        setNodeSelected,
      }}
    >
      {props.children}
    </NodeContext.Provider>
  );
};

export default ContextProvider;
