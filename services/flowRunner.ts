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
  private static mockDatabase: Record<string, any> = {};

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

  public async start() {
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
      await this.processNode(startNode.id);
    } else {
      this.reportError('Схема должна содержать стартовый блок.');
    }
  }

  public async provideUserInput(input: string) {
    const waitingState = this.onStateChange(undefined, true);
    if (waitingState?.status !== 'waiting' || !waitingState.waitingForInput) return;

    this.addMessage(input, 'user');
    this.variables[waitingState.waitingForInput.variableName] = input;
    
    this.onStateChange({ status: 'running', waitingForInput: undefined, availableButtons: undefined });
    const nextNode = this.findNextNode(waitingState.waitingForInput.nodeId);
    if (nextNode) {
      await this.processNode(nextNode.id);
    } else {
      this.finishFlow();
    }
  }

  public async pressButton(handleId: string) {
    const currentState = this.onStateChange(undefined, true);
    if (currentState.status !== 'waiting') return;

    const button = currentState.availableButtons?.find(b => b.handleId === handleId);
    if (!button) return;

    this.addMessage(button.text, 'user');
    
    if (currentState.waitingForButtonInput) {
        const { nodeId, variableName } = currentState.waitingForButtonInput;
        this.variables[variableName] = button.text;
        this.onStateChange({ status: 'running', waitingForButtonInput: undefined, availableButtons: undefined });
        const nextNode = this.findNextNode(nodeId);
        if (nextNode) await this.processNode(nextNode.id);
        else this.finishFlow();
    } else {
        if (!this.currentNodeId) {
            this.reportError("Кнопка нажата, но нет активного контекста блока.");
            return;
        }
        this.onStateChange({ status: 'running', availableButtons: undefined });
        const nextNode = this.findNextNode(this.currentNodeId, handleId);
        if (nextNode) await this.processNode(nextNode.id);
        else this.finishFlow();
    }
  }
  
  private async processNode(nodeId: string) {
    this.currentNodeId = nodeId;
    this.setActiveNodeId(nodeId);

    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) {
      this.reportError(`Блок с ID ${nodeId} не найден.`);
      return;
    }
    
    // Simulate processing time before executing the node's logic
    await new Promise(resolve => setTimeout(resolve, 500));
    
    switch(node.type) {
        case 'startNode':
            await this.handleStartNode(node); break;
        case 'messageNode': case 'inlineKeyboardNode':
            await this.handleMessageNode(node); break;
        case 'randomMessageNode':
            await this.handleRandomMessageNode(node); break;
        case 'inputNode':
            await this.handleInputNode(node); break;
        case 'buttonInputNode':
            await this.handleButtonInputNode(node); break;
        case 'conditionNode':
            await this.handleConditionNode(node); break;
        case 'switchNode':
            await this.handleSwitchNode(node); break;
        case 'imageNode': case 'videoNode': case 'audioNode': case 'documentNode': case 'stickerNode':
            await this.handleMediaNode(node); break;
        case 'delayNode':
            await this.handleDelayNode(node); break;
        case 'httpRequestNode':
            await this.handleHttpRequestNode(node); break;
        case 'databaseNode':
            await this.handleDatabaseNode(node); break;
        default:
            this.reportError(`Неизвестный тип блока: ${node.type}`);
    }
  }

  private async handleStartNode(node: Node) {
    const nextNode = this.findNextNode(node.id);
    if (nextNode) await this.processNode(nextNode.id);
    else this.finishFlow();
  }

  private async handleMessageNode(node: Node) {
    const text = this.substituteVariables(node.data.text);
    this.addMessage(text, 'bot');
    const hasButtons = node.data.buttons && node.data.buttons.length > 0;
    if (hasButtons) {
      this.onStateChange({ status: 'waiting', availableButtons: node.data.buttons.map(b => ({ text: b.text, handleId: b.id })) });
    } else {
      const nextNode = this.findNextNode(node.id);
      if (nextNode) await this.processNode(nextNode.id);
      else this.finishFlow();
    }
  }
  
  private async handleRandomMessageNode(node: Node) {
    const messages = node.data.messages || [];
    if (messages.length > 0) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        const randomMsg = messages[randomIndex];
        const text = this.substituteVariables(randomMsg.text);
        this.addMessage(text, 'bot');
    }
    const nextNode = this.findNextNode(node.id);
    if (nextNode) await this.processNode(nextNode.id);
    else this.finishFlow();
  }

  private handleInputNode(node: Node) {
    const question = this.substituteVariables(node.data.question);
    this.addMessage(question, 'bot');
    this.onStateChange({ status: 'waiting', waitingForInput: { nodeId: node.id, variableName: node.data.variableName } });
  }

  private handleButtonInputNode(node: Node) {
    const question = this.substituteVariables(node.data.question);
    this.addMessage(question, 'bot');
    this.onStateChange({ status: 'waiting', waitingForButtonInput: { nodeId: node.id, variableName: node.data.variableName }, availableButtons: node.data.buttons.map(b => ({ text: b.text, handleId: b.id })) });
  }

  private async handleMediaNode(node: Node) {
    const caption = this.substituteVariables(node.data.caption);
    const typeName = node.type.replace('Node', '').charAt(0).toUpperCase() + node.type.slice(1, -4);
    this.addMessage(caption || `[${typeName}]`, 'bot', node.data.url);
    const nextNode = this.findNextNode(node.id);
    if (nextNode) await this.processNode(nextNode.id);
    else this.finishFlow();
  }
  
  private async handleDelayNode(node: Node) {
    const delaySeconds = node.data.seconds || 1;
    await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
    const nextNode = this.findNextNode(node.id);
    if (nextNode) await this.processNode(nextNode.id);
    else this.finishFlow();
  }

  private async handleConditionNode(node: Node) {
    const variableName = node.data.variable;
    const valueToCheck = node.data.value;
    const variableValue = this.variables[variableName] || '';
    const result = String(variableValue).toLowerCase().includes(String(valueToCheck).toLowerCase());
    const sourceHandle = result ? 'true' : 'false';
    const nextNode = this.findNextNode(node.id, sourceHandle);
    if (nextNode) await this.processNode(nextNode.id);
    else this.finishFlow();
  }
  
  private async handleSwitchNode(node: Node) {
    const variableName = node.data.variable;
    const variableValue = String(this.variables[variableName] || '');
    const cases = node.data.cases || [];
    const matchedCase = cases.find(c => c.value === variableValue);
    const sourceHandle = matchedCase ? matchedCase.id : 'default';
    const nextNode = this.findNextNode(node.id, sourceHandle);
    if (nextNode) await this.processNode(nextNode.id);
    else this.finishFlow();
  }

  private async handleHttpRequestNode(node: Node) {
    const { url, method, headers, body, responseVariable } = node.data;
    let sourceHandle = 'failure';
    try {
      const substitutedUrl = this.substituteVariables(url);
      const options: RequestInit = {
        method,
        headers: headers.reduce((acc, h) => {
          if(h.key) acc[h.key] = this.substituteVariables(h.value);
          return acc;
        }, {}),
      };
      if (method === 'POST' && body) {
        options.body = this.substituteVariables(body);
      }
      const response = await fetch(substitutedUrl, options);
      if (response.ok) {
        const responseData = await response.text();
        if(responseVariable) this.variables[responseVariable] = responseData;
        sourceHandle = 'success';
      } else {
        if(responseVariable) this.variables[responseVariable] = `Error: ${response.statusText}`;
      }
    } catch (error) {
       if(responseVariable) this.variables[responseVariable] = `Error: ${error.message}`;
    }

    const nextNode = this.findNextNode(node.id, sourceHandle);
    if (nextNode) await this.processNode(nextNode.id);
    else this.finishFlow();
  }

  private async handleDatabaseNode(node: Node) {
    const { action, key, value, resultVariable } = node.data;
    const substitutedKey = this.substituteVariables(key);

    switch(action) {
        case 'SET':
            const substitutedValue = this.substituteVariables(value);
            FlowRunner.mockDatabase[substitutedKey] = substitutedValue;
            break;
        case 'GET':
            if (resultVariable) {
                this.variables[resultVariable] = FlowRunner.mockDatabase[substitutedKey] || null;
            }
            break;
        case 'DELETE':
            delete FlowRunner.mockDatabase[substitutedKey];
            break;
    }
    
    const nextNode = this.findNextNode(node.id);
    if (nextNode) await this.processNode(nextNode.id);
    else this.finishFlow();
  }

  private findNextNode(sourceNodeId: string, sourceHandle?: string) {
    const edge = this.edges.find(e => e.source === sourceNodeId && e.sourceHandle === sourceHandle);
    if (edge) return this.nodes.find(n => n.id === edge.target);
    return null;
  }

  private substituteVariables(text: string): string {
    if (!text) return '';
    return text.replace(/\{(\w+)\}/g, (match, variableName) => this.variables[variableName] || match);
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
