// This is a mock API client to simulate the backend for development purposes.
// It uses localStorage to persist data.

import { User, Bot, FlowData } from '../types';

const API_DELAY = 300; // ms

// --- MOCK DATABASE (using localStorage) ---

const db = {
  users: JSON.parse(localStorage.getItem('db_users') || '[]'),
  bots: JSON.parse(localStorage.getItem('db_bots') || '[]'),
  flows: JSON.parse(localStorage.getItem('db_flows') || '{}'),
  save() {
    localStorage.setItem('db_users', JSON.stringify(this.users));
    localStorage.setItem('db_bots', JSON.stringify(this.bots));
    localStorage.setItem('db_flows', JSON.stringify(this.flows));
  },
};

// --- AUTH HELPERS ---

const createToken = (user: User) => `mock_token_for_${user.id}`;
const getUserByToken = (token: string | null): User | null => {
  if (!token || !token.startsWith('mock_token_for_')) return null;
  const userId = token.replace('mock_token_for_', '');
  return db.users.find((u: User) => u.id === userId) || null;
};

// --- API CLIENT ---

const apiClient = {
  // AUTH
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = db.users.find((u: any) => u.email === email && u.password === password);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          const token = createToken(userWithoutPassword);
          localStorage.setItem('authToken', token);
          resolve({ user: userWithoutPassword, token });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, API_DELAY);
    });
  },

  async register(email: string, password: string): Promise<{ user: User; token: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (db.users.find((u: any) => u.email === email)) {
          return reject(new Error('Email already in use'));
        }
        const newUser: User = { id: `user_${Date.now()}`, email };
        const fullUser = { ...newUser, password }; // Storing password only in mock DB
        db.users.push(fullUser);
        db.save();

        const token = createToken(newUser);
        localStorage.setItem('authToken', token);
        resolve({ user: newUser, token });
      }, API_DELAY);
    });
  },
  
  logout() {
      localStorage.removeItem('authToken');
  },

  // BOTS
  async getBots(): Promise<Bot[]> {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('authToken');
        const user = getUserByToken(token);
        if (!user) return reject(new Error('Unauthorized'));
        
        setTimeout(() => {
            const userBots = db.bots.filter((b: Bot) => b.ownerId === user.id);
            resolve(userBots);
        }, API_DELAY);
    });
  },

  async getBot(botId: string): Promise<Bot> {
     return new Promise((resolve, reject) => {
        const token = localStorage.getItem('authToken');
        const user = getUserByToken(token);
        if (!user) return reject(new Error('Unauthorized'));

        setTimeout(() => {
            const bot = db.bots.find((b: Bot) => b.id === botId && b.ownerId === user.id);
            if (bot) {
                resolve(bot);
            } else {
                reject(new Error('Bot not found'));
            }
        }, API_DELAY);
     });
  },

  async createBot(botData: { name: string; telegramToken: string }, initialFlow?: FlowData): Promise<Bot> {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('authToken');
        const user = getUserByToken(token);
        if (!user) return reject(new Error('Unauthorized'));

        setTimeout(() => {
            const newBot: Bot = {
                id: `bot_${Date.now()}`,
                ...botData,
                ownerId: user.id,
                createdAt: new Date().toISOString(),
            };
            db.bots.push(newBot);

            if (initialFlow) {
              db.flows[newBot.id] = initialFlow;
            }

            db.save();
            resolve(newBot);
        }, API_DELAY);
    });
  },

  async deleteBot(botId: string): Promise<void> {
     return new Promise((resolve, reject) => {
        const token = localStorage.getItem('authToken');
        const user = getUserByToken(token);
        if (!user) return reject(new Error('Unauthorized'));

        setTimeout(() => {
            const botIndex = db.bots.findIndex((b: Bot) => b.id === botId && b.ownerId === user.id);
            if (botIndex > -1) {
                db.bots.splice(botIndex, 1);
                delete db.flows[botId];
                db.save();
                resolve();
            } else {
                reject(new Error('Bot not found'));
            }
        }, API_DELAY);
     });
  },

  // FLOWS
  async getBotFlow(botId: string): Promise<FlowData> {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('authToken');
        const user = getUserByToken(token);
        if (!user) return reject(new Error('Unauthorized'));

        setTimeout(() => {
            const flow = db.flows[botId];
            if (flow) {
                resolve(flow);
            } else {
                // Return a default flow if none exists
                resolve({
                    nodes: [{ id: '1', type: 'startNode', position: { x: 250, y: 50 }, data: { label: 'Start' } }],
                    edges: [],
                });
            }
        }, API_DELAY);
    });
  },
  
  async saveBotFlow(botId: string, flowData: FlowData): Promise<void> {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('authToken');
        const user = getUserByToken(token);
        if (!user) return reject(new Error('Unauthorized'));

        setTimeout(() => {
            db.flows[botId] = flowData;
            db.save();
            resolve();
        }, API_DELAY);
    });
  }
};

export default apiClient;
