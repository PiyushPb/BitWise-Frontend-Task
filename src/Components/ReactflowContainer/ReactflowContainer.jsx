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
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./Sidebar";
import MessageNode from "./Nodes/MessageNode";
import EditNode from "./EditNode";

const initialNodes = [];

const nodeTypeConfig = {
  message: MessageNode,
};

let nodeIdCounters = {};
const initializeNodeCounters = (nodes) => {
  nodes.forEach((node) => {
    const type = node.type;
    if (!nodeIdCounters[type]) {
      nodeIdCounters[type] = 0;
    }
    const nodeIdNumber = parseInt(node.id.split("_").pop(), 10);
    if (nodeIdNumber >= nodeIdCounters[type]) {
      nodeIdCounters[type] = nodeIdNumber + 1;
    }
  });
};

const getId = (type) => {
  if (!nodeIdCounters[type]) {
    nodeIdCounters[type] = 0;
  }
  return `${type}_node_${nodeIdCounters[type]++}`;
};

const ReactflowContainer = () => {
  const {
    flowHaveChanges,
    setFlowHaveChanges,
    setFlowHaveErrors,
    toggleBtnClick,
    nodeSelected,
    setNodeSelected,
  } = useContext(NodeContext);

  const reactFlowContainer = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onNodeLabelChange = useCallback(
    (nodeId, label) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, label } };
          }
          return node;
        })
      );
      setFlowHaveChanges(true);
    },
    [setFlowHaveChanges, setNodes]
  );

  const onConnect = useCallback(
    (params) => {
      setFlowHaveChanges(true);

      const existingEdge = edges.find(
        (edge) =>
          edge.source === params.source &&
          edge.sourceHandle === params.sourceHandle
      );

      if (existingEdge) {
        toast.warn("Source handle already connected to an edge");
        return;
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges, setFlowHaveChanges]
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
    [reactFlowInstance, setFlowHaveChanges, setNodes]
  );

  const checkNodesWithoutEdges = useCallback(() => {
    const unconnectedNodes = nodes.filter((node) => {
      return !edges.some(
        (edge) => edge.source === node.id || edge.target === node.id
      );
    });

    if (unconnectedNodes.length > 0) {
      console.log("Unconnected nodes found:", unconnectedNodes);
      return true;
    } else {
      return false;
    }
  }, [nodes, edges]);

  const saveFlow = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem("flowKey", JSON.stringify(flow));
      setFlowHaveChanges(false);
      toast.success("Flow saved to localStorage");
    }
  }, [reactFlowInstance, setFlowHaveChanges]);

  const onSave = useCallback(() => {
    if (flowHaveChanges) {
      if (checkNodesWithoutEdges()) {
        setFlowHaveErrors(true);
        toast.error("There are unconnected nodes in the container");
      } else {
        setFlowHaveErrors(false);
        saveFlow();
      }
    }
  }, [
    flowHaveChanges,
    checkNodesWithoutEdges,
    saveFlow,
    setFlowHaveErrors,
    toggleBtnClick,
  ]);

  const onNodeClick = useCallback((event, node) => {
    console.log("Selected node:", node);
    setNodeSelected(node);
  }, []);

  useEffect(() => {
    const savedFlow = localStorage.getItem("flowKey");
    if (savedFlow) {
      const flow = JSON.parse(savedFlow);
      if (flow) {
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        initializeNodeCounters(flow.nodes || []);
      }
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    if (toggleBtnClick || !toggleBtnClick) {
      onSave();
    }
  }, [toggleBtnClick]);

  useEffect(() => {
    if (nodeSelected) {
      onNodeLabelChange(nodeSelected.id, nodeSelected.data.label);
    }
  }, [nodeSelected, onNodeLabelChange]);

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
            onNodeClick={onNodeClick}
            fitView
          >
            <Controls />
            <Background color="#ccc" variant={BackgroundVariant.Dots} />
            <MiniMap nodeStrokeWidth={3} />
          </ReactFlow>
        </div>
        <div className="border-t-2 md:border-l-2 md:border-t-0 max-w-">
          {nodeSelected ? <EditNode /> : <Sidebar />}
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default ReactflowContainer;
