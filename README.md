# Chatbot Flow Builder

This project is developed as part of the BiteSpeed Frontend Task: Chatbot Flow Builder. The goal is to create a simple and extensible chatbot flow builder using React and React Flow. The flow builder allows users to create and manage chatbot flows by connecting multiple text message nodes. I have also tried to implemet an Responsive design so that the website will work in mobile devices too!!

Techstack used : ReactJS, Tailwind CSS, React Flow, Roact Icons, React Toastify, React Hooks.

Find the project @ : [https://thriving-boba-ea4c2d.netlify.app/](https://thriving-boba-ea4c2d.netlify.app/)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Screenshots](#screenshots)
- [Usage](#usage)
- [Components](#components)

## Overview

This chatbot flow builder is designed to be a visual tool for creating chatbot conversation flows. Users can add text message nodes, connect them with edges, and save their configurations. The project is built using React and React Flow, providing a robust and interactive user interface for managing chatbot flows.

## Features

1. **Text Node**
    - Supports adding multiple text message nodes in one flow.
    - Nodes can be added to the flow by dragging and dropping from the Nodes Panel.

2. **Nodes Panel**
    - Houses all types of nodes supported by the flow builder.
    - Currently supports only Message Nodes, with provisions to add more node types in the future.

3. **Edge**
    - Connects two nodes together.
    - Ensures only one edge originates from a source handle.

4. **Source Handle**
    - The starting point of a connecting edge.
    - Can have only one edge originating from it.

5. **Target Handle**
    - The ending point of a connecting edge.
    - Can have multiple edges connecting to it.

6. **Settings Panel**
    - Replaces the Nodes Panel when a node is selected.
    - Allows editing the text of the selected Text Node.

7. **Save Button**
    - Saves the current flow configuration.
    - Shows an error if there are unconnected nodes when attempting to save.

## Installation

To get started with the project, follow these steps:

1. Clone the repository:
   
   ``` bash
   git clone https://github.com/yourusername/chatbot-flow-builder.git
   cd BitWise-Frontend-Task
   ```
2. Install the dependencies:
   
   ``` bash
   npm install
   ```
3. Start the development server:
   
   ``` bash
   npm run dev
   ```

## Screenshots

**Working Demo**
https://github.com/PiyushPb/BitWise-Frontend-Task/assets/82027371/be40569a-32c4-4db2-96db-a066000cb95f



![Home page ](https://github.com/PiyushPb/BitWise-Frontend-Task/assets/82027371/c8b7bf75-b8c3-472d-b9f4-7b44b4984013)
![Message change](https://github.com/PiyushPb/BitWise-Frontend-Task/assets/82027371/b662a704-862a-493b-8a67-5ebf632979bb)
![unconnected nodes and edges errors](https://github.com/PiyushPb/BitWise-Frontend-Task/assets/82027371/b810a809-bcd2-4caa-9207-eae7213a88db)


## Usage
- Open the application in your browser (usually at http://localhost:3000).
- Drag and drop nodes from the Nodes Panel to the canvas to create your chatbot flow.
- Connect the nodes using edges.
- Click on a node to edit its text in the Settings Panel.
- Save your flow using the "Save changes" button.

##Code Structure

``` text
.
|---App.css
|---App.jsx
|---file_structure.txt
|---index.css
|---main.jsx
|   
+---Components
|   |---Navbar.jsx
|   |   
|   \---ReactflowContainer
|       |---EditNode.jsx
|       |---ReactflowContainer.jsx
|       |---Sidebar.jsx
|       |   
|       \---Nodes
|               MessageNode.jsx
|               
+---Context
|       NodeContext.jsx
|       
\---Page
        Home.jsx
```

## Components
Home.jsx
- The main component that renders the Navbar and ReactflowContainer components.

Navbar.jsx
- Renders the navigation bar with a "Save changes" button. Uses NodeContext to manage state and handle save operations.

ReactflowContainer.jsx
- The core component that handles the React Flow instance. Manages nodes, edges, and the flow state. Contains functions for handling node drag-and-drop, connections, and saving the flow.

Sidebar.jsx
- Renders the Nodes Panel, allowing users to drag nodes onto the canvas.

MessageNode.jsx
- Renders a text message node.

EditNode.jsx
- Renders the Settings Panel for editing the selected node's text.

Context
NodeContext.jsx
- Provides context for managing the state of the flow, including nodes, edges, and save operations.

Future Improvements
- Add support for more node types.
- Implement undo/redo functionality.
- Improve the user interface and user experience.
- Add more validation checks for node connections.

# Contact details 
- Portfolio : http://piyushis.online/
- Resume : https://piyushis.online/resume
- Linked In : https://www.linkedin.com/in/piyushpardeshi/
