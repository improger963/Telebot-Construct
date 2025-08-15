import { create } from 'zustand';
import {
  addEdge as rfAddEdge,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowInstance
} from 'reactflow';
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeSelectionChange,
} from 'reactflow';
import { FlowData } from '../types';

type RFState = {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  activeNodeId: string | null;
  reactFlowInstance: ReactFlowInstance | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setFlow: (flow: FlowData) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  addNode: (node: Node) => void;
  addEdge: (edge: Edge | Connection) => void;
  setActiveNodeId: (nodeId: string | null) => void;
  setReactFlowInstance: (instance: ReactFlowInstance | null) => void;
};

export const useFlowStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  activeNodeId: null,
  reactFlowInstance: null,
  onNodesChange: (changes: NodeChange[]) => {
    set((state) => {
      const newNodes = applyNodeChanges(changes, state.nodes);
      let newSelectedNode = state.selectedNode;

      // Find if the currently selected node is being deselected
      const isCurrentNodeDeselected = changes.some(c => c.type === 'select' && !c.selected && c.id === state.selectedNode?.id);

      // Find the last node that was selected in this batch of changes
      const lastSelectionChange = changes.filter((c): c is NodeSelectionChange => c.type === 'select' && c.selected).pop();

      if (lastSelectionChange) {
        // If a new node was selected, it becomes the selected node
        newSelectedNode = newNodes.find(n => n.id === lastSelectionChange.id) || null;
      } else if (isCurrentNodeDeselected) {
        // If the current node was deselected and no new node was selected, clear selection
        newSelectedNode = null;
      } else if (state.selectedNode) {
        // If there's still a selected node, check if it was deleted or needs its reference updated
        const updatedNode = newNodes.find(n => n.id === state.selectedNode!.id);
        newSelectedNode = updatedNode || null; // If deleted, it becomes null
      }
      
      // Highlight node on selection for variable panel
      const selectedNodes = newNodes.map(node => ({
        ...node,
        className: lastSelectionChange?.id === node.id ? 'highlight-node' : ''
      }));

      return { nodes: newNodes, selectedNode: newSelectedNode };
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: rfAddEdge(connection, get().edges),
    });
  },
  setFlow: (flow: FlowData) => {
    set({ nodes: flow.nodes, edges: flow.edges, selectedNode: null, activeNodeId: null });
  },
  updateNodeData: (nodeId: string, data: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, ...data };
        }
        return node;
      }),
    });
    // Also update the selected node instance
    if (get().selectedNode?.id === nodeId) {
        const updatedNode = get().nodes.find(n => n.id === nodeId);
        set({ selectedNode: updatedNode ? { ...updatedNode } : null });
    }
  },
  addNode: (node: Node) => {
    set({
      nodes: get().nodes.concat(node),
    });
  },
  addEdge: (edge: Edge | Connection) => {
    set({
        edges: rfAddEdge(edge, get().edges),
    });
  },
  setActiveNodeId: (nodeId: string | null) => {
    set({ activeNodeId: nodeId });
  },
  setReactFlowInstance: (instance: ReactFlowInstance | null) => {
    set({ reactFlowInstance: instance });
  },
}));