import type { Node, Edge } from 'reactflow';
import { BlockData } from '../types';

export type SimulatorState = {
  messages: Array<{ id: number; text: string; sender: 'bot' | 'user'; imageUrl?: string }>;
  status: 'running' | 'waiting' | 'finished' | 'error';
  waitingForInput?: {
    nodeId: string;
    variableName: string;
  };
   waitingForButtonInput?: {
    nodeId: string;
    variableName: string;
  };
  availableButtons?: Array<{ text: string; handleId: string }>;
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
        waitingForButtonInput: undefined,
        availableButtons: undefined,
    });

    const startNode = this.nodes.find(n => n.type === 'startNode');
    if (startNode) {
      this.processNode(startNode.id);
    } else {
      this.reportError('Схема должна содержать стартовый блок.');
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
    this.onStateChange({ status: 'running', waitingForInput: undefined, availableButtons: undefined });
    const nextNode = this.findNextNode(waitingState.waitingForInput.nodeId);
    if (nextNode) {
      this.processNode(nextNode.id);
    } else {
      this.finishFlow();
    }
  }

  public pressButton(handleId: string) {
    const currentState = this.onStateChange(undefined, true);
    if (currentState.status !== 'waiting') return;

    const button = currentState.availableButtons?.find(b => b.handleId === handleId);
    if (!button) return;

    this.addMessage(button.text, 'user');
    
    if (currentState.waitingForButtonInput) {
        // It's a ButtonInputNode
        const { nodeId, variableName } = currentState.waitingForButtonInput;
        this.variables[variableName] = button.text;
        this.onStateChange({ status: 'running', waitingForButtonInput: undefined, availableButtons: undefined });

        const nextNode = this.findNextNode(nodeId); // Single output
        if (nextNode) {
            this.processNode(nextNode.id);
        } else {
            this.finishFlow();
        }
    } else {
        // It's a MessageNode or InlineKeyboardNode (branching)
        if (!this.currentNodeId) {
            this.reportError("Кнопка нажата, но нет активного контекста блока.");
            return;
        }
        this.onStateChange({ status: 'running', availableButtons: undefined });
        const nextNode = this.findNextNode(this.currentNodeId, handleId);

        if (nextNode) {
            this.processNode(nextNode.id);
        } else {
            this.finishFlow();
        }
    }
  }
  
  private processNode(nodeId: string) {
    this.currentNodeId = nodeId;
    this.setActiveNodeId(nodeId);

    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) {
      this.reportError(`Блок с ID ${nodeId} не найден.`);
      return;
    }

    if (node.type === 'delayNode') {
      this.handleDelayNode(node);
      return;
    }
    
    // Simulate processing time
    setTimeout(() => {
        switch(node.type) {
            case 'startNode':
                this.handleStartNode(node);
                break;
            case 'messageNode':
            case 'inlineKeyboardNode':
                this.handleMessageNode(node);
                break;
            case 'randomMessageNode':
                this.handleRandomMessageNode(node);
                break;
            case 'inputNode':
                this.handleInputNode(node);
                break;
            case 'buttonInputNode':
                this.handleButtonInputNode(node);
                break;
            case 'conditionNode':
                this.handleConditionNode(node);
                break;
            case 'switchNode':
                this.handleSwitchNode(node);
                break;
            case 'imageNode':
                this.handleImageNode(node);
                break;
            default:
                this.reportError(`Неизвестный тип блока: ${node.type}`);
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

    const hasButtons = node.data.buttons && node.data.buttons.length > 0;

    if (hasButtons) {
      this.onStateChange({
        status: 'waiting',
        availableButtons: node.data.buttons.map(b => ({ text: b.text, handleId: b.id })),
      });
    } else {
      const nextNode = this.findNextNode(node.id);
      if (nextNode) {
        this.processNode(nextNode.id);
      } else {
        this.finishFlow();
      }
    }
  }
  
  private handleRandomMessageNode(node: Node) {
    const messages = node.data.messages || [];
    if (messages.length > 0) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        const randomMsg = messages[randomIndex];
        const text = this.substituteVariables(randomMsg.text);
        this.addMessage(text, 'bot');
    }

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

  private handleButtonInputNode(node: Node) {
    const question = this.substituteVariables(node.data.question);
    this.addMessage(question, 'bot');
    this.onStateChange({
        status: 'waiting',
        waitingForButtonInput: {
            nodeId: node.id,
            variableName: node.data.variableName,
        },
        availableButtons: node.data.buttons.map(b => ({ text: b.text, handleId: b.id })),
    });
  }

  private handleImageNode(node: Node) {
    const caption = this.substituteVariables(node.data.caption);
    this.addMessage(caption || '[Изображение]', 'bot', node.data.url);
    const nextNode = this.findNextNode(node.id);
    if (nextNode) {
        this.processNode(nextNode.id);
    } else {
        this.finishFlow();
    }
  }
  
  private handleDelayNode(node: Node) {
    const delaySeconds = node.data.seconds || 1;
    setTimeout(() => {
        const nextNode = this.findNextNode(node.id);
        if (nextNode) {
            this.processNode(nextNode.id);
        } else {
            this.finishFlow();
        }
    }, delaySeconds * 1000);
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
  
  private handleSwitchNode(node: Node) {
    const variableName = node.data.variable;
    const variableValue = String(this.variables[variableName] || '');
    const cases = node.data.cases || [];

    const matchedCase = cases.find(c => c.value === variableValue);
    const sourceHandle = matchedCase ? matchedCase.id : 'default';
    
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
  
  private addMessage(text: string, sender: 'bot' | 'user', imageUrl?: string) {
    this.onStateChange({ messages: [...this.onStateChange(undefined, true).messages, { id: this.messageCounter++, text, sender, imageUrl }] });
  }

  private finishFlow() {
    this.addMessage('Сценарий завершен.', 'bot');
    this.onStateChange({ status: 'finished' });
    this.setActiveNodeId(null);
  }
  
  private reportError(message: string) {
    this.addMessage(`Ошибка: ${message}`, 'bot');
    this.onStateChange({ status: 'error' });
    this.setActiveNodeId(null);
  }
}