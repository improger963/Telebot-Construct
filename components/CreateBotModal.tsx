
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
            <div key={i} className={`w-8 h-2 rounded-full transition-colors ${i + 1 <= current ? 'bg-brand-emerald' : 'bg-input'}`} />
        ))}
    </div>
);

const ModelSelectorButton: React.FC<{isSelected: boolean, onClick: () => void, title: string, description: string}> = ({ isSelected, onClick, title, description }) => (
    <button
        type="button"
        onClick={onClick}
        className={`p-4 rounded-lg text-left transition-all border-2 ${isSelected ? 'border-brand-emerald bg-brand-emerald/10' : 'border-input bg-input hover:border-accent'}`}
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
    { id: 1, question: 'Как вас зовут?', variableName: 'name' },
  ]);
  const [finalMessage, setFinalMessage] = useState('Спасибо за ваши ответы, {name}!');
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
      setQuestions([{ id: 1, question: 'Как вас зовут?', variableName: 'name' }]);
      setFinalMessage('Спасибо за ваши ответы, {name}!');
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
        alert("Пожалуйста, опишите бота, которого вы хотите создать.");
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
        alert("Произошла ошибка при создании бота. Пожалуйста, попробуйте еще раз.");
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
            <h2 className="text-3xl font-bold mb-2 text-center">Выберите отправную точку</h2>
            <p className="text-text-secondary text-center mb-8">Вы можете начать с ИИ, шаблона или с нуля.</p>
            <div className="space-y-4">
                 <button onClick={() => handleTypeSelect('ai')} className="w-full p-6 bg-slate-800/50 rounded-2xl hover:ring-2 hover:ring-brand-emerald transition-all text-left space-y-2 group border border-brand-emerald/50 shadow-lg shadow-brand-emerald/10">
                    <MagicIcon className="w-10 h-10 text-brand-emerald mb-2 transition-transform group-hover:scale-110"/>
                    <h3 className="font-bold text-lg text-text-primary">Создать с помощью ИИ</h3>
                    <p className="text-sm text-text-secondary">Опишите своего бота простым языком, и пусть ИИ построит схему за вас. Самый быстрый способ начать.</p>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => handleTypeSelect('custom')} className="p-6 bg-slate-800/50 rounded-2xl hover:ring-2 hover:ring-brand-emerald transition-all text-left space-y-2 group border border-slate-700">
                        <CustomBotIcon className="w-10 h-10 text-brand-emerald mb-2 transition-transform group-hover:scale-110"/>
                        <h3 className="font-bold text-lg text-text-primary">Пользовательский бот</h3>
                        <p className="text-sm text-text-secondary">Начните с чистого холста и создайте своего бота с нуля. Лучше всего подходит для уникальной логики.</p>
                    </button>
                    <button onClick={() => handleTypeSelect('form')} className="p-6 bg-slate-800/50 rounded-2xl hover:ring-2 hover:ring-brand-emerald transition-all text-left space-y-2 group border border-slate-700">
                        <FormBotIcon className="w-10 h-10 text-brand-emerald mb-2 transition-transform group-hover:scale-110"/>
                        <h3 className="font-bold text-lg text-text-primary">Форм-бот</h3>
                        <p className="text-sm text-text-secondary">Быстро создайте бота, который задает серию вопросов и сохраняет ответы.</p>
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
                <h2 className="text-2xl font-bold">Детали бота</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Имя бота</label>
                <input type="text" placeholder="Напр. Бот техподдержки" value={botName} onChange={(e) => setBotName(e.target.value)} required className="w-full px-4 py-3 text-text-primary bg-input rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-brand-emerald transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">API токен Telegram</label>
                <input type="text" placeholder="Вставьте ваш токен сюда" value={botToken} onChange={(e) => setBotToken(e.target.value)} required className="w-full px-4 py-3 text-text-primary bg-input rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-brand-emerald transition-all" />
                <p className="text-xs text-text-secondary mt-2">Вы можете получить его в Telegram, написав <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline">@BotFather</a> и создав нового бота.</p>
              </div>
            </div>

            {botType === 'ai' && (
                <>
                    <div className="mt-6 pt-6 border-t border-accent">
                        <h3 className="text-lg font-semibold mb-3 text-text-primary">Выберите модель ИИ</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ModelSelectorButton
                                isSelected={aiModel === 'gemini'}
                                onClick={() => setAiModel('gemini')}
                                title="Google Gemini"
                                description="Последняя модель от Google, мощная и быстрая."
                            />
                            <ModelSelectorButton
                                isSelected={aiModel === 'openai'}
                                onClick={() => setAiModel('openai')}
                                title="OpenAI GPT-4 (Mock)"
                                description="Стандартная модель в индустрии (симуляция)."
                            />
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-accent">
                        <h3 className="text-lg font-semibold mb-2 text-text-primary">Опишите логику вашего бота</h3>
                        <p className="text-sm text-text-secondary mb-4">Объясните, что должен делать ваш бот. Например: "Бот для пиццерии, который спрашивает тип пиццы, размер и адрес доставки."</p>
                        <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows={4} className="w-full px-4 py-3 text-text-primary bg-input rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-brand-emerald transition-all" placeholder="Опишите логику вашего бота здесь..." required></textarea>
                    </div>
                </>
            )}

            {botType === 'form' && (
                <div className="mt-6 pt-6 border-t border-accent">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary">Создайте вашу форму</h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {questions.map((q, index) => (
                            <div key={q.id} className="p-4 bg-background rounded-lg space-y-3 relative group border border-accent">
                                <p className="font-semibold text-text-secondary">Вопрос {index + 1}</p>
                                <input type="text" placeholder="Что вы хотите спросить?" value={q.question} onChange={e => updateQuestion(q.id, 'question', e.target.value)} required className="w-full px-3 py-2 text-text-primary bg-input rounded-md border-none focus:outline-none focus:ring-2 focus:ring-brand-emerald"/>
                                <div>
                                    <input type="text" placeholder="Имя переменной (напр. 'user_name')" value={q.variableName} onChange={e => updateQuestion(q.id, 'variableName', e.target.value)} required className="w-full px-3 py-2 text-text-primary bg-input rounded-md border-none focus:outline-none focus:ring-2 focus:ring-brand-emerald"/>
                                    <p className="text-xs text-text-secondary mt-1">Короткое имя для сохранения ответа. Без пробелов и спецсимволов.</p>
                                </div>
                                {questions.length > 1 && <button type="button" onClick={() => removeQuestion(q.id)} className="absolute top-2 right-2 text-text-secondary hover:text-brand-red opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-surface">&times;</button>}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addQuestion} className="mt-4 text-sm font-medium text-brand-emerald hover:underline">+ Добавить еще вопрос</button>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-text-secondary mb-2">Финальное сообщение</label>
                        <textarea value={finalMessage} onChange={e => setFinalMessage(e.target.value)} rows={2} className="w-full px-4 py-3 text-text-primary bg-input rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-emerald" placeholder="Напр. Спасибо за ваше время!"></textarea>
                        <p className="text-xs text-text-secondary mt-1">Используйте фигурные скобки для вставки переменных, например, {`{${questions[0]?.variableName || 'переменная'}}`}.</p>
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-8 space-x-3">
              <button type="button" onClick={onClose} className="py-2 px-4 bg-input hover:bg-accent rounded-lg transition-colors text-text-primary font-medium">Отмена</button>
              <button type="submit" disabled={isSubmitting} className="w-52 flex justify-center items-center py-2 px-4 bg-gradient-to-r from-brand-emerald to-brand-teal rounded-xl text-white font-semibold disabled:opacity-50 active:scale-95 hover:scale-105 hover:shadow-lg hover:shadow-brand-emerald/25 transition-all">
                {isGenerating && <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                {isGenerating ? 'Генерация...' : isSubmitting ? 'Создание...' : 'Создать и открыть'}
                </button>
            </div>
        </form>
      );
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} backdrop-blur-sm`}>
      <div className="absolute inset-0 bg-black bg-opacity-70" onClick={onClose}></div>
      <div onClick={(e) => e.stopPropagation()} className={`bg-slate-900/70 backdrop-blur-2xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl shadow-emerald-900/20 w-full max-w-2xl transition-all duration-300 ease-out transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default CreateBotModal;