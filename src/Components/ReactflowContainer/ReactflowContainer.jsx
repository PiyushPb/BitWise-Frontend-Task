import React, {
  useCallback,
  useRef,
  useState,
  useContext,
  useEffect,
} from "react";
import { NodeContext } from "../../Context/NodeContext";

import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Position,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import Sidebar from "./Sidebar";
import MessageNode from "./Nodes/MessageNode";

const initialNodes = [];

const nodeTypeConfig = {
  message: MessageNode,
};

let nodeIdCounters = {};
const getId = (type) => {
  if (!nodeIdCounters[type]) {
    nodeIdCounters[type] = 0;
  }
  return `${type}_node_${nodeIdCounters[type]++}`;
};

const ReactflowContainer = () => {
  const { flowHaveChanges, setFlowHaveChanges } = useContext(NodeContext);

  const reactFlowContainer = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      setFlowHaveChanges(true);

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeConfig = nodeTypeConfig[type] || {};

      const newNode = {
        id: getId(type),
        type,
        position,
        data: { label: `${type} node` },
        ...nodeConfig,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onSave = useCallback(() => {
    console.log("clicked");
    console.log("flowHaveChanges:", flowHaveChanges);
    console.log("reactFlowInstance:", reactFlowInstance);
    if (reactFlowInstance && !flowHaveChanges) {
      console.log("saved...");
      const flow = reactFlowInstance.toObject();
      localStorage.setItem("flowKey", JSON.stringify(flow));
    }
  }, [reactFlowInstance, flowHaveChanges]);

  useEffect(() => {
    onSave();
  }, [flowHaveChanges]);

  return (
    <div className="flex flex-col md:flex-row flex-grow-1 h-full">
      <ReactFlowProvider>
        <div className="flex-grow-1 w-full flex-1" ref={reactFlowContainer}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypeConfig}
            fitView
          >
            <Controls />
            <Background color="#ccc" variant={BackgroundVariant.Dots} />
            <MiniMap nodeStrokeWidth={3} />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
};

export default ReactflowContainer;
