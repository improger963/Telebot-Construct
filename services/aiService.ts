import { GoogleGenAI, Type } from '@google/genai';
import { FlowData, NodeSuggestion } from '../types';
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
    return `You are an expert Telegram bot flow designer. Your task is to generate a JSON structure representing a bot's logic based on a user's prompt.
The JSON must adhere to the provided schema for nodes and edges, suitable for rendering with React Flow.
You must logically arrange the nodes on a 2D canvas, ensuring a clean and readable layout. A good vertical distance between nodes is 150-200 pixels.

Here are the available node types and their required 'data' properties:
1.  'startNode': The entry point. Always include one.
    - data: { "label": "Start" }
2.  'messageNode': Sends a message to the user. It can have quick reply buttons, which create separate output paths.
    - data: { "text": "Your message here.", "buttons": [{ "id": "btn_123", "text": "Option 1" }] }
3.  'inputNode': Asks a question and waits for a text reply, saving it to a variable.
    - data: { "question": "Your question?", "variableName": "variable_name_without_spaces" }
4.  'conditionNode': Branches the flow based on whether a variable contains a certain value. It has two outputs: 'true' and 'false'.
    - data: { "variable": "variable_to_check", "value": "text_to_look_for" }
5.  'imageNode': Sends an image.
    - data: { "url": "https://example.com/image.png", "caption": "Optional caption." }
6.  'delayNode': Pauses the flow for a few seconds.
    - data: { "seconds": 3 }
7.  'buttonInputNode': Asks a question and provides buttons for the answer. Saves the chosen button text to a variable. It has a single output.
    - data: { "question": "Your question?", "variableName": "saved_choice", "buttons": [{ "id": "btn_abc", "text": "Choice 1" }] }
8.  'inlineKeyboardNode': Similar to 'messageNode', sends a message with buttons that create separate output paths. Can be arranged in columns.
    - data: { "text": "Your message here.", "buttons": [{ "id": "btn_123", "text": "Option 1" }], "columns": 2 }


Edge Rules:
- Edges connect nodes. The 'source' and 'target' fields must match node 'id's.
- For 'conditionNode', you must create two edges originating from it. One must have 'sourceHandle': 'true' and the other 'sourceHandle': 'false'.
- For 'messageNode' or 'inlineKeyboardNode' with buttons, each button must have a corresponding outgoing edge. The edge's 'sourceHandle' must match the button's 'id'.
- All nodes except branching ones (message, condition, inlineKeyboard) should have one or zero outgoing edges with no 'sourceHandle'.
- All edges should have 'animated': true.

Layout Rules:
- The first node ('startNode') should be at position { x: 350, y: 50 }.
- Subsequent nodes should be positioned below the previous one, increasing the y-coordinate. Keep the x-coordinate the same for a simple vertical flow.
- For condition or button branches, place the nodes for each path in separate columns. For example, left column at x: 100, middle at x: 350, right at x: 600.

Your output MUST be ONLY the JSON object, perfectly matching the schema. Do not include any other text, markdown, or explanations.`;
}

const generateWithGemini = async (prompt: string): Promise<FlowData> => {
  console.log('Calling Gemini API with prompt:', prompt);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a bot flow for this user request: "${prompt}"`,
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
    throw new Error('Failed to generate bot flow from AI. Please check your prompt or try again later.');
  }
};

const generateWithOpenAIMock = async (prompt: string): Promise<FlowData> => {
    console.log(`[MOCK] Calling OpenAI with prompt: ${prompt}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    // Return a hardcoded but different flow for demonstration purposes
    return {
        nodes: [
            { id: '1', type: 'startNode', position: { x: 350, y: 50 }, data: { label: 'Start' } },
            { id: '2', type: 'inputNode', position: { x: 350, y: 200 }, data: { question: 'Hello! Do you need help with our service? (Please answer yes/no)', variableName: 'needs_help' } },
            { id: '3', type: 'conditionNode', position: { x: 350, y: 350 }, data: { variable: 'needs_help', value: 'yes' } },
            { id: '4', type: 'messageNode', position: { x: 100, y: 500 }, data: { text: 'No problem! Please email our support team at help@telebot.com and we will get back to you shortly.' } },
            { id: '5', type: 'messageNode', position: { x: 600, y: 500 }, data: { text: 'Great! Have a wonderful day and feel free to reach out if you change your mind.' } },
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

const getSuggestionSystemInstruction = () => `You are an expert Telegram bot flow designer acting as an intelligent assistant. The user is building a flow and needs suggestions for the next logical node.
- Analyze the provided source node from which the user is creating a new connection.
- Based on the source node's type and data, predict what the user likely wants to do next.
- Return a JSON array of 1 to 3 suggestions. Each suggestion must be an object containing:
  1. "type": The suggested node type (e.g., 'messageNode', 'inputNode', 'conditionNode', 'imageNode', 'delayNode', 'buttonInputNode').
  2. "data": The suggested initial data for the new node. Make it context-aware. For example, if the source node saved a variable 'name', a suggested messageNode could have the text "Nice to meet you, {name}!".
  3. "suggestionText": A brief, user-friendly description of the action, e.g., "Send a welcome message" or "Ask for their email".

Example Scenarios:
- If the source node is an 'inputNode' asking for a 'name', you might suggest a 'messageNode' that uses the '{name}' variable.
- If the source node is a 'messageNode' that ends in a question but has no buttons, you might suggest a 'buttonInputNode' with 'Yes'/'No' buttons.
- If the source node is an 'inputNode', you might suggest a 'conditionNode' to check the input or a 'delayNode' to make it feel more human.
- After a welcome message, you might suggest sending an 'imageNode' with a product photo.

Your output MUST be ONLY the JSON array. Do not include any other text, markdown, or explanations.`;

export const getNodeSuggestions = async (sourceNode: Node, allNodes: Node[], allEdges: Edge[]): Promise<NodeSuggestion[]> => {
    const prompt = `The user is connecting from this node: ${JSON.stringify(sourceNode)}. Suggest the next logical node(s). The full flow context is: nodes=${JSON.stringify(allNodes)}, edges=${JSON.stringify(allEdges)}`;
    
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
                data: { text: 'New message' },
                suggestionText: 'Add a message'
            }
        ];
    }
};