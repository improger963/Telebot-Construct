import { GoogleGenAI, Type } from '@google/genai';
import { FlowData, NodeSuggestion, StatisticsData } from '../types';
import { Node, Edge } from 'reactflow';

// Initialize the Gemini client, assuming API_KEY is in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the expected JSON schema for the bot flow
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    nodes: {
      type: Type.ARRAY,
      description: 'An array of node objects for the React Flow canvas.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'Unique identifier for the node.' },
          type: { type: Type.STRING, description: "Node type, e.g., 'startNode', 'messageNode'." },
          position: {
            type: Type.OBJECT,
            description: 'The x and y coordinates of the node on the canvas.',
            properties: {
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
            },
            required: ['x', 'y'],
          },
          data: {
            type: Type.OBJECT,
            description: 'Data specific to the node type.',
            properties: {
                label: { type: Type.STRING, description: "For 'startNode'.", nullable: true },
                text: { type: Type.STRING, description: "For 'messageNode' or 'inlineKeyboardNode'.", nullable: true },
                buttons: {
                    type: Type.ARRAY,
                    description: "For 'messageNode', 'inlineKeyboardNode', or 'buttonInputNode', a list of quick reply buttons.",
                    nullable: true,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING, description: "A unique ID for the button, e.g., 'btn_123'." },
                          text: { type: Type.STRING, description: "The text displayed on the button." }
                        },
                        required: ['id', 'text']
                    }
                },
                question: { type: Type.STRING, description: "For 'inputNode' or 'buttonInputNode'.", nullable: true },
                variableName: { type: Type.STRING, description: "For 'inputNode' or 'buttonInputNode'.", nullable: true },
                variable: { type: Type.STRING, description: "For 'conditionNode'.", nullable: true },
                value: { type: Type.STRING, description: "For 'conditionNode'.", nullable: true },
                url: { type: Type.STRING, description: "For 'imageNode'. URL of the image.", nullable: true },
                caption: { type: Type.STRING, description: "For 'imageNode'. Caption for the image.", nullable: true },
                seconds: { type: Type.NUMBER, description: "For 'delayNode'. Duration of delay in seconds.", nullable: true },
                columns: { type: Type.NUMBER, description: "For 'inlineKeyboardNode'. Number of button columns.", nullable: true },
            }
          },
        },
        required: ['id', 'type', 'position', 'data'],
      },
    },
    edges: {
      type: Type.ARRAY,
      description: 'An array of edge objects connecting the nodes.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'Unique identifier for the edge.' },
          source: { type: Type.STRING, description: 'The ID of the source node.' },
          target: { type: Type.STRING, description: 'The ID of the target node.' },
          animated: { type: Type.BOOLEAN, description: 'Whether the edge should be animated.', nullable: true },
          sourceHandle: { type: Type.STRING, description: "For 'conditionNode' (true/false) or nodes with buttons (the button id).", nullable: true },
        },
        required: ['id', 'source', 'target'],
      },
    },
  },
  required: ['nodes', 'edges'],
};

