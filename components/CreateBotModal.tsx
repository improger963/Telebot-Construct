import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBotStore } from '../store/botStore';
import { FlowData, FormQuestion } from '../types';
import { generateFlowFromForm } from '../utils/flowGenerator';
import { CustomBotIcon } from './icons/CustomBotIcon';
import { FormBotIcon } from './icons/FormBotIcon';
import { MagicIcon } from './icons/MagicIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import * as aiService from '../services/aiService';

interface CreateBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BotType = 'custom' | 'form' | 'ai';
type AiModel = 'gemini' | 'openai';
type WizardStep = 'type' | 'details';

const WizardStepIndicator: React.FC<{ current: number, total: number }> = ({ current, total }) => (
    <div className="flex justify-center items-center gap-2 mb-6">
        {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`w-8 h-2 rounded-full transition-colors ${i + 1 <= current ? 'bg-brand-green' : 'bg-input'}`} />
        ))}
    </div>
);

const ModelSelectorButton: React.FC<{isSelected: boolean, onClick: () => void, title: string, description: string}> = ({ isSelected, onClick, title, description }) => (
    <button
        type="button"
        onClick={onClick}
        className={`p-4 rounded-lg text-left transition-all border-2 ${isSelected ? 'border-brand-green bg-brand-green/10' : 'border-input bg-input hover:border-accent'}`}
    >
        <h4 className="font-bold text-text-primary">{title}</h4>
        <p className="text-xs text-text-secondary mt-1">{description}</p>
    </button>
);


