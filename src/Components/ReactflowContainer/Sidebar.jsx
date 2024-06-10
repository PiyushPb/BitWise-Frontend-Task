import React from "react";
import { AiOutlineMessage } from "react-icons/ai";

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <aside className="border-t-2 md:border-l-2 md:border-t-0 px-5 py-5 ">
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div className="mt-5">
        <div
          className="flex justify-center items-center flex-col max-w-[150px] border-[1px] border-blue-500 px-5 py-5 rounded-md cursor-pointer"
          onDragStart={(event) => onDragStart(event, "message")}
          draggable
        >
          <AiOutlineMessage className="text-[20px] text-blue-500" />
          <span className="text-[14px] font-bold text-blue-500">Message</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
