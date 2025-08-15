import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReactFlow, ReactFlowProvider, Background, Controls, Node, ReactFlowInstance, useReactFlow, MiniMap, Edge } from 'reactflow';

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
import { NodeSuggestion, FlowData } from '../types.ts';
import ContextMenu from '../components/editor/ContextMenu.tsx';
import CustomEdge from '../components/editor/edges/CustomEdge.tsx';
import { ExportIcon } from '../components/icons/ExportIcon.tsx';
import { ImportIcon } from '../components/icons/ImportIcon.tsx';
import ConfirmationModal from '../components/ConfirmationModal.tsx';


const proOptions = { hideAttribution: true };

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
    deleteSelectedElements,
    duplicateSelectedNode,
  } = useFlowStore();

  const [botName, setBotName] = useState<string>('Загрузка...');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);
  
  const [showWelcome, setShowWelcome] = useState(!localStorage.getItem('hasSeenWelcomeGuide'));
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
  const [flowToImport, setFlowToImport] = useState<FlowData | null>(null);

  
  const { screenToFlowPosition, getNode } = useReactFlow();

  const [suggestionState, setSuggestionState] = useState<{
    isOpen: boolean;
    position: { x: number; y: number } | null;
    sourceNode: Node | null;
    sourceHandle: string | null;
  }>({ isOpen: false, position: null, sourceNode: null, sourceHandle: null });

  const [menu, setMenu] = useState<{
    id: string;
    top: number;
    left: number;
    type: 'node' | 'pane';
  } | null>(null);


  const nodeTypes = useMemo(() => {
    return Object.values(blockRegistry).reduce((acc, config) => {
        acc[config.type] = config.component;
        return acc;
    }, {} as Record<string, React.ComponentType<any>>);
  }, []);

  const edgeTypes = useMemo(() => ({
    custom: CustomEdge,
  }), []);


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
          setBotName('Неизвестный бот');
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        deleteSelectedElements();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        duplicateSelectedNode();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelectedElements, duplicateSelectedNode, handleSave]);

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
    
    const newNodePosition = {
      x: position.x + (width || 288) / 2 - 150,
      y: position.y + (height || 100) + 75,
    };

    const newNode: Node = {
      id: `ai_node_${+new Date()}`,
      type: suggestion.type,
      position: newNodePosition,
      data: suggestion.data,
    };
    addNode(newNode);
    
    const newEdge: Edge = {
      id: `e-${sourceNode.id}-${newNode.id}`,
      source: sourceNode.id,
      target: newNode.id,
      sourceHandle: suggestionState.sourceHandle,
      animated: true,
      type: 'custom'
    };
    addEdge(newEdge);

    setSuggestionState({ isOpen: false, position: null, sourceNode: null, sourceHandle: null });
  }, [suggestionState.sourceNode, suggestionState.sourceHandle, addNode, addEdge]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setMenu({ id: node.id, top: event.clientY, left: event.clientX, type: 'node' });
    },
    [setMenu]
  );

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setMenu({ id: 'pane', top: event.clientY, left: event.clientX, type: 'pane' });
    },
    [setMenu]
  );
  
  const handleExport = () => {
    const flowJSON = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([flowJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${botName.replace(/\s+/g, '_')}_flow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleImportClick = () => {
    importFileRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedFlow = JSON.parse(content);
          if (Array.isArray(parsedFlow.nodes) && Array.isArray(parsedFlow.edges)) {
            setFlowToImport(parsedFlow);
            setIsImportConfirmOpen(true);
          } else {
            alert('Ошибка: Неверный формат файла. Файл должен содержать массивы "nodes" и "edges".');
          }
        } catch (error) {
          alert('Ошибка: Не удалось прочитать или проанализировать файл.');
        } finally {
            // Reset file input to allow re-uploading the same file
            if(importFileRef.current) {
                importFileRef.current.value = "";
            }
        }
      };
      reader.readAsText(file);
    }
  };

  const confirmImport = () => {
    if (flowToImport) {
      setFlow(flowToImport);
    }
    setIsImportConfirmOpen(false);
    setFlowToImport(null);
  };


  return (
    <div className="h-[calc(100vh-80px)] w-full flex flex-col bg-background overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
       <div className="flex justify-between items-center p-4 bg-slate-900/70 backdrop-blur-xl border-b border-slate-800 flex-shrink-0 z-10">
            <div className="flex items-center gap-4">
                 <Link to="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors">&larr; Назад к панели</Link>
                <h1 className="text-xl font-bold text-text-primary">Редактирование: <span className="text-brand-emerald">{botName}</span></h1>
            </div>
            <div className="flex items-center gap-4">
                <input type="file" ref={importFileRef} onChange={handleFileChange} accept=".json" className="hidden" />
                <button
                    onClick={handleImportClick}
                    className="flex items-center justify-center gap-2 py-2 px-4 font-semibold text-text-primary bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
                    title="Импорт схемы"
                >
                  <ImportIcon className="h-5 w-5" />
                </button>
                 <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 py-2 px-4 font-semibold text-text-primary bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
                    title="Экспорт схемы"
                >
                  <ExportIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={() => setIsSimulatorOpen(true)}
                    className="flex items-center justify-center gap-2 py-2 px-4 font-semibold text-text-primary bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <PlayIcon className="h-5 w-5" />
                  Тестировать
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-36 flex items-center justify-center gap-2 py-2 px-4 font-semibold text-white bg-gradient-to-r from-brand-emerald to-brand-teal rounded-xl hover:shadow-lg hover:shadow-brand-emerald/25 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showSuccess ? (
                    <>
                      <CheckIcon className="h-5 w-5" />
                      Сохранено!
                    </>
                  ) : isSaving ? (
                    'Сохранение...'
                  ) : (
                    'Сохранить'
                  )}
                </button>
            </div>
        </div>
        <div className="flex-grow flex min-h-0 relative">
            {showWelcome && <WelcomeGuide onDismiss={handleWelcomeDismiss} />}
            <Sidebar />
            <div className="flex-grow h-full" ref={reactFlowWrapper} onClick={() => setMenu(null)}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onConnectStart={onConnectStart}
                    onConnectEnd={onConnectEnd}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeContextMenu={onNodeContextMenu}
                    onPaneContextMenu={onPaneContextMenu}
                    fitView
                    proOptions={proOptions}
                >
                    <Background color="#1e293b" gap={24} />
                    <Controls />
                    <MiniMap nodeStrokeWidth={3} zoomable pannable />
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
            {menu && <ContextMenu {...menu} onClose={() => setMenu(null)} />}
            <ConfirmationModal
                isOpen={isImportConfirmOpen}
                onClose={() => setIsImportConfirmOpen(false)}
                onConfirm={confirmImport}
                title="Подтвердите импорт"
                message="Вы уверены, что хотите импортировать новую схему? Текущая схема будет перезаписана."
                confirmText="Да, импортировать"
                cancelText="Отмена"
                isDestructive={true}
            />
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