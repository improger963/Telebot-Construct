import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useFlowStore } from '../../store/flowStore';
import { FlowRunner, SimulatorState } from '../../services/flowRunner';
import { RestartIcon } from '../icons/RestartIcon';
import { CloseIcon } from '../icons/CloseIcon';
import { PaymentIcon } from '../icons/PaymentIcon';
import { WebAppIcon } from '../icons/WebAppIcon';

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
    if (userInput.trim() && simState.status === 'waiting' && (simState.waitingForInput || simState.waitingForLocation)) {
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
  
  const handlePayment = (result: 'success' | 'failure') => {
    if(runner) {
      runner.pressButton('', result);
    }
  };

  const handleLaunchMiniApp = () => {
    runner?.launchMiniApp();
  };

  const handleCloseMiniApp = () => {
    runner?.closeMiniApp();
  };

  return (
    <div className={`simulator-panel fixed top-20 right-0 h-[calc(100vh-5rem)] p-4 z-20 ${isOpen ? 'open' : ''}`}>
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl w-96 h-full flex flex-col border-2 border-slate-700/50 overflow-hidden animate-slideInFromRight relative">
            {/* Header */}
            <div className="flex-shrink-0 p-4 bg-slate-800/70 flex justify-between items-center border-b border-slate-700/50">
                <div>
                    <h3 className="font-bold text-text-primary">{botName}</h3>
                    <p className="text-xs text-brand-emerald flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-brand-emerald"></span>
                        В сети
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleRestart} className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface transition-colors" aria-label="Перезапустить диалог">
                        <RestartIcon className="w-5 h-5" />
                    </button>
                    <button onClick={handleClose} className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface transition-colors" aria-label="Закрыть симулятор">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-grow p-4 overflow-y-auto bg-background/80 space-y-2" style={{backgroundImage: 'url(https://i.imgur.com/sHi2T0g.png)', backgroundSize: '300px', backgroundBlendMode: 'overlay'}}>
                {simState.messages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-xs px-3 py-2 rounded-2xl relative ${msg.sender === 'user' ? 'bg-emerald-800 text-white rounded-br-none' : 'bg-slate-700 text-text-primary rounded-bl-none'}`}>
                            {msg.imageUrl && (
                              <img src={msg.imageUrl} alt={msg.text} className="rounded-lg mb-2 max-w-full h-auto" />
                            )}
                            {msg.payment ? (
                                <div className="w-56">
                                    <PaymentIcon className="w-8 h-8 text-brand-cyan mb-2" />
                                    <p className="font-bold">{msg.payment.title}</p>
                                    <p className="text-sm">{msg.payment.description}</p>
                                    <p className="font-bold mt-1">{msg.payment.amount}</p>
                                </div>
                            ) : msg.text && msg.text !== '[Image]' && <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />}
                             <span className="text-xs opacity-60 absolute -bottom-4 right-2">{msg.timestamp}</span>
                        </div>
                    </div>
                ))}
                {simState.status === 'running' && (
                    <div className="flex justify-start">
                         <div className="max-w-xs px-4 py-3 rounded-2xl bg-slate-700 rounded-bl-none">
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
            <div className="flex-shrink-0 p-3 bg-slate-800/70 border-t border-slate-700/50">
                {simState.waitingForPayment ? (
                    <div className="space-y-2">
                        <button onClick={() => handlePayment('success')} className="w-full text-center px-4 py-3 text-brand-green font-semibold bg-brand-green/10 rounded-full hover:bg-brand-green/20 transition-colors">
                            Симулировать успешную оплату
                        </button>
                         <button onClick={() => handlePayment('failure')} className="w-full text-center px-4 py-3 text-brand-red font-semibold bg-brand-red/10 rounded-full hover:bg-brand-red/20 transition-colors">
                            Симулировать ошибку оплаты
                        </button>
                    </div>
                ) : simState.availableButtons && simState.availableButtons.length > 0 && simState.status === 'waiting' ? (
                    <div className="space-y-2">
                        {simState.availableButtons.map(button => (
                            <button
                                key={button.handleId}
                                onClick={() => handleButtonPress(button.handleId)}
                                className="w-full text-center px-4 py-3 text-brand-cyan font-semibold bg-input rounded-full hover:bg-surface transition-colors"
                            >
                                {button.text}
                            </button>
                        ))}
                    </div>
                ) : simState.waitingForMiniAppLaunch ? (
                     <div className="p-1">
                        <button onClick={handleLaunchMiniApp} className="w-full text-center px-4 py-3 text-blue-300 font-semibold bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2">
                            <WebAppIcon className="w-5 h-5" />
                            {simState.waitingForMiniAppLaunch.buttonText}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleUserInput}>
                        <input
                            type="text"
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            placeholder={simState.waitingForInput || simState.waitingForLocation ? "Введите ваше сообщение..." : "Ожидание ответа бота..."}
                            disabled={!simState.waitingForInput && !simState.waitingForLocation}
                            className="w-full px-4 py-3 text-text-primary bg-input rounded-full border-none focus:outline-none focus:ring-2 focus:ring-brand-emerald disabled:opacity-50"
                        />
                    </form>
                )}
            </div>

            {/* Mini App Overlay */}
            {simState.miniAppIsOpen && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col p-2 animate-scaleIn">
                    <div className="flex-shrink-0 bg-slate-700 rounded-t-lg p-2 flex items-center justify-between">
                        <p className="text-sm font-bold text-text-primary truncate px-2">{simState.miniAppIsOpen.title}</p>
                        <button onClick={handleCloseMiniApp} className="p-1 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface transition-colors" aria-label="Закрыть Mini App">
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-grow bg-slate-800 rounded-b-lg p-4 flex flex-col items-center justify-center text-center">
                        <WebAppIcon className="w-16 h-16 text-text-secondary mb-4"/>
                        <h4 className="text-lg font-bold">Симуляция Mini App</h4>
                        <p className="text-sm text-text-secondary">Это симуляция вашего веб-приложения.</p>
                        <p className="text-xs text-text-secondary mt-2 break-all">URL: {simState.miniAppIsOpen.url}</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default BotSimulator;