const getSystemInstruction = () => {
    return `Вы — эксперт по проектированию сценариев для Telegram-ботов. Ваша задача — сгенерировать JSON-структуру, представляющую логику бота, на основе запроса пользователя.
JSON должен соответствовать предоставленной схеме для узлов и ребер, подходящей для рендеринга с помощью React Flow.
Вы должны логически расположить узлы на 2D-холсте, обеспечивая чистый и читаемый макет. Хорошее вертикальное расстояние между узлами составляет 150-200 пикселей.

Вот доступные типы узлов и их обязательные свойства в 'data':
1.  'startNode': Точка входа. Всегда включайте один.
    - data: { "label": "Старт" }
2.  'messageNode': Отправляет сообщение пользователю. Может иметь кнопки быстрого ответа, которые создают отдельные пути вывода.
    - data: { "text": "Ваше сообщение здесь.", "buttons": [{ "id": "btn_123", "text": "Вариант 1" }] }
3.  'inputNode': Задает вопрос и ожидает текстового ответа, сохраняя его в переменную.
    - data: { "question": "Ваш вопрос?", "variableName": "имя_переменной_без_пробелов" }
4.  'conditionNode': Разветвляет поток в зависимости от того, содержит ли переменная определенное значение. Имеет два выхода: 'true' и 'false'.
    - data: { "variable": "переменная_для_проверки", "value": "текст_для_поиска" }
5.  'imageNode': Отправляет изображение.
    - data: { "url": "https://example.com/image.png", "caption": "Необязательная подпись." }
6.  'delayNode': Приостанавливает поток на несколько секунд.
    - data: { "seconds": 3 }
7.  'buttonInputNode': Задает вопрос и предоставляет кнопки для ответа. Сохраняет текст выбранной кнопки в переменную. Имеет один выход.
    - data: { "question": "Ваш вопрос?", "variableName": "сохраненный_выбор", "buttons": [{ "id": "btn_abc", "text": "Выбор 1" }] }
8.  'inlineKeyboardNode': Похож на 'messageNode', отправляет сообщение с прикреплённой к нему клавиатурой, которые создают отдельные пути вывода. Может быть организован в столбцы.
    - data: { "text": "Ваше сообщение здесь.", "buttons": [{ "id": "btn_123", "text": "Вариант 1" }], "columns": 2 }


Правила для ребер:
- Ребра соединяют узлы. Поля 'source' и 'target' должны соответствовать 'id' узлов.
- Для 'conditionNode' вы должны создать два исходящих ребра. Одно должно иметь 'sourceHandle': 'true', а другое 'sourceHandle': 'false'.
- Для 'messageNode' или 'inlineKeyboardNode' с кнопками каждая кнопка должна иметь соответствующее исходящее ребро. 'sourceHandle' ребра должен совпадать с 'id' кнопки.
- Все узлы, кроме ветвящихся (message, condition, inlineKeyboard), должны иметь одно или ноль исходящих ребер без 'sourceHandle'.
- Все ребра должны иметь 'animated': true.

Правила макета:
- Первый узел ('startNode') должен находиться в позиции { x: 350, y: 50 }.
- Последующие узлы должны располагаться ниже предыдущего, увеличивая координату y. Сохраняйте ту же координату x для простого вертикального потока.
- Для ветвлений условий или кнопок размещайте узлы для каждого пути в отдельных столбцах. Например, левый столбец при x: 100, средний при x: 350, правый при x: 600.

Ваш вывод ДОЛЖЕН быть ТОЛЬКО JSON-объектом, идеально соответствующим схеме. Не включайте никакой другой текст, markdown или объяснения.`;
}

const generateWithGemini = async (prompt: string): Promise<FlowData> => {
  console.log('Calling Gemini API with prompt:', prompt);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Сгенерируй схему бота для этого запроса пользователя: "${prompt}"`,
      config: {
        systemInstruction: getSystemInstruction(),
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const flowData = JSON.parse(jsonText);
    
    if (!flowData.nodes || !flowData.edges) {
        throw new Error("Invalid JSON structure received from AI.");
    }

    console.log('Gemini Service received flow data:', flowData);
    return flowData as FlowData;

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Не удалось сгенерировать схему бота с помощью ИИ. Пожалуйста, проверьте ваш запрос или попробуйте позже.');
  }
};

const generateWithOpenAIMock = async (prompt: string): Promise<FlowData> => {
    console.log(`[MOCK] Calling OpenAI with prompt: ${prompt}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    // Return a hardcoded but different flow for demonstration purposes
    return {
        nodes: [
            { id: '1', type: 'startNode', position: { x: 350, y: 50 }, data: { label: 'Старт' } },
            { id: '2', type: 'inputNode', position: { x: 350, y: 200 }, data: { question: 'Здравствуйте! Вам нужна помощь с нашим сервисом? (Ответьте да/нет)', variableName: 'needs_help' } },
            { id: '3', type: 'conditionNode', position: { x: 350, y: 350 }, data: { variable: 'needs_help', value: 'да' } },
            { id: '4', type: 'messageNode', position: { x: 100, y: 500 }, data: { text: 'Без проблем! Пожалуйста, напишите нашей команде поддержки на help@telebot.com, и мы скоро свяжемся с вами.' } },
            { id: '5', type: 'messageNode', position: { x: 600, y: 500 }, data: { text: 'Отлично! Хорошего дня и не стесняйтесь обращаться, если передумаете.' } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', animated: true },
            { id: 'e2-3', source: '2', target: '3', animated: true },
            { id: 'e3-4', source: '3', target: '4', sourceHandle: 'true', animated: true },
            { id: 'e3-5', source: '3', target: '5', sourceHandle: 'false', animated: true },
        ],
    };
};


export const generateFlowFromPrompt = async (prompt: string, model: 'gemini' | 'openai'): Promise<FlowData> => {
  switch (model) {
    case 'gemini':
      return generateWithGemini(prompt);
    case 'openai':
      return generateWithOpenAIMock(prompt);
    default:
      console.error(`Unsupported AI model: ${model}`);
      throw new Error('Unsupported AI model selected.');
  }
};


// New service for getting node suggestions
const suggestionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            type: { type: Type.STRING, description: "Suggested node type (e.g., 'messageNode')." },
            data: { 
                type: Type.OBJECT,
                description: 'Suggested, context-aware initial data for the new node.',
                properties: {
                    text: { type: Type.STRING, nullable: true },
                    question: { type: Type.STRING, nullable: true },
                    variableName: { type: Type.STRING, nullable: true },
                    variable: { type: Type.STRING, nullable: true },
                    value: { type: Type.STRING, nullable: true },
                    buttons: {
                        type: Type.ARRAY,
                        description: "For 'messageNode', a list of quick reply buttons.",
                        nullable: true,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING },
                                text: { type: Type.STRING }
                            },
                            required: ['id', 'text']
                        }
                    },
                    url: { type: Type.STRING, nullable: true },
                    caption: { type: Type.STRING, nullable: true },
                    seconds: { type: Type.NUMBER, nullable: true },
                }
            },
            suggestionText: { type: Type.STRING, description: 'A brief, user-friendly description of the action.' },
        },
        required: ['type', 'data', 'suggestionText'],
    }
};