const CreateBotModal: React.FC<CreateBotModalProps> = ({ isOpen, onClose }) => {
  const { createBot } = useBotStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<WizardStep>('type');
  const [botType, setBotType] = useState<BotType | null>(null);
  const [botName, setBotName] = useState('');
  const [botToken, setBotToken] = useState('');
  const [questions, setQuestions] = useState<FormQuestion[]>([
    { id: 1, question: 'What is your name?', variableName: 'name' },
  ]);
  const [finalMessage, setFinalMessage] = useState('Thanks for your answers, {name}!');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiModel, setAiModel] = useState<AiModel>('gemini');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);


  useEffect(() => {
    // Reset state when modal is closed/opened
    if (isOpen) {
      setStep('type');
      setBotType(null);
      setBotName('');
      setBotToken('');
      setQuestions([{ id: 1, question: 'What is your name?', variableName: 'name' }]);
      setFinalMessage('Thanks for your answers, {name}!');
      setAiPrompt('');
      setAiModel('gemini');
      setIsSubmitting(false);
      setIsGenerating(false);
    }
  }, [isOpen]);

  const handleTypeSelect = (type: BotType) => {
    setBotType(type);
    setStep('details');
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), question: '', variableName: '' }]);
  };

  const updateQuestion = (id: number, field: 'question' | 'variableName', value: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };
  
  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!botName.trim() || !botToken.trim()) return;
    if (botType === 'ai' && !aiPrompt.trim()) {
        alert("Please describe the bot you want to create.");
        return;
    }
    
    setIsSubmitting(true);
    let initialFlow: FlowData | undefined = undefined;

    try {
        if (botType === 'form') {
            initialFlow = generateFlowFromForm(questions, finalMessage);
        } else if (botType === 'ai') {
            setIsGenerating(true);
            initialFlow = await aiService.generateFlowFromPrompt(aiPrompt, aiModel);
            setIsGenerating(false);
        }

        const newBot = await createBot({ name: botName, telegramToken: botToken }, initialFlow);
        onClose();
        navigate(`/bot/${newBot.id}/editor`);
    } catch (error) {
        console.error("Failed to create bot", error);
        alert("There was an error creating your bot. Please try again.");
    } finally {
        setIsSubmitting(false);
        setIsGenerating(false);
    }
  };

  const renderContent = () => {
    if (step === 'type') {
      return (
        <>
            <WizardStepIndicator current={1} total={2} />
            <h2 className="text-2xl font-bold mb-2 text-center">Choose a starting point</h2>
            <p className="text-text-secondary text-center mb-6">You can start with AI, a template, or from scratch.</p>
            <div className="space-y-4">
                 <button onClick={() => handleTypeSelect('ai')} className="w-full p-6 bg-input rounded-xl hover:ring-2 hover:ring-brand-green transition-all text-left space-y-2 group border border-brand-green/50 shadow-lg shadow-brand-green/10">
                    <MagicIcon className="w-10 h-10 text-brand-green mb-2 transition-transform group-hover:scale-110"/>
                    <h3 className="font-bold text-lg text-text-primary">Create with AI</h3>
                    <p className="text-sm text-text-secondary">Describe your bot in plain language, and let AI build the flow for you. The fastest way to get started.</p>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => handleTypeSelect('custom')} className="p-6 bg-input rounded-xl hover:ring-2 hover:ring-brand-green transition-all text-left space-y-2 group">
                        <CustomBotIcon className="w-10 h-10 text-brand-green mb-2 transition-transform group-hover:scale-110"/>
                        <h3 className="font-bold text-lg text-text-primary">Custom Bot</h3>
                        <p className="text-sm text-text-secondary">Start with a blank canvas and build your bot from scratch. Best for unique logic.</p>
                    </button>
                    <button onClick={() => handleTypeSelect('form')} className="p-6 bg-input rounded-xl hover:ring-2 hover:ring-brand-green transition-all text-left space-y-2 group">
                        <FormBotIcon className="w-10 h-10 text-brand-green mb-2 transition-transform group-hover:scale-110"/>
                        <h3 className="font-bold text-lg text-text-primary">Form Bot</h3>
                        <p className="text-sm text-text-secondary">Quickly create a bot that asks a series of questions and saves the answers.</p>
                    </button>
                </div>
            </div>
        </>
      );
    }

    if (step === 'details') {
      return (
        <form onSubmit={handleSubmit}>
            <WizardStepIndicator current={2} total={2} />
            <div className="flex items-center gap-4 mb-6">
                <button type="button" onClick={() => setStep('type')} className="p-2 rounded-full hover:bg-input transition-colors -ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-2xl font-bold">Bot Details</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Bot Name</label>
                <input type="text" placeholder="e.g. Customer Support Bot" value={botName} onChange={(e) => setBotName(e.target.value)} required className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Telegram API Token</label>
                <input type="text" placeholder="Paste your token here" value={botToken} onChange={(e) => setBotToken(e.target.value)} required className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green" />
                <p className="text-xs text-text-secondary mt-2">You can get this from Telegram by talking to <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">@BotFather</a> and creating a new bot.</p>
              </div>
            </div>

            {botType === 'ai' && (
                <>
                    <div className="mt-6 pt-6 border-t border-input">
                        <h3 className="text-lg font-semibold mb-3 text-text-primary">Choose AI Model</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ModelSelectorButton
                                isSelected={aiModel === 'gemini'}
                                onClick={() => setAiModel('gemini')}
                                title="Google Gemini"
                                description="Latest model from Google, powerful and fast."
                            />
                            <ModelSelectorButton
                                isSelected={aiModel === 'openai'}
                                onClick={() => setAiModel('openai')}
                                title="OpenAI GPT-4 (Mock)"
                                description="Industry-standard model (simulated)."
                            />
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-input">
                        <h3 className="text-lg font-semibold mb-2 text-text-primary">Describe Your Bot's Logic</h3>
                        <p className="text-sm text-text-secondary mb-4">Explain what your bot should do. For example: "A bot for a pizza shop that asks for pizza type, size, and delivery address."</p>
                        <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows={4} className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green" placeholder="Describe your bot's logic here..." required></textarea>
                    </div>
                </>
            )}

            {botType === 'form' && (
                <div className="mt-6 pt-6 border-t border-input">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary">Build Your Form</h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {questions.map((q, index) => (
                            <div key={q.id} className="p-4 bg-background rounded-lg space-y-3 relative group">
                                <p className="font-semibold text-text-secondary">Question {index + 1}</p>
                                <input type="text" placeholder="What would you like to ask?" value={q.question} onChange={e => updateQuestion(q.id, 'question', e.target.value)} required className="w-full px-3 py-2 text-text-primary bg-input rounded-md border-none focus:outline-none focus:ring-2 focus:ring-brand-green"/>
                                <div>
                                    <input type="text" placeholder="Variable name (e.g. 'user_name')" value={q.variableName} onChange={e => updateQuestion(q.id, 'variableName', e.target.value)} required className="w-full px-3 py-2 text-text-primary bg-input rounded-md border-none focus:outline-none focus:ring-2 focus:ring-brand-green"/>
                                    <p className="text-xs text-text-secondary mt-1">A short name to save the answer. No spaces or special characters.</p>
                                </div>
                                {questions.length > 1 && <button type="button" onClick={() => removeQuestion(q.id)} className="absolute top-2 right-2 text-text-secondary hover:text-brand-red opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-surface">&times;</button>}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addQuestion} className="mt-4 text-sm font-medium text-brand-green hover:underline">+ Add Another Question</button>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-text-secondary mb-2">Final Message</label>
                        <textarea value={finalMessage} onChange={e => setFinalMessage(e.target.value)} rows={2} className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-green" placeholder="e.g. Thanks for your time!"></textarea>
                        <p className="text-xs text-text-secondary mt-1">Use curly braces to insert variables, e.g., {`{${questions[0]?.variableName || 'variable'}}`}.</p>
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-8 space-x-3">
              <button type="button" onClick={onClose} className="py-2 px-4 bg-input hover:bg-gray-700 rounded-lg transition-colors text-text-primary font-medium">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="w-48 flex justify-center items-center py-2 px-4 bg-primary hover:bg-gray-200 rounded-lg transition-colors text-primary-text font-semibold disabled:opacity-50 active:scale-95">
                {isGenerating && <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                {isGenerating ? 'Generating...' : isSubmitting ? 'Creating...' : 'Create & Open Editor'}
                </button>
            </div>
        </form>
      );
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} backdrop-blur-sm`}>
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose}></div>
      <div onClick={(e) => e.stopPropagation()} className={`bg-surface p-8 rounded-2xl shadow-xl w-full max-w-2xl transition-all duration-300 ease-out transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default CreateBotModal;