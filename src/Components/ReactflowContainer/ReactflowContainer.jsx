//ReactflowContainer.jsx

//  imports
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
  addEdge, // to add edge
  useNodesState, // to set nodes
  useEdgesState, // to set edges
  Controls, // to add controls
  Background, // to add background in the canvas
  BackgroundVariant, // to add background variant
  MiniMap, // displays a mini map of the nodes and edges
} from "reactflow";
import "reactflow/dist/style.css";

import { toast } from "react-toastify"; // for notifications
import "react-toastify/dist/ReactToastify.css";

//  components
import Sidebar from "./Sidebar";
import MessageNode from "./Nodes/MessageNode";
import EditNode from "./EditNode";

// ############ Imports end here ############

//  constants

// initial nodes (This stores all the nodes data for initialization)
const initialNodes = [];

//nodeTypeConfig (This stores the type of node and the component that will be rendered)
const nodeTypeConfig = {
  message: MessageNode, // messgae Node component
};

//  functions
let nodeIdCounters = {}; // stores the number of nodes of each type, this is used to recalculate the latest node id when page is reloaded

//  helper functions
const initializeNodeCounters = (nodes) => {
  nodes.forEach((node) => {
    const type = node.type;
    if (!nodeIdCounters[type]) {
      nodeIdCounters[type] = 0; // set the initial value to 0
    }
    const nodeIdNumber = parseInt(node.id.split("_").pop(), 10);
    if (nodeIdNumber >= nodeIdCounters[type]) {
      nodeIdCounters[type] = nodeIdNumber + 1; // increment the value by 1 if the node id is greater than the current value
    }
  });
};

//  getId function
const getId = (type) => {
  if (!nodeIdCounters[type]) {
    nodeIdCounters[type] = 0; // set the initial value to 0
  }
  return `${type}_node_${nodeIdCounters[type]++}`; // increment the value by 1 and return the new node id eg : [msg_node_1]
};

//  ReactflowContainer function
const ReactflowContainer = () => {
  const {
    flowHaveChanges, // to check if any changes have been made
    setFlowHaveChanges, // to set flowHaveChanges
    setFlowHaveErrors, // to set flowHaveErrors
    toggleBtnClick, // to check if save button is clicked in the navbar
    nodeSelected, // to check if any node is selected
    setNodeSelected, // to set nodeSelected
  } = useContext(NodeContext);

  const reactFlowContainer = useRef(null); // reference to the react flow container
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes); // to set nodes
  const [edges, setEdges, onEdgesChange] = useEdgesState([]); // to set edges
  const [reactFlowInstance, setReactFlowInstance] = useState(null); // to set react flow instance

  //  onNodeLabelChange function
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
    [setFlowHaveChanges, setNodes] // to change the label of the node that is clicked
  );

  // onConnect function
  const onConnect = useCallback(
    (params) => {
      setFlowHaveChanges(true); // sets the FlowHaveChanges state to true to trigger a re-render

      const existingEdge = edges.find(
        (edge) =>
          edge.source === params.source &&
          edge.sourceHandle === params.sourceHandle
      ); // check if an edge already exists between the source and sourceHandle

      if (existingEdge) {
        toast.warn("Source handle already connected to an edge");
        return;
      } // if an edge already exists, display a warning message using the toast

      setEdges((eds) => addEdge(params, eds)); // add the new edge if all the above conditions satisfy
    },
    [edges, setEdges, setFlowHaveChanges]
  );

  // onDragOver function
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []); // sets the drop effect to move

  // onDrop function
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      setFlowHaveChanges(true);

      const type = event.dataTransfer.getData("application/reactflow"); // get the type of node that is dropped

      if (typeof type === "undefined" || !type) {
        return; // if type is undefined or empty, return from the function
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }); // get the position of the node that is dropped

      const nodeConfig = nodeTypeConfig[type] || {}; // get the node config for the type of node that is dropped

      const newNode = {
        id: getId(type),
        type,
        position,
        data: { label: `${type} node` },
        ...nodeConfig,
      }; // create a new node

      setNodes((nds) => nds.concat(newNode)); // add the new node to the nodes state using the setNodes function
    },
    [reactFlowInstance, setFlowHaveChanges, setNodes]
  );

  // checkNodesWithoutEdges function
  const checkNodesWithoutEdges = useCallback(() => {
    const unconnectedNodes = nodes.filter((node) => {
      return !edges.some(
        (edge) => edge.source === node.id || edge.target === node.id
      );
    }); // filter the nodes that are not connected to any edge, to check if there is a node that is not connected, if it is found then and error is shown

    if (unconnectedNodes.length > 0) {
      console.log("Unconnected nodes found:", unconnectedNodes);
      return true;
    } else {
      return false;
    }
  }, [nodes, edges]);

  // saveFlow function
  const saveFlow = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem("flowKey", JSON.stringify(flow));
      setFlowHaveChanges(false);
      toast.success("Flow saved to localStorage");
    } // save the flow to local storage, under the key "flowKey"
  }, [reactFlowInstance, setFlowHaveChanges]);

  const onSave = useCallback(() => {
    if (flowHaveChanges) {
      if (checkNodesWithoutEdges()) {
        setFlowHaveErrors(true);
        toast.error("There are unconnected nodes in the container"); // if there are unconnected nodes, show an error message
      } else {
        setFlowHaveErrors(false); // if there are no unconnected nodes, hide the error message
        saveFlow(); // call the saveFlow function
      }
    }
  }, [
    flowHaveChanges,
    checkNodesWithoutEdges,
    saveFlow,
    setFlowHaveErrors,
    toggleBtnClick,
  ]);

  // onNodeClick function
  const onNodeClick = useCallback((event, node) => {
    console.log("Selected node:", node);
    setNodeSelected(node);
  }, []); // used to set the nodeSelected state to the clicked node

  useEffect(() => {
    const savedFlow = localStorage.getItem("flowKey"); // access the data of nodes and edges form the localstorage
    if (savedFlow) {
      const flow = JSON.parse(savedFlow);
      if (flow) {
        setNodes(flow.nodes || []); // set the nodes
        setEdges(flow.edges || []); // set the edges
        initializeNodeCounters(flow.nodes || []);
      }
    }
  }, [setNodes, setEdges]); // use to track the changes when nodes or edges are updated

  useEffect(() => {
    if (toggleBtnClick || !toggleBtnClick) {
      onSave();
    }
  }, [toggleBtnClick]); // track the changes when toggleBtnClick is updated and save the data to the local storage

  useEffect(() => {
    if (nodeSelected) {
      onNodeLabelChange(nodeSelected.id, nodeSelected.data.label);
    }
  }, [nodeSelected, onNodeLabelChange]); // track the changes when nodeSelected or onNodeLabelChange is updated

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
            <Controls /> {/* add controls to the canvas */}
            <Background color="#ccc" variant={BackgroundVariant.Dots} />{" "}
            {/* add background to the canvas */}
            <MiniMap nodeStrokeWidth={3} /> {/* add mini map to the canvas */}
          </ReactFlow>
        </div>
        <div className="border-t-2 md:border-l-2 md:border-t-0 max-w-">
          {/* add sidebar and edit node components, if nodeSelected is true then edit node component is shown, else sidebar component is shown */}
          {nodeSelected ? <EditNode /> : <Sidebar />}{" "}
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default ReactflowContainer;
