import type { Node, Edge } from 'reactflow';
import { BlockData, CartItem, Product } from '../types';

export type SimulatorState = {
  messages: Array<{ id: number; text: string; sender: 'bot' | 'user'; imageUrl?: string; timestamp: string, payment?: { title: string, description: string, amount: string } }>;
  status: 'running' | 'waiting' | 'finished' | 'error';
  waitingForInput?: {
    nodeId: string;
    variableName: string;
  };
   waitingForButtonInput?: {
    nodeId: string;
    variableName: string;
  };
  waitingForLocation?: {
    nodeId: string;
    latVariable: string;
    lonVariable: string;
  };
   waitingForPayment?: {
    nodeId: string;
   };
  availableButtons?: Array<{ text: string; handleId: string }>;
  waitingForMiniAppLaunch?: {
    nodeId: string;
    buttonText: string;
  };
  miniAppIsOpen?: {
    title: string;
    url: string;
    nodeId: string;
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
        waitingForLocation: undefined,
        waitingForPayment: undefined,
        availableButtons: undefined,
        waitingForMiniAppLaunch: undefined,
        miniAppIsOpen: undefined,
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
    if (waitingState?.status !== 'waiting') return;

    this.addMessage(input, 'user');

    if (waitingState.waitingForInput) {
        this.variables[waitingState.waitingForInput.variableName] = input;
        this.onStateChange({ status: 'running', waitingForInput: undefined, availableButtons: undefined });
        const nextNode = this.findNextNode(waitingState.waitingForInput.nodeId);
        if (nextNode) {
          await this.processNode(nextNode.id);
        } else {
          this.finishFlow();
        }
    } else if (waitingState.waitingForLocation) {
        const coords = input.split(',').map(s => s.trim());
        if (coords.length === 2 && !isNaN(parseFloat(coords[0])) && !isNaN(parseFloat(coords[1]))) {
            this.variables[waitingState.waitingForLocation.latVariable] = coords[0];
            this.variables[waitingState.waitingForLocation.lonVariable] = coords[1];
            
            this.onStateChange({ status: 'running', waitingForLocation: undefined });
            const nextNode = this.findNextNode(waitingState.waitingForLocation.nodeId);
            if (nextNode) {
              await this.processNode(nextNode.id);
            } else {
              this.finishFlow();
            }
        } else {
            this.addMessage('Пожалуйста, введите широту и долготу через запятую (например, 55.75, 37.61)', 'bot');
        }
    }
  }

  public async pressButton(handleId: string, paymentResult?: 'success' | 'failure') {
    const currentState = this.onStateChange(undefined, true);
    if (currentState.status !== 'waiting') return;

    if (currentState.waitingForPayment && paymentResult) {
        this.addMessage(`[Симуляция оплаты: ${paymentResult === 'success' ? 'Успешно' : 'Ошибка'}]`, 'user');
        this.onStateChange({ status: 'running', waitingForPayment: undefined });
        const nextNode = this.findNextNode(currentState.waitingForPayment.nodeId, paymentResult);
        if (nextNode) await this.processNode(nextNode.id);
        else this.finishFlow();
        return;
    }


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

  public async launchMiniApp() {
    const currentState = this.onStateChange(undefined, true);
    if (currentState.waitingForMiniAppLaunch) {
        const nodeId = currentState.waitingForMiniAppLaunch.nodeId;
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
            this.addMessage(`[Открывает Mini App: "${node.data.title}"]`, 'user');
            this.onStateChange({ 
                status: 'waiting', 
                waitingForMiniAppLaunch: undefined,
                miniAppIsOpen: {
                    title: this.substituteVariables(node.data.title),
                    url: this.substituteVariables(node.data.url),
                    nodeId: node.id
                }
            });
        }
    }
  }

  public async closeMiniApp() {
      const currentState = this.onStateChange(undefined, true);
      if (currentState.miniAppIsOpen) {
          this.addMessage(`[Закрыл Mini App]`, 'user');
          this.onStateChange({ status: 'running', miniAppIsOpen: undefined });
          const nextNode = this.findNextNode(currentState.miniAppIsOpen.nodeId);
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
        case 'locationNode':
            await this.handleLocationNode(node); break;
        case 'pollNode':
            await this.handlePollNode(node); break;
        case 'emailNode':
            await this.handleEmailNode(node); break;
        case 'crmNode':
            await this.handleCrmNode(node); break;
        case 'productCatalogNode':
            await this.handleProductCatalogNode(node); break;
        case 'shoppingCartNode':
            await this.handleShoppingCartNode(node); break;
        case 'paymentNode':
            await this.handlePaymentNode(node); break;
        case 'subscriptionNode':
            await this.handleSubscriptionNode(node); break;
        case 'miniAppNode':
            await this.handleMiniAppNode(node); break;
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
  
  private async handleLocationNode(node: Node) {
    const question = this.substituteVariables(node.data.question);
    this.addMessage(`${question}\n(Симулятор: введите широту и долготу через запятую, например, 55.75, 37.61)`, 'bot');
    this.onStateChange({ status: 'waiting', waitingForLocation: { nodeId: node.id, latVariable: node.data.latVariable, lonVariable: node.data.lonVariable } });
  }

  private async handlePollNode(node: Node) {
      const question = this.substituteVariables(node.data.question);
      const options = node.data.options.map(o => `\n- ${o.text}`).join('');
      this.addMessage(`[ОПРОС]\nВопрос: ${question}${options}`, 'bot');
      const nextNode = this.findNextNode(node.id);
      if (nextNode) await this.processNode(nextNode.id);
      else this.finishFlow();
  }
  
  private async handleEmailNode(node: Node) {
      const to = this.substituteVariables(node.data.to);
      const subject = this.substituteVariables(node.data.subject);
      const body = this.substituteVariables(node.data.body);
      this.addMessage(`[СИМУЛЯЦИЯ EMAIL]\nКому: ${to}\nТема: ${subject}\n---\n${body}`, 'bot');
      const nextNode = this.findNextNode(node.id);
      if (nextNode) await this.processNode(nextNode.id);
      else this.finishFlow();
  }
  
  private async handleCrmNode(node: Node) {
      const { mappings = [] } = node.data;
      const dataString = mappings
        .map(m => `${m.crmField}: ${this.substituteVariables(`{${m.variableName}}`)}`)
        .join(', ');
      this.addMessage(`[СИМУЛЯЦИЯ CRM]\nОтправлены данные: ${dataString}`, 'bot');
      const nextNode = this.findNextNode(node.id);
      if (nextNode) await this.processNode(nextNode.id);
      else this.finishFlow();
  }

  private async handleProductCatalogNode(node: Node) {
    const products: Product[] = node.data.products || [];
    if (products.length > 0) {
        this.addMessage("Вот наши товары:", "bot");
        for (const product of products) {
            await new Promise(res => setTimeout(res, 300));
            const message = `**${product.name}**\n${product.description}\nЦена: ${product.price} руб.`;
            this.addMessage(message, "bot", product.imageUrl);
        }
    }
    const nextNode = this.findNextNode(node.id);
    if (nextNode) await this.processNode(nextNode.id);
    else this.finishFlow();
  }
  
  private async handleShoppingCartNode(node: Node) {
      const { action, cartVariableName = 'cart', item } = node.data;
      const cart: CartItem[] = this.variables[cartVariableName] || [];

      switch (action) {
          case 'ADD':
              const newItem: CartItem = {
                  id: this.substituteVariables(item.id),
                  name: this.substituteVariables(item.name),
                  price: parseFloat(this.substituteVariables(item.price)),
                  quantity: parseInt(this.substituteVariables(item.quantity), 10),
              };
              const existingItem = cart.find(i => i.id === newItem.id);
              if (existingItem) {
                  existingItem.quantity += newItem.quantity;
              } else {
                  cart.push(newItem);
              }
              this.variables[cartVariableName] = cart;
              this.addMessage(`"${newItem.name}" добавлен в корзину.`, 'bot');
              break;
          case 'VIEW':
              if (cart.length === 0) {
                  this.addMessage('Ваша корзина пуста.', 'bot');
              } else {
                  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
                  const cartContent = cart.map(i => `${i.name} x${i.quantity} - ${i.price * i.quantity} руб.`).join('\n');
                  this.addMessage(`**В вашей корзине:**\n${cartContent}\n\n**Итого: ${total} руб.**`, 'bot');
              }
              break;
          case 'CLEAR':
              this.variables[cartVariableName] = [];
              this.addMessage('Корзина очищена.', 'bot');
              break;
      }

      const nextNode = this.findNextNode(node.id);
      if (nextNode) await this.processNode(nextNode.id);
      else this.finishFlow();
  }

  private async handlePaymentNode(node: Node) {
    const { itemName, amount, currency } = node.data;
    const title = this.substituteVariables(itemName);
    const totalAmount = this.substituteVariables(amount);
    
    this.onStateChange({
        messages: [...this.onStateChange(undefined, true).messages, { 
            id: this.messageCounter++,
            text: '',
            sender: 'bot', 
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            payment: {
                title: title,
                description: "Нажмите для оплаты",
                amount: `${totalAmount} ${currency}`
            }
        }],
        status: 'waiting', 
        waitingForPayment: { nodeId: node.id }
    });
  }

  private async handleSubscriptionNode(node: Node) {
      const { planName, price, period } = node.data;
      this.addMessage(`[СИМУЛЯЦИЯ ПОДПИСКИ]\nПлан: ${planName}\nЦена: ${price} руб. / ${period}`, 'bot');
      const nextNode = this.findNextNode(node.id);
      if (nextNode) await this.processNode(nextNode.id);
      else this.finishFlow();
  }

  private async handleMiniAppNode(node: Node) {
    this.addMessage("Нажмите на кнопку ниже, чтобы открыть приложение:", 'bot');
    this.onStateChange({
        status: 'waiting',
        waitingForMiniAppLaunch: {
            nodeId: node.id,
            buttonText: this.substituteVariables(node.data.buttonText)
        }
    });
  }


  private findNextNode(sourceNodeId: string, sourceHandle?: string) {
    const edge = this.edges.find(e => e.source === sourceNodeId && e.sourceHandle === sourceHandle);
    if (edge) return this.nodes.find(n => n.id === edge.target);
    return null;
  }

  private substituteVariables(text: string): string {
    if (!text) return '';
    return String(text).replace(/\{(\w+)\}/g, (match, variableName) => this.variables[variableName] || match);
  }
  
  private addMessage(text: string, sender: 'bot' | 'user', imageUrl?: string) {
    this.onStateChange({ messages: [...this.onStateChange(undefined, true).messages, { id: this.messageCounter++, text, sender, imageUrl, timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }] });
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