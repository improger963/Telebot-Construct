import type { Node, Edge } from 'reactflow';
import { ComponentType } from 'react';
import { NodeProps } from 'reactflow';

export interface User {
  id: string;
  email: string;
}

export interface Bot {
  id:string;
  name: string;
  telegramToken: string;
  ownerId: string;
  createdAt: string;
}

export type FlowData = {
  nodes: Node[];
  edges: Edge[];
};

// Mock ZodSchema since zod library is not available
// In a real project, you would import this from 'zod'
export type ZodSchema = {
  _def?: any; // Mock property
  parse: (data: any) => any;
};

// Data stored within a node
export interface BlockData {
  [key: string]: any;
}

// New structure for block configuration, defining the "Block Contract"
export interface BlockConfig {
  type: string; // Unique identifier, e.g., 'messageNode'
  name: string; // Display name, e.g., 'Message'
  color: string; // TailwindCSS background color class for the icon in the sidebar
  icon: ComponentType<{ className?: string }>; // Icon component

  // Component for rendering the node itself on the canvas
  component: ComponentType<NodeProps<BlockData>>;

  // Component for rendering the settings panel
  settingsComponent: ComponentType<{ nodeId: string }>;

  // Object with initial data when creating the node
  initialData: BlockData;

  // Schema for validating node data (conceptual)
  validationSchema: ZodSchema;
}

// For the new Form Bot wizard
export interface FormQuestion {
  id: number;
  question: string;
  variableName: string;
}

// For AI Node Suggestions
export interface NodeSuggestion {
  type: string;
  data: BlockData;
  suggestionText: string;
}

// For Statistics Page
export interface BotStats {
    id: string;
    name: string;
    users: number;
    messages: number;
    conversionRate: number;
    messageActivity: number[];
}

export interface OverallStats {
    totalUsers: number;
    totalMessages: number;
    avgConversion: number;
    activeBots: number;
}

export interface StatisticsData {
    overall: OverallStats;
    bots: BotStats[];
}