const getSuggestionSystemInstruction = () => `Вы — эксперт по проектированию сценариев для Telegram-ботов, выступающий в роли интеллектуального помощника. Пользователь строит схему и нуждается в предложениях для следующего логического узла.
- Проанализируйте предоставленный исходный узел, от которого пользователь создает новое соединение.
- На основе типа и данных исходного узла предскажите, что пользователь, скорее всего, захочет сделать дальше.
- Верните JSON-массив из 1-3 предложений. Каждое предложение должно быть объектом, содержащим:
  1. "type": Предлагаемый тип узла (например, 'messageNode', 'inputNode', 'conditionNode', 'imageNode', 'delayNode', 'buttonInputNode').
  2. "data": Предлагаемые начальные данные для нового узла, учитывающие контекст. Например, если исходный узел сохранил переменную 'name', предлагаемый 'messageNode' может иметь текст "Приятно познакомиться, {name}!".
  3. "suggestionText": Краткое, понятное пользователю описание действия, например, "Отправить приветственное сообщение" или "Запросить email".

Примеры сценариев:
- Если исходный узел — 'inputNode', запрашивающий 'name', вы можете предложить 'messageNode', который использует переменную '{name}'.
- Если исходный узел — 'messageNode', который заканчивается вопросом, но не имеет кнопок, вы можете предложить 'buttonInputNode' с кнопками 'Да'/'Нет'.
- Если исходный узел — 'inputNode', вы можете предложить 'conditionNode' для проверки ввода или 'delayNode', чтобы сделать общение более человечным.
- После приветственного сообщения вы можете предложить отправить 'imageNode' с фотографией продукта.

Ваш вывод ДОЛЖЕН быть ТОЛЬКО JSON-массивом. Не включайте никакой другой текст, markdown или объяснения.`;

export const getNodeSuggestions = async (sourceNode: Node, allNodes: Node[], allEdges: Edge[]): Promise<NodeSuggestion[]> => {
    const prompt = `Пользователь соединяет от этого узла: ${JSON.stringify(sourceNode)}. Предложите следующий логический узел(ы). Полный контекст схемы: узлы=${JSON.stringify(allNodes)}, ребра=${JSON.stringify(allEdges)}`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: getSuggestionSystemInstruction(),
                responseMimeType: "application/json",
                responseSchema: suggestionSchema,
            },
        });

        const jsonText = response.text.trim();
        const suggestions = JSON.parse(jsonText);
        return suggestions as NodeSuggestion[];
    } catch (error) {
        console.error('Error getting AI node suggestions:', error);
        // Return a default suggestion on error
        return [
            {
                type: 'messageNode',
                data: { text: 'Новое сообщение' },
                suggestionText: 'Добавить сообщение'
            }
        ];
    }
};


export const getPerformanceInsights = async (stats: StatisticsData): Promise<string> => {
    const systemInstruction = `Вы — эксперт-аналитик по Telegram-ботам. Ваша задача — проанализировать предоставленные данные о производительности и дать краткие, действенные советы по улучшению. Ответ должен быть в формате Markdown.
    - Определите ботов с низкой производительностью (низкое количество пользователей, сообщений или низкая конверсия).
    - Предложите конкретные улучшения. Например, если у бота много пользователей, но мало сообщений, возможно, начальное сообщение недостаточно привлекательно. Если конверсия низкая, возможно, воронка слишком сложная.
    - Отметьте ботов, которые работают хорошо, и укажите, почему.
    - Форматируйте ответ в виде маркированного списка. Используйте **жирный** шрифт для выделения ключевых моментов.`;

    const prompt = `Вот данные о производительности моих ботов. Проанализируй их и дай мне советы по улучшению.
    
    \`\`\`json
    ${JSON.stringify(stats, null, 2)}
    \`\`\``;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error('Error getting AI performance insights:', error);
        return "К сожалению, не удалось получить аналитику от ИИ. Пожалуйста, попробуйте еще раз позже.";
    }
};