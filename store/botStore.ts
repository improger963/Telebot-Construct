import { create } from 'zustand';
import apiClient from '../services/apiClient.ts';
import { Bot, FlowData } from '../types';

interface BotState {
  bots: Bot[];
  fetchBots: () => Promise<void>;
  createBot: (botData: { name: string; telegramToken: string }, initialFlow?: FlowData) => Promise<Bot>;
  deleteBot: (botId: string) => Promise<void>;
}

export const useBotStore = create<BotState>((set) => ({
  bots: [],
  fetchBots: async () => {
    const bots = await apiClient.getBots();
    set({ bots });
  },
  createBot: async (botData, initialFlow) => {
    const newBot = await apiClient.createBot(botData, initialFlow);
    set((state) => ({ bots: [...state.bots, newBot] }));
    return newBot;
  },
  deleteBot: async (botId: string) => {
    await apiClient.deleteBot(botId);
    set((state) => ({ bots: state.bots.filter((bot) => bot.id !== botId) }));
  },
}));
