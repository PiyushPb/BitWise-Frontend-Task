import React, { useContext } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { NodeContext } from "../../Context/NodeContext";

// All nodes data are saved here
import { NodesData } from "./Nodes.js";

const Sidebar = () => {
  const { setFlowHaveChanges } = useContext(NodeContext);

  const onDragStart = (event, nodeType) => {
    setFlowHaveChanges(true);
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  }; // onDragStart function to set flowHaveChanges to true, and to handle the drag and drop functionality


  return (
    <aside className="w-full md:max-w-[350px] px-5 py-5 ">
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div className="mt-5 flex justify-between flex-wrap gap-5">
        {/* Map through all the nodes */}
        {NodesData.map((node) => {
          const IconComponent = node.icon; // Get the icon component from the node
          return (
            <div
              key={node.id}
              className="flex flex-1 justify-center items-center flex-col max-w-[150px] border-[1px] border-blue-500 px-5 py-5 rounded-md cursor-pointer"
              onDragStart={(event) =>
                onDragStart(event, node.title.toLowerCase())
              }
              draggable
            >
              <IconComponent className="text-[20px] text-blue-500" />
              <span className="text-[14px] font-bold text-blue-500">
                {node.title}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
