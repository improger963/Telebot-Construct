import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReactFlow, ReactFlowProvider, Background, Controls, Node, ReactFlowInstance, useReactFlow } from 'reactflow';

import { useFlowStore } from '../store/flowStore.ts';
import Sidebar from '../components/editor/Sidebar.tsx';
import SettingsPanel from '../components/editor/SettingsPanel.tsx';
import apiClient from '../services/apiClient.ts';
import { blockRegistry } from '../components/editor/blockRegistry.ts';
import { CheckIcon } from '../components/icons/CheckIcon.tsx';
import WelcomeGuide from '../components/WelcomeGuide.tsx';
import BotSimulator from '../components/simulator/BotSimulator.tsx';
import { PlayIcon } from '../components/icons/PlayIcon.tsx';
import NodeSuggestions from '../components/editor/NodeSuggestions.tsx';
import { NodeSuggestion } from '../types.ts';

const BotEditorPageInternal: React.FC = () => {
  const { botId } = useParams<{ botId: string }>();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setFlow,
    selectedNode,
    addNode,
    setReactFlowInstance,
    addEdge,
  } = useFlowStore();

  const [botName, setBotName] = useState<string>('Loading...');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  const [showWelcome, setShowWelcome] = useState(!localStorage.getItem('hasSeenWelcomeGuide'));
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  
  // Hooks that require context are now correctly used inside the provider's descendant.
  const { screenToFlowPosition, getNode } = useReactFlow();

  const [suggestionState, setSuggestionState] = useState<{
    isOpen: boolean;
    position: { x: number; y: number } | null;
    sourceNode: Node | null;
    sourceHandle: string | null;
  }>({ isOpen: false, position: null, sourceNode: null, sourceHandle: null });


  const nodeTypes = useMemo(() => {
    return Object.values(blockRegistry).reduce((acc, config) => {
        acc[config.type] = config.component;
        return acc;
    }, {} as Record<string, React.ComponentType<any>>);
  }, []);


  useEffect(() => {
    if (botId) {
      const loadFlow = async () => {
        try {
          const flowData = await apiClient.getBotFlow(botId);
          const botData = await apiClient.getBot(botId);
          setFlow(flowData);
          setBotName(botData.name);
        } catch (error) {
          console.error("Failed to load bot data", error);
          setBotName('Unknown Bot');
        }
      };
      loadFlow();
    }
  }, [botId, setFlow]);

  const handleSave = useCallback(async () => {
    if (!botId) return;
    setIsSaving(true);
    setShowSuccess(false);
    try {
      await apiClient.saveBotFlow(botId, { nodes, edges });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to save flow", error);
    } finally {
        setIsSaving(false);
    }
  }, [botId, nodes, edges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const type = event.dataTransfer.getData('application/reactflow');
      const config = blockRegistry[type];

      if (typeof type === 'undefined' || !type || !config) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode: Node = {
        id: `dnd_node_${+new Date()}`,
        type,
        position,
        data: config.initialData,
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );
  
  const handleWelcomeDismiss = () => {
    localStorage.setItem('hasSeenWelcomeGuide', 'true');
    setShowWelcome(false);
  };
  
  const onConnectStart = useCallback((event: React.MouseEvent, { nodeId, handleId }: { nodeId: string; handleId: string | null }) => {
      const node = getNode(nodeId);
      if (node) {
        setSuggestionState({
          isOpen: true,
          position: { x: event.clientX, y: event.clientY },
          sourceNode: node,
          sourceHandle: handleId,
        });
      }
    }, [getNode]);

  const onConnectEnd = useCallback(() => {
    setSuggestionState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleSuggestionClick = useCallback((suggestion: NodeSuggestion) => {
    if (!suggestionState.sourceNode) return;
    
    const sourceNode = suggestionState.sourceNode;
    const { position, width, height } = sourceNode;
    
    // Position the new node below the source node, with fallbacks for safety.
    const newNodePosition = {
      x: position.x + (width || 288) / 2 - 150, // 288px is w-72, a common node width.
      y: position.y + (height || 100) + 75,
    };

    const newNode: Node = {
      id: `ai_node_${+new Date()}`,
      type: suggestion.type,
      position: newNodePosition,
      data: suggestion.data,
    };
    addNode(newNode);
    
    // Connect the nodes
    const newEdge = {
      id: `e-${sourceNode.id}-${newNode.id}`,
      source: sourceNode.id,
      target: newNode.id,
      sourceHandle: suggestionState.sourceHandle,
      animated: true,
    };
    addEdge(newEdge);

    setSuggestionState({ isOpen: false, position: null, sourceNode: null, sourceHandle: null });
  }, [suggestionState.sourceNode, suggestionState.sourceHandle, addNode, addEdge]);

  return (
    <div className="h-screen w-full flex flex-col -m-8 bg-background overflow-hidden">
       <div className="flex justify-between items-center p-4 bg-surface border-b border-input flex-shrink-0 z-10">
            <div className="flex items-center gap-4">
                 <Link to="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors">&larr; Back to Bots</Link>
                <h1 className="text-xl font-bold text-text-primary">Editing: <span className="text-brand-green">{botName}</span></h1>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsSimulatorOpen(true)}
                    className="flex items-center justify-center gap-2 py-2 px-4 font-semibold text-text-primary bg-input rounded-lg hover:bg-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-brand-green transition-all duration-200 ease-in-out active:scale-95"
                >
                  <PlayIcon className="h-5 w-5" />
                  Test Bot
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-32 flex items-center justify-center gap-2 py-2 px-4 font-semibold text-primary-text bg-primary rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-all duration-200 ease-in-out disabled:opacity-70 active:scale-95"
                >
                  {showSuccess ? (
                    <>
                      <CheckIcon className="h-5 w-5" />
                      Saved!
                    </>
                  ) : isSaving ? (
                    'Saving...'
                  ) : (
                    'Save Flow'
                  )}
                </button>
            </div>
        </div>
        <div className="flex-grow flex min-h-0 relative">
            {showWelcome && <WelcomeGuide onDismiss={handleWelcomeDismiss} />}
            <Sidebar />
            <div className="flex-grow h-full" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onConnectStart={onConnectStart}
                    onConnectEnd={onConnectEnd}
                    nodeTypes={nodeTypes}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    fitView
                >
                    <Background color="#3A3A3C" gap={24} />
                    <Controls />
                </ReactFlow>
            </div>
            {selectedNode && <SettingsPanel />}
            <BotSimulator 
              isOpen={isSimulatorOpen}
              onClose={() => setIsSimulatorOpen(false)}
              botName={botName}
            />
            {suggestionState.isOpen && suggestionState.position && suggestionState.sourceNode && (
              <NodeSuggestions
                sourceNode={suggestionState.sourceNode}
                position={suggestionState.position}
                onSelect={handleSuggestionClick}
              />
            )}
        </div>
    </div>
  );
}

const BotEditorPage: React.FC = () => {
  return (
    <ReactFlowProvider>
      <BotEditorPageInternal />
    </ReactFlowProvider>
  );
};

export default BotEditorPage;
