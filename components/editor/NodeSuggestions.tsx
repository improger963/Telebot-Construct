import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { useFlowStore } from '../../store/flowStore';
import * as aiService from '../../services/aiService';
import { NodeSuggestion } from '../../types';
import { MagicIcon } from '../icons/MagicIcon';
import { SpinnerIcon } from '../icons/SpinnerIcon';
import { blockRegistry } from './blockRegistry';

interface NodeSuggestionsProps {
  sourceNode: Node;
  position: { x: number; y: number };
  onSelect: (suggestion: NodeSuggestion) => void;
}

const NodeSuggestions: React.FC<NodeSuggestionsProps> = ({ sourceNode, position, onSelect }) => {
  const { nodes, edges } = useFlowStore();
  const [suggestions, setSuggestions] = useState<NodeSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const result = await aiService.getNodeSuggestions(sourceNode, nodes, edges);
        setSuggestions(result);
      } catch (error) {
        console.error("Failed to fetch node suggestions", error);
        setSuggestions([]); // Clear suggestions on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [sourceNode, nodes, edges]);
  
  const popupStyle: React.CSSProperties = {
    position: 'absolute',
    left: position.x + 15,
    top: position.y + 15,
    zIndex: 100,
  };

  return (
    <div 
        style={popupStyle}
        className="bg-surface/80 backdrop-blur-md border border-input rounded-xl shadow-2xl w-64 p-3 ai-suggestions-popup"
    >
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-green mb-3 px-1">
            <MagicIcon className="w-5 h-5"/>
            <span>AI-подсказки</span>
        </div>
        
        {isLoading ? (
            <div className="flex items-center justify-center p-4">
                <SpinnerIcon className="w-6 h-6 animate-spin text-text-secondary"/>
            </div>
        ) : (
            <div className="space-y-2">
                {suggestions.length > 0 ? suggestions.map((s, i) => {
                    const config = blockRegistry[s.type];
                    if (!config) return null;
                    return (
                        <button 
                            key={i}
                            onClick={() => onSelect(s)}
                            className="w-full text-left p-3 rounded-lg hover:bg-input transition-colors flex items-center gap-3"
                        >
                             <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${config.color}`}>
                                <config.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-text-primary text-sm">{config.name}</p>
                                <p className="text-text-secondary text-xs">{s.suggestionText}</p>
                            </div>
                        </button>
                    )
                }) : (
                    <p className="text-sm text-text-secondary p-2">Нет доступных подсказок.</p>
                )}
            </div>
        )}
    </div>
  );
};

export default NodeSuggestions;