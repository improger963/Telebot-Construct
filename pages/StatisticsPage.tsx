import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { StatisticsData, BotStats } from '../types';
import { ChartBarIcon } from '../components/icons/ChartBarIcon';
import { MessageIcon } from '../components/icons/MessageIcon';
import { CrmIcon } from '../components/icons/CrmIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import * as aiService from '../services/aiService';
import { MagicIcon } from '../components/icons/MagicIcon';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-text-secondary text-sm">{title}</p>
                <p className="text-3xl font-bold text-text-primary">{value}</p>
            </div>
        </div>
    </div>
);

const SkeletonStatCard: React.FC = () => (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800"></div>
            <div>
                <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
                <div className="h-8 w-16 bg-slate-700 rounded"></div>
            </div>
        </div>
    </div>
);

const UsersPerBotChart: React.FC<{ data: BotStats[] }> = ({ data }) => {
    const maxUsers = useMemo(() => Math.max(...data.map(b => b.users), 1), [data]);

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 h-96 flex flex-col">
            <h3 className="text-lg font-bold text-text-primary mb-4">Пользователи по ботам</h3>
            <div className="flex-grow flex items-end gap-4">
                {data.map(bot => {
                    const height = (bot.users / maxUsers) * 100;
                    return (
                        <div key={bot.id} className="flex-1 flex flex-col items-center gap-2 group">
                             <div className="w-full h-full flex items-end relative">
                                <div
                                    title={`${bot.name}: ${bot.users} пользователей`}
                                    className="w-full bg-gradient-to-t from-brand-emerald to-brand-teal rounded-t-lg group-hover:opacity-80 transition-all duration-300"
                                    style={{ height: `${height}%` }}
                                >
                                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        {bot.users}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-text-secondary text-center truncate w-full" title={bot.name}>{bot.name}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const MessageActivityChart: React.FC<{ data: BotStats[] }> = ({ data }) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number; day: string } | null>(null);

    const totalActivity = useMemo(() => {
        const activity = Array(7).fill(0);
        data.forEach(bot => {
            bot.messageActivity.forEach((count, i) => {
                if (i < 7) activity[i] += count;
            });
        });
        return activity;
    }, [data]);

    const maxValue = Math.max(...totalActivity, 1);
    const points = totalActivity.map((val, i) => `${(i / 6) * 100},${100 - (val / maxValue) * 100}`).join(' ');

    const labels = Array.from({length: 7}).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    });

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 h-96 flex flex-col">
            <h3 className="text-lg font-bold text-text-primary mb-4">Активность сообщений (7 дней)</h3>
            <div className="flex-grow relative pt-4">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
                    {/* Grid lines */}
                    {Array.from({length: 4}).map((_, i) => (
                        <line key={i} x1="0" y1={(i + 1) * 25} x2="100" y2={(i + 1) * 25} stroke="#334155" strokeWidth="0.2" />
                    ))}
                    
                    <defs>
                        <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                    <polygon fill="url(#activityGradient)" points={`0,100 ${points} 100,100`} />
                    <polyline fill="none" stroke="#10b981" strokeWidth="1" points={points} />
                    
                    {/* Interaction points and tooltips */}
                    {totalActivity.map((val, i) => {
                        const x = (i / 6) * 100;
                        const y = 100 - (val / maxValue) * 100;
                        return (
                             <rect
                                key={`rect-${i}`}
                                x={x - 4}
                                y="0"
                                width="8"
                                height="100"
                                fill="transparent"
                                onMouseEnter={() => setTooltip({ x, y, value: val, day: labels[i] })}
                                onMouseLeave={() => setTooltip(null)}
                            />
                        );
                    })}
                    
                    {tooltip && (
                        <g transform={`translate(${tooltip.x}, ${tooltip.y})`} style={{ pointerEvents: 'none' }}>
                             <foreignObject x="-40" y="-50" width="80" height="40">
                                <div className="bg-surface/90 backdrop-blur-sm border border-accent p-1.5 rounded-lg text-center text-xs shadow-lg animate-scaleIn">
                                    <p className="font-bold text-text-primary">{tooltip.value}</p>
                                    <p className="text-text-secondary">{tooltip.day}</p>
                                </div>
                            </foreignObject>
                            <circle r="3" fill="#020617" stroke="#10b981" strokeWidth="1.5" />
                        </g>
                    )}

                </svg>
                 <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-text-secondary">
                    {labels.map(label => <span key={label}>{label}</span>)}
                </div>
            </div>
        </div>
    );
}

const BotsTable: React.FC<{ data: BotStats[] }> = ({ data }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-800/50">
                    <tr>
                        <th className="p-4 text-sm font-semibold text-text-secondary uppercase tracking-wider">Имя бота</th>
                        <th className="p-4 text-sm font-semibold text-text-secondary uppercase tracking-wider text-right">Пользователи</th>
                        <th className="p-4 text-sm font-semibold text-text-secondary uppercase tracking-wider text-right">Сообщения</th>
                        <th className="p-4 text-sm font-semibold text-text-secondary uppercase tracking-wider text-right">Конверсия</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((bot) => (
                        <tr key={bot.id} 
                            className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/bot/${bot.id}/editor`)}
                        >
                            <td className="p-4 font-medium text-brand-emerald">{bot.name}</td>
                            <td className="p-4 text-text-secondary text-right font-mono">{bot.users.toLocaleString()}</td>
                            <td className="p-4 text-text-secondary text-right font-mono">{bot.messages.toLocaleString()}</td>
                            <td className="p-4 text-text-secondary text-right font-mono">{bot.conversionRate.toFixed(1)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AIInsights: React.FC<{ stats: StatisticsData }> = ({ stats }) => {
    const [insights, setInsights] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getInsights = async () => {
        setIsLoading(true);
        try {
            const result = await aiService.getPerformanceInsights(stats);
            setInsights(result);
        } catch (error) {
            console.error(error);
            setInsights('Не удалось получить аналитику. Попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };

    const formattedInsights = useMemo(() => {
        return insights
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>')
            .replace(/•/g, '<li class="list-disc ml-4">')
            .replace(/\n/g, '<br />');
    }, [insights]);

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">AI-Аналитика производительности</h3>
            {insights ? (
                <div className="prose prose-invert prose-p:text-text-secondary prose-strong:text-text-primary" dangerouslySetInnerHTML={{ __html: formattedInsights }} />
            ) : (
                <div className="text-center py-8">
                    <p className="text-text-secondary mb-6">Получите персональные рекомендации по улучшению ваших ботов от нашего AI-аналитика.</p>
                    <button onClick={getInsights} disabled={isLoading} className="group relative px-6 py-3 font-semibold text-white bg-gradient-to-r from-brand-violet to-brand-teal rounded-xl hover:shadow-lg hover:shadow-brand-violet/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center mx-auto disabled:opacity-50">
                        {isLoading ? <SpinnerIcon className="w-5 h-5 mr-2 animate-spin" /> : <MagicIcon className="w-5 h-5 mr-2" />}
                        {isLoading ? 'Анализ...' : 'Получить рекомендации'}
                    </button>
                </div>
            )}
        </div>
    );
}


const StatisticsPage: React.FC = () => {
    const [stats, setStats] = useState<StatisticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'insights'>('dashboard');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await apiClient.getBotsStatistics();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch statistics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 h-96 animate-pulse"></div>
                        <div className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 h-96 animate-pulse"></div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 h-64 animate-pulse"></div>
                </>
            );
        }

        if (!stats || stats.bots.length === 0) {
            return (
                <div className="text-center py-12 px-6 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl flex flex-col items-center">
                    <h2 className="text-3xl font-bold mb-3 text-text-primary">Нет данных для отображения</h2>
                    <p className="text-text-secondary mb-8 max-w-lg">Чтобы увидеть статистику, вам нужно сначала создать бота. Как только у вашего бота появятся пользователи, здесь появятся данные.</p>
                    <Link
                        to="/dashboard"
                        className="group relative px-8 py-4 font-bold text-lg text-white bg-gradient-to-r from-brand-emerald to-brand-teal rounded-2xl hover:shadow-2xl hover:shadow-brand-emerald/30 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center"
                    >
                        <PlusIcon className="w-6 h-6 mr-3" />
                        Создать первого бота
                    </Link>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Всего пользователей" value={stats.overall.totalUsers.toLocaleString()} icon={<CrmIcon className="w-6 h-6 text-brand-cyan" />} />
                    <StatCard title="Всего сообщений" value={stats.overall.totalMessages.toLocaleString()} icon={<MessageIcon className="w-6 h-6 text-brand-emerald" />} />
                    <StatCard title="Средняя конверсия" value={`${stats.overall.avgConversion.toFixed(1)}%`} icon={<CheckIcon className="w-6 h-6 text-brand-amber" />} />
                    <StatCard title="Активных ботов" value={stats.overall.activeBots.toLocaleString()} icon={<ChartBarIcon className="w-6 h-6 text-brand-violet" />} />
                </div>

                <div className="bg-input p-1 rounded-xl flex gap-1 max-w-sm">
                    <button onClick={() => setActiveTab('dashboard')} className={`w-1/2 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'dashboard' ? 'bg-surface text-text-primary' : 'text-text-secondary hover:bg-surface/50'}`}>
                        <ChartBarIcon className="w-5 h-5" /> Дашборд
                    </button>
                    <button onClick={() => setActiveTab('insights')} className={`w-1/2 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'insights' ? 'bg-surface text-text-primary' : 'text-text-secondary hover:bg-surface/50'}`}>
                        <MagicIcon className="w-5 h-5" /> AI Insights
                    </button>
                </div>
                
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <UsersPerBotChart data={stats.bots} />
                            <MessageActivityChart data={stats.bots} />
                        </div>
                        <BotsTable data={stats.bots} />
                    </div>
                )}
                {activeTab === 'insights' && (
                    <div className="animate-fadeIn">
                        <AIInsights stats={stats} />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-text-primary">Статистика ботов</h1>
                    <p className="text-text-secondary mt-1">Обзор производительности ваших ботов.</p>
                </div>
                <Link to="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors">&larr; Назад к панели</Link>
            </div>
            {renderContent()}
        </div>
    );
};

export default StatisticsPage;