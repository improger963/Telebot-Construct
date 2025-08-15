import React, { useCallback, useMemo } from 'react';
import { useFlowStore } from '../../store/flowStore';
import { useReactFlow, Node } from 'reactflow';
import { blockRegistry } from './blockRegistry';
import { MagicIcon } from '../icons/MagicIcon';

interface ContextMenuProps {
  id: string;
  top: number;
  left: number;
  type: 'node' | 'pane';
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ id, top, left, type, onClose }) => {
  const { duplicateSelectedNode, deleteSelectedElements, addNode } = useFlowStore();
  const { getNode, screenToFlowPosition, setNodes, setEdges, getNodes } = useReactFlow();

  const handleDuplicate = useCallback(() => {
    // We need to ensure the correct node is selected before duplicating
    const selectedNode = getNode(id);
    if(selectedNode){
      const nodes = getNodes();
      setNodes(nodes.map(n => ({...n, selected: n.id === id})))
    }
    // Timeout to allow store to update with the new selection
    setTimeout(() => {
        duplicateSelectedNode();
        onClose();
    }, 50);
  }, [id, getNode, duplicateSelectedNode, onClose, setNodes, getNodes]);

  const handleDelete = useCallback(() => {
    // Similar to duplicate, ensure correct node is selected
    const selectedNode = getNode(id);
    if(selectedNode){
       const nodes = getNodes();
       setNodes(nodes.map(n => ({...n, selected: n.id === id})));
    }
    setTimeout(() => {
        deleteSelectedElements();
        onClose();
    }, 50);
  }, [id, getNode, deleteSelectedElements, onClose, setNodes, getNodes]);

  const handleAddNode = useCallback((nodeType: string) => {
    const config = blockRegistry[nodeType];
    if (!config) return;

    const position = screenToFlowPosition({ x: left, y: top });
    const newNode: Node = {
      id: `${nodeType}_${+new Date()}`,
      type: nodeType,
      position,
      data: config.initialData,
    };
    addNode(newNode);
    onClose();
  }, [left, top, screenToFlowPosition, addNode, onClose]);

  const nodeMenuItems = useMemo(() => [
    { label: 'Duplicate', action: handleDuplicate },
    { label: 'Delete', action: handleDelete, className: 'text-brand-red' },
  ], [handleDuplicate, handleDelete]);

  const paneMenuItems = useMemo(() => [
    { label: 'Add Message Node', action: () => handleAddNode('messageNode') },
    { label: 'Add Text Input', action: () => handleAddNode('inputNode') },
    { label: 'Add Condition', action: () => handleAddNode('conditionNode') },
  ], [handleAddNode]);


  return (
    <div
      style={{ top, left }}
      className="absolute z-50 w-56 bg-surface/80 backdrop-blur-md border border-input rounded-xl shadow-2xl p-2 context-menu"
    >
        {type === 'node' && nodeMenuItems.map(item => (
            <button
                key={item.label}
                onClick={item.action}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-input text-text-primary ${item.className || ''}`}
            >
                {item.label}
            </button>
        ))}
         {type === 'pane' && (
            <div>
                <p className="px-3 py-1 text-xs font-semibold text-text-secondary">Add Node</p>
                {paneMenuItems.map(item => (
                <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-input text-text-primary"
                >
                    {item.label}
                </button>
                ))}
            </div>
         )}
    </div>
  );
};

export default ContextMenu;