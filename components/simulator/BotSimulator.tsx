import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useFlowStore } from '../../store/flowStore';
import { FlowRunner, SimulatorState } from '../../services/flowRunner';
import { RestartIcon } from '../icons/RestartIcon';
import { CloseIcon } from '../icons/CloseIcon';

interface BotSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  botName: string;
}

const BotSimulator: React.FC<BotSimulatorProps> = ({ isOpen, onClose, botName }) => {
  const { nodes, edges, setActiveNodeId } = useFlowStore();
  const [runner, setRunner] = useState<FlowRunner | null>(null);
  const [simState, setSimState] = useState<SimulatorState>({
    messages: [],
    status: 'finished',
  });
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const simStateRef = useRef(simState);
  useEffect(() => {
    simStateRef.current = simState;
  }, [simState]);


  const handleStateChange = (newState: Partial<SimulatorState> | undefined, returnCurrent = false): SimulatorState => {
    if (returnCurrent) {
      return simStateRef.current;
    }
    setSimState(prevState => ({ ...prevState, ...newState }));
    return { ...simStateRef.current, ...newState };
  };

  useEffect(() => {
    if (isOpen) {
      const newRunner = new FlowRunner(nodes, edges, handleStateChange, setActiveNodeId);
      setRunner(newRunner);
      newRunner.start();
    } else {
      setActiveNodeId(null);
    }
  }, [isOpen, nodes, edges]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simState.messages]);

  const handleRestart = () => {
    runner?.start();
  };

  const handleUserInput = (e: FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && simState.status === 'waiting' && simState.waitingForInput) {
      runner?.provideUserInput(userInput);
      setUserInput('');
    }
  };
  
  const handleClose = () => {
    setActiveNodeId(null);
    onClose();
  }

  const handleButtonPress = (handleId: string) => {
    if (runner) {
        runner.pressButton(handleId);
    }
  };

  return (
    <div className={`simulator-panel fixed top-0 right-0 h-full p-4 z-20 ${isOpen ? 'open' : ''}`}>
        <div className="bg-surface rounded-3xl shadow-2xl w-96 h-full flex flex-col border-4 border-input overflow-hidden animate-slideInFromRight">
            {/* Header */}
            <div className="flex-shrink-0 p-4 bg-input flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-text-primary">{botName}</h3>
                    <p className="text-xs text-brand-green">Online</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleRestart} className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface transition-colors" aria-label="Restart conversation">
                        <RestartIcon className="w-5 h-5" />
                    </button>
                    <button onClick={handleClose} className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface transition-colors" aria-label="Close simulator">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-grow p-4 overflow-y-auto bg-background space-y-4">
                {simState.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-blue text-white rounded-br-lg' : 'bg-input text-text-primary rounded-bl-lg'}`}>
                            {msg.imageUrl && (
                              <img src={msg.imageUrl} alt={msg.text} className="rounded-lg mb-2 max-w-full h-auto" />
                            )}
                            {msg.text && msg.text !== '[Image]' && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
                        </div>
                    </div>
                ))}
                {simState.status === 'running' && (
                    <div className="flex justify-start">
                         <div className="max-w-xs px-4 py-3 rounded-2xl bg-input rounded-bl-lg">
                            <div className="flex items-center gap-2">
                                <span className="block w-2 h-2 bg-text-secondary rounded-full animate-bounce"></span>
                                <span className="block w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                <span className="block w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input or Buttons */}
            <div className="flex-shrink-0 p-3 bg-input border-t border-surface">
                {simState.availableButtons && simState.availableButtons.length > 0 && simState.status === 'waiting' ? (
                    <div className="space-y-2">
                        {simState.availableButtons.map(button => (
                            <button
                                key={button.handleId}
                                onClick={() => handleButtonPress(button.handleId)}
                                className="w-full text-center px-4 py-3 text-brand-blue font-semibold bg-background rounded-full hover:bg-surface transition-colors"
                            >
                                {button.text}
                            </button>
                        ))}
                    </div>
                ) : (
                    <form onSubmit={handleUserInput}>
                        <input
                            type="text"
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            placeholder={simState.waitingForInput ? "Type your message..." : "Waiting for bot..."}
                            disabled={!simState.waitingForInput}
                            className="w-full px-4 py-3 text-text-primary bg-background rounded-full border-none focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-50"
                        />
                    </form>
                )}
            </div>
        </div>
    </div>
  );
};

export default BotSimulator;