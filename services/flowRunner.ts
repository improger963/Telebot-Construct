import type { Node, Edge } from 'reactflow';
import { BlockData } from '../types';

export type SimulatorState = {
  messages: Array<{ id: number; text: string; sender: 'bot' | 'user' }>;
  status: 'running' | 'waiting' | 'finished' | 'error';
  waitingForInput?: {
    nodeId: string;
    variableName: string;
  };
};

type StateChangeCallback = (
  newState: Partial<SimulatorState> | undefined,
  returnCurrent?: boolean
) => SimulatorState;
type SetActiveNodeCallback = (nodeId: string | null) => void;

export class FlowRunner {
  private nodes: Node<BlockData>[];
  private edges: Edge[];
  private variables: Record<string, any> = {};
  private currentNodeId: string | null = null;
  private onStateChange: StateChangeCallback;
  private setActiveNodeId: SetActiveNodeCallback;
  private messageCounter = 0;

  constructor(
    nodes: Node[],
    edges: Edge[],
    onStateChange: StateChangeCallback,
    setActiveNodeId: SetActiveNodeCallback
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.onStateChange = onStateChange;
    this.setActiveNodeId = setActiveNodeId;
  }

  public start() {
    this.variables = {};
    this.messageCounter = 0;
    this.onStateChange({
        messages: [],
        status: 'running',
        waitingForInput: undefined,
    });

    const startNode = this.nodes.find(n => n.type === 'startNode');
    if (startNode) {
      this.processNode(startNode.id);
    } else {
      this.reportError('Flow must have a Start node.');
    }
  }

  public provideUserInput(input: string) {
    const waitingState = this.onStateChange(undefined, true);
    if (waitingState?.status !== 'waiting' || !waitingState.waitingForInput) return;

    // Add user message to history
    this.addMessage(input, 'user');
    
    // Store variable
    this.variables[waitingState.waitingForInput.variableName] = input;
    
    // Continue flow
    this.onStateChange({ status: 'running', waitingForInput: undefined });
    const nextNode = this.findNextNode(waitingState.waitingForInput.nodeId);
    if (nextNode) {
      this.processNode(nextNode.id);
    } else {
      this.finishFlow();
    }
  }
  
  private processNode(nodeId: string) {
    this.currentNodeId = nodeId;
    this.setActiveNodeId(nodeId);

    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) {
      this.reportError(`Node with ID ${nodeId} not found.`);
      return;
    }
    
    // Simulate processing time
    setTimeout(() => {
        switch(node.type) {
            case 'startNode':
                this.handleStartNode(node);
                break;
            case 'messageNode':
                this.handleMessageNode(node);
                break;
            case 'inputNode':
                this.handleInputNode(node);
                break;
            case 'conditionNode':
                this.handleConditionNode(node);
                break;
            default:
                this.reportError(`Unknown node type: ${node.type}`);
        }
    }, 500);
  }

  private handleStartNode(node: Node) {
    const nextNode = this.findNextNode(node.id);
    if (nextNode) {
      this.processNode(nextNode.id);
    } else {
      this.finishFlow();
    }
  }

  private handleMessageNode(node: Node) {
    const text = this.substituteVariables(node.data.text);
    this.addMessage(text, 'bot');
    const nextNode = this.findNextNode(node.id);
    if (nextNode) {
      this.processNode(nextNode.id);
    } else {
      this.finishFlow();
    }
  }

  private handleInputNode(node: Node) {
    const question = this.substituteVariables(node.data.question);
    this.addMessage(question, 'bot');
    this.onStateChange({
        status: 'waiting',
        waitingForInput: {
            nodeId: node.id,
            variableName: node.data.variableName
        }
    });
  }

  private handleConditionNode(node: Node) {
    const variableName = node.data.variable;
    const valueToCheck = node.data.value;
    const variableValue = this.variables[variableName] || '';
    
    const result = String(variableValue).toLowerCase().includes(String(valueToCheck).toLowerCase());
    
    const sourceHandle = result ? 'true' : 'false';
    const nextNode = this.findNextNode(node.id, sourceHandle);

    if (nextNode) {
        this.processNode(nextNode.id);
    } else {
        this.finishFlow();
    }
  }
  
  private findNextNode(sourceNodeId: string, sourceHandle?: string) {
    const edge = this.edges.find(e => e.source === sourceNodeId && e.sourceHandle === sourceHandle);
    if (edge) {
      return this.nodes.find(n => n.id === edge.target);
    }
    return null;
  }

  private substituteVariables(text: string): string {
    if (!text) return '';
    return text.replace(/\{(\w+)\}/g, (match, variableName) => {
      return this.variables[variableName] || match;
    });
  }
  
  private addMessage(text: string, sender: 'bot' | 'user') {
    this.onStateChange({ messages: [...this.onStateChange(undefined, true).messages, { id: this.messageCounter++, text, sender }] });
  }

  private finishFlow() {
    this.addMessage('The flow has ended.', 'bot');
    this.onStateChange({ status: 'finished' });
    this.setActiveNodeId(null);
  }
  
  private reportError(message: string) {
    this.addMessage(`Error: ${message}`, 'bot');
    this.onStateChange({ status: 'error' });
    this.setActiveNodeId(null);
  }
}
