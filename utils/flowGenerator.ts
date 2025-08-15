import { Node, Edge } from 'reactflow';
import { FlowData, FormQuestion } from '../types';
import { blockRegistry } from '../components/editor/blockRegistry';

const X_OFFSET = 350;
const Y_OFFSET = 200;

export const generateFlowFromForm = (questions: FormQuestion[], finalMessage: string): FlowData => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const startNodeConfig = blockRegistry['startNode'];
  const startNode: Node = {
    id: '1',
    type: 'startNode',
    position: { x: X_OFFSET, y: 50 },
    data: { ...startNodeConfig.initialData },
  };
  nodes.push(startNode);

  let lastNodeId = startNode.id;
  let currentY = startNode.position.y + Y_OFFSET;

  const inputNodeConfig = blockRegistry['inputNode'];
  questions.forEach((q) => {
    const nodeId = `input_${q.id}`;
    const inputNode: Node = {
      id: nodeId,
      type: 'inputNode',
      position: { x: X_OFFSET, y: currentY },
      data: {
        ...inputNodeConfig.initialData,
        question: q.question,
        variableName: q.variableName,
      },
    };
    nodes.push(inputNode);

    edges.push({
      id: `e-${lastNodeId}-${nodeId}`,
      source: lastNodeId,
      target: nodeId,
      animated: true,
    });

    lastNodeId = nodeId;
    currentY += Y_OFFSET;
  });

  if (finalMessage.trim()) {
    const messageNodeConfig = blockRegistry['messageNode'];
    const finalNodeId = `final_message_${Date.now()}`;
    const finalMessageNode: Node = {
      id: finalNodeId,
      type: 'messageNode',
      position: { x: X_OFFSET, y: currentY },
      data: {
        ...messageNodeConfig.initialData,
        text: finalMessage,
      },
    };
    nodes.push(finalMessageNode);

    edges.push({
      id: `e-${lastNodeId}-${finalNodeId}`,
      source: lastNodeId,
      target: finalNodeId,
      animated: true,
    });
  }

  return { nodes, edges };
